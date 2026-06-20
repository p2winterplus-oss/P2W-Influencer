const router      = require('express').Router();
const pool        = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET /api/jobs — ดู job board ทั้งหมด (ต้อง login)
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, code, title, description, content_type, duration,
                    deadline, location, channels, budget, requirements, status, created_at
             FROM jobs
             WHERE status NOT IN ('cancelled')
             ORDER BY
                CASE status
                    WHEN 'very_urgent' THEN 1
                    WHEN 'urgent'      THEN 2
                    WHEN 'open'        THEN 3
                    WHEN 'taken'       THEN 4
                    WHEN 'completed'   THEN 5
                    ELSE 6
                END,
                created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ไม่สามารถโหลดงานได้' });
    }
});

// GET /api/jobs/:code — ดูรายละเอียดงานเดียว (ต้อง login)
router.get('/:code', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM jobs WHERE code = $1',
            [req.params.code.toUpperCase()]
        );
        if (!result.rows[0]) return res.status(404).json({ error: 'ไม่พบงานนี้' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
