require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const pool    = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── API Routes ───────────────────────────────────────────────────────────
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/jobs',  require('./routes/jobs'));
app.use('/api/admin', require('./routes/admin'));

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date() }));

// ─── Debug: ตรวจสอบ ADMIN_KEY (ลบออกหลังใช้งาน) ──────────────────────────
app.get('/api/debug-key', (req, res) => {
    const key = process.env.ADMIN_KEY || '';
    res.json({ length: key.length, first3: key.slice(0,3), last3: key.slice(-3) });
});

// ─── Init DB tables ───────────────────────────────────────────────────────
async function initDB() {
    const fs = require('fs');
    const sql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    try {
        await pool.query(sql);
        console.log('✅ Database schema ready');
    } catch (err) {
        console.error('❌ DB init error:', err.message);
    }
}

// ─── SPA fallback (serve index.html สำหรับ route อื่นๆ) ────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
    console.log(`🚀 P2W Influencer running on port ${PORT}`);
    await initDB();
});
