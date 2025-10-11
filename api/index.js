const express = require('express');
const { createClient } = require('@libsql/client');
const { Parser } = require('json2csv');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Turso Database Connection
const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

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
    const { nama, skor } = req.body;

    if (!nama || skor === undefined) {
        return res.status(400).json({ error: 'Name and score are required' });
    }

    if (typeof skor !== 'number' || skor < 0 || skor > 10) {
        return res.status(400).json({ error: 'Score must be a number between 0 and 10' });
    }

    try {
        const result = await db.execute({
            sql: 'INSERT INTO scores (name, score) VALUES (?, ?)',
            args: [nama, skor]
        });

        res.status(201).json({
            success: true,
            id: result.lastInsertRowid,
            message: 'Score saved successfully'
        });
    } catch (error) {
        console.error('Error inserting score:', error);
        res.status(500).json({ error: 'Failed to save score' });
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

        // Format data for CSV
        const formattedData = rows.map((row, index) => ({
            'No': index + 1,
            'Nama Pengguna': row.name,
            'Skor': row.score,
            'Tanggal & Waktu': new Date(row.timestamp).toLocaleString('id-ID')
        }));

        // Convert to CSV
        const parser = new Parser({
            fields: ['No', 'Nama Pengguna', 'Skor', 'Tanggal & Waktu']
        });
        const csv = parser.parse(formattedData);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=scores.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({ error: 'Failed to generate CSV' });
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
