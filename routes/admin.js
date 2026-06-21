const router       = require('express').Router();
const pool         = require('../db');
const { verifyAdmin } = require('../middleware/auth');

// ─── JOBS ─────────────────────────────────────────────────────────────────

router.get('/jobs', verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ไม่สามารถโหลดงานได้' });
    }
});

router.post('/jobs', verifyAdmin, async (req, res) => {
    const { code, title, description, content_type, duration,
            deadline, location, channels, budget, requirements, contact_note } = req.body;
    if (!code || !title) return res.status(400).json({ error: 'ต้องมี code และ title' });
    try {
        const result = await pool.query(
            `INSERT INTO jobs
             (code, title, description, content_type, duration, deadline,
              location, channels, budget, requirements, contact_note, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'open')
             RETURNING *`,
            [code.toUpperCase(), title, description, content_type || [], duration,
             deadline || null, location, channels || [], budget, requirements, contact_note]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'รหัสงานซ้ำ' });
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    }
});

router.patch('/jobs/:id', verifyAdmin, async (req, res) => {
    const allowed = ['title','description','content_type','duration','deadline',
                     'location','channels','budget','requirements','contact_note','status'];
    const updates = [];
    const values  = [];
    let i = 1;
    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            updates.push(`${key} = $${i++}`);
            values.push(req.body[key]);
        }
    }
    if (!updates.length) return res.status(400).json({ error: 'ไม่มีข้อมูลให้อัพเดท' });
    updates.push(`updated_at = NOW()`);
    values.push(req.params.id);
    try {
        const result = await pool.query(
            `UPDATE jobs SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
            values
        );
        if (!result.rows[0]) return res.status(404).json({ error: 'ไม่พบงานนี้' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    }
});

router.delete('/jobs/:id', verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [req.params.id]);
        if (!result.rows[0]) return res.status(404).json({ error: 'ไม่พบงานนี้' });
        res.json({ message: 'ลบงานสำเร็จ' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    }
});

// ─── CREATORS ─────────────────────────────────────────────────────────────

router.get('/creators', verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, phone, platforms, followers, category, status, created_at FROM creators ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ไม่สามารถโหลด creator ได้' });
    }
});

router.patch('/creators/:id', verifyAdmin, async (req, res) => {
    const { status } = req.body;
    if (!['approved','rejected','pending'].includes(status)) {
        return res.status(400).json({ error: 'status ต้องเป็น approved / rejected / pending' });
    }
    try {
        const result = await pool.query(
            'UPDATE creators SET status = $1 WHERE id = $2 RETURNING id, name, email, status',
            [status, req.params.id]
        );
        if (!result.rows[0]) return res.status(404).json({ error: 'ไม่พบ creator นี้' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
