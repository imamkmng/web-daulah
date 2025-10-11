const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { Parser } = require('json2csv');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files from views directory
app.use(express.static(path.join(__dirname, 'views')));

// Serve images from gambar directory
app.use('/gambar', express.static(path.join(__dirname, 'gambar')));

// Initialize SQLite Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');

        // Create scores table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                score INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Scores table ready');
            }
        });
    }
});

// ===================================
// API ENDPOINTS
// ===================================

// GET /api/scores - Retrieve all scores, sorted by score (descending) and timestamp
app.get('/api/scores', (req, res) => {
    const query = 'SELECT * FROM scores ORDER BY score DESC, timestamp ASC';

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching scores:', err.message);
            return res.status(500).json([]);
        }
        // Always return an array, even if empty
        res.json(rows || []);
    });
});

// POST /api/scores - Add a new score
app.post('/api/scores', (req, res) => {
    console.log('POST /api/scores - Request body:', req.body);

    const { nama, skor } = req.body;

    if (!nama || skor === undefined) {
        console.log('Validation failed: Missing nama or skor');
        return res.status(400).json({ error: 'Name and score are required' });
    }

    if (typeof skor !== 'number' || skor < 0 || skor > 10) {
        console.log('Validation failed: Invalid score value');
        return res.status(400).json({ error: 'Score must be a number between 0 and 10' });
    }

    const query = 'INSERT INTO scores (name, score) VALUES (?, ?)';

    db.run(query, [nama, skor], function(err) {
        if (err) {
            console.error('Error inserting score:', err.message);
            return res.status(500).json({
                success: false,
                error: 'Failed to save score'
            });
        }

        console.log('Score inserted successfully, ID:', this.lastID);

        res.status(201).json({
            success: true,
            id: this.lastID,
            message: 'Score saved successfully'
        });
    });
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
app.get('/admin/download', (req, res) => {
    const query = 'SELECT id, name, score, timestamp FROM scores ORDER BY score DESC, timestamp ASC';

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching scores for CSV:', err.message);
            return res.status(500).json({ error: 'Failed to fetch scores' });
        }

        try {
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
});

// DELETE /admin/reset - Reset all scores
app.delete('/admin/reset', (req, res) => {
    const query = 'DELETE FROM scores';

    db.run(query, [], function(err) {
        if (err) {
            console.error('Error resetting scores:', err.message);
            return res.status(500).json({
                success: false,
                error: 'Gagal mereset data'
            });
        }

        res.json({
            success: true,
            message: 'Semua data berhasil direset',
            deletedRows: this.changes
        });
    });
});

// ===================================
// SERVE HTML PAGES
// ===================================

// Serve index.html as the default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>');
});

// ===================================
// START SERVER
// ===================================

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 Server is running!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📚 Database: SQLite (database.db)`);
    console.log(`========================================\n`);
    console.log(`Available pages:`);
    console.log(`- Beranda: http://localhost:${PORT}/index.html`);
    console.log(`- Timeline: http://localhost:${PORT}/timeline.html`);
    console.log(`- Infografis: http://localhost:${PORT}/infografis.html`);
    console.log(`- Tokoh: http://localhost:${PORT}/tokoh.html`);
    console.log(`- Kuis: http://localhost:${PORT}/uji-kemampuan.html`);
    console.log(`- Peringkat: http://localhost:${PORT}/papan-peringkat.html`);
    console.log(`- Admin Login: http://localhost:${PORT}/admin-login.html`);
    console.log(`\n📝 Admin credentials:`);
    console.log(`   Username: admin`);
    console.log(`   Password: password123`);
    console.log(`========================================\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('\n✅ Database connection closed');
        }
        process.exit(0);
    });
});
