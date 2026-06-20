const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../db');

// POST /api/auth/register — creator สมัครสมาชิก (รอ approve)
router.post('/register', async (req, res) => {
    const { name, email, phone, password, platforms, followers, category } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'กรุณากรอก ชื่อ, อีเมล และรหัสผ่าน' });
    }
    try {
        const exists = await pool.query('SELECT id FROM creators WHERE email = $1', [email]);
        if (exists.rows.length > 0) {
            return res.status(409).json({ error: 'อีเมลนี้ถูกใช้ไปแล้ว' });
        }
        const hash = await bcrypt.hash(password, 12);
        await pool.query(
            `INSERT INTO creators (name, email, phone, password, platforms, followers, category, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')`,
            [name, email, phone || null, hash, platforms || [], followers || null, category || null]
        );
        res.status(201).json({ message: 'สมัครสำเร็จ! รอ P2W อนุมัติก่อนนะครับ/ครับ' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
    }
});

// POST /api/auth/login — creator login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }
    try {
        const result = await pool.query('SELECT * FROM creators WHERE email = $1', [email]);
        const creator = result.rows[0];
        if (!creator) {
            return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
        if (creator.status === 'pending') {
            return res.status(403).json({ error: 'บัญชียังรอการอนุมัติจาก P2W อยู่นะครับ' });
        }
        if (creator.status === 'rejected') {
            return res.status(403).json({ error: 'บัญชีถูกปฏิเสธ กรุณาติดต่อ P2W' });
        }
        const match = await bcrypt.compare(password, creator.password);
        if (!match) {
            return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
        const token = jwt.sign(
            { id: creator.id, name: creator.name, email: creator.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({
            token,
            creator: { id: creator.id, name: creator.name, email: creator.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' });
    }
});

module.exports = router;
