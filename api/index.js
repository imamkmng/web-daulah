const express = require('express');
const { createClient } = require('@libsql/client');
const { Parser } = require('json2csv');

const JAKARTA_TIME_ZONE = 'Asia/Jakarta';
const jakartaDateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: JAKARTA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
});

function getJakartaParts(date = new Date()) {
    const parts = jakartaDateTimeFormatter.formatToParts(date);
    return parts.reduce((acc, part) => {
        if (part.type !== 'literal') {
            acc[part.type] = part.value;
        }
        return acc;
    }, {});
}

function normalizeTimestamp(timestamp) {
    if (!timestamp) {
        return new Date();
    }
    if (timestamp instanceof Date) {
        return timestamp;
    }
    if (typeof timestamp === 'number') {
        return new Date(timestamp);
    }
    if (typeof timestamp === 'string') {
        const trimmed = timestamp.trim();
        if (trimmed.endsWith('Z') || trimmed.includes('+')) {
            return new Date(trimmed);
        }
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(trimmed)) {
            return new Date(trimmed.replace(' ', 'T') + 'Z');
        }
        return new Date(trimmed);
    }
    return new Date(timestamp);
}

function formatTimestampToJakarta(timestamp) {
    const date = normalizeTimestamp(timestamp);
    const parts = getJakartaParts(date);
    return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function getJakartaDateForFilename(date = new Date()) {
    const parts = getJakartaParts(date);
    return `${parts.year}-${parts.month}-${parts.day}`;
}

// Fix for BigInt serialization in JSON (important for Vercel deployment)
BigInt.prototype.toJSON = function() {
    return Number(this);
};

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// Initialize Turso Database Connection
let db;

try {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
        console.error('Missing Turso environment variables!');
        console.error('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? 'Set' : 'Missing');
        console.error('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? 'Set' : 'Missing');
    }

    db = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN
    });

    console.log('Turso database client created successfully');
} catch (error) {
    console.error('Failed to create Turso client:', error);
}

// Initialize database table
async function initializeDatabase() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                score INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Call initialization
initializeDatabase();

// ===================================
// API ENDPOINTS
// ===================================

// GET /api/scores - Retrieve all scores, sorted by score (descending) and timestamp
app.get('/api/scores', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM scores ORDER BY score DESC, timestamp ASC');
        res.json(result.rows || []);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json([]);
    }
});

// POST /api/scores - Add a new score
app.post('/api/scores', async (req, res) => {
    console.log('POST /api/scores - Request received');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    const { nama, skor } = req.body;

    // Validate nama
    if (!nama || nama.trim() === '') {
        console.log('Validation failed: Missing or empty nama');
        return res.status(400).json({
            success: false,
            error: 'Nama tidak boleh kosong'
        });
    }

    // Validate skor - convert to number if string
    let scoreValue = skor;
    if (typeof skor === 'string') {
        scoreValue = parseInt(skor, 10);
    }

    if (scoreValue === undefined || scoreValue === null) {
        console.log('Validation failed: Missing skor');
        return res.status(400).json({
            success: false,
            error: 'Skor tidak boleh kosong'
        });
    }

    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 10) {
        console.log('Validation failed: Invalid score value:', scoreValue);
        return res.status(400).json({
            success: false,
            error: 'Skor harus berupa angka antara 0 dan 10',
            received: { nama, skor, scoreValue, type: typeof skor }
        });
    }

    // Check if database is initialized
    if (!db) {
        console.error('Database not initialized');
        return res.status(500).json({
            success: false,
            error: 'Database connection not available',
            hint: 'TURSO environment variables may not be set'
        });
    }

    try {
        console.log('Attempting to insert score:', { nama: nama.trim(), scoreValue });

        const result = await db.execute({
            sql: 'INSERT INTO scores (name, score, timestamp) VALUES (?, ?, ?)',
            args: [nama.trim(), scoreValue, new Date().toISOString()]
        });

        console.log('Score inserted successfully');
        console.log('Insert result:', result);

        // Convert BigInt to Number to avoid serialization issues
        const insertId = typeof result.lastInsertRowid === 'bigint'
            ? Number(result.lastInsertRowid)
            : result.lastInsertRowid;

        const response = {
            success: true,
            id: insertId,
            message: 'Skor berhasil disimpan'
        };

        console.log('Sending response:', response);

        return res.status(201).json(response);
    } catch (error) {
        console.error('Error inserting score:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });

        return res.status(500).json({
            success: false,
            error: 'Gagal menyimpan skor ke database',
            details: error.message,
            hint: 'Periksa Vercel function logs atau environment variables'
        });
    }
});

// ===================================
// ADMIN ENDPOINTS
// ===================================

// POST /admin/login - Admin login
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials (as per requirements)
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'password123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({
            success: true,
            message: 'Login successful'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Username atau password salah'
        });
    }
});

// GET /admin/download - Download scores as CSV
app.get('/admin/download', async (req, res) => {
    try {
        const result = await db.execute('SELECT id, name, score, timestamp FROM scores ORDER BY score DESC, timestamp ASC');
        const rows = result.rows;

        console.log('CSV Download - Total rows:', rows.length);
        console.log('Sample data:', rows[0]);

        // Format data for CSV
        const formattedData = rows.map((row, index) => ({
            'No': index + 1,
            'Nama Pengguna': row.name,
            'Skor': row.score,
            'Tanggal & Waktu': formatTimestampToJakarta(row.timestamp)
        }));

        // Convert to CSV with UTF-8 BOM and semicolon delimiter for better Excel compatibility
        const parser = new Parser({
            fields: ['No', 'Nama Pengguna', 'Skor', 'Tanggal & Waktu'],
            delimiter: ',',
            withBOM: true,
            header: true
        });
        const csv = parser.parse(formattedData);

        // Add UTF-8 BOM manually if json2csv doesn't add it
        const csvWithBOM = '\uFEFF' + csv;

        // Set headers for file download with proper charset
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="scores-' + getJakartaDateForFilename() + '.csv"');

        console.log('Sending CSV with', formattedData.length, 'rows');
        res.send(csvWithBOM);
    } catch (error) {
        console.error('Error generating CSV:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            error: 'Failed to generate CSV',
            details: error.message
        });
    }
});

// DELETE /admin/reset - Reset all scores
app.delete('/admin/reset', async (req, res) => {
    try {
        const result = await db.execute('DELETE FROM scores');

        res.json({
            success: true,
            message: 'Semua data berhasil direset',
            deletedRows: result.rowsAffected
        });
    } catch (error) {
        console.error('Error resetting scores:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mereset data'
        });
    }
});

// Export the Express app for Vercel serverless function
module.exports = app;
