const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'กรุณา login ก่อน' });
    }
    try {
        const token = auth.split(' ')[1];
        req.creator = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Token หมดอายุหรือไม่ถูกต้อง' });
    }
}

function verifyAdmin(req, res, next) {
    const key = req.headers['x-admin-key'];
    if (!key || key !== process.env.ADMIN_KEY) {
        return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึง' });
    }
    next();
}

module.exports = { verifyToken, verifyAdmin };
