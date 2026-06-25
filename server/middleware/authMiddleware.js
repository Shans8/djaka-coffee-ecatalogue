const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = (...allowedRoles) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'Token tidak ditemukan.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'djaka_coffee_secret_key');
    const [rows] = await pool.query(
      `SELECT u.id_user, u.nama, u.email, u.status, r.nama_role AS role
       FROM users u JOIN roles r ON u.id_role = r.id_role
       WHERE u.id_user = ?`,
      [decoded.id_user]
    );
    if (!rows.length) return res.status(401).json({ message: 'User tidak ditemukan.' });
    if (rows[0].status !== 'aktif') return res.status(403).json({ message: 'Akun nonaktif.' });
    if (allowedRoles.length && !allowedRoles.includes(rows[0].role)) {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }
    req.user = rows[0];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid.', error: err.message });
  }
};

module.exports = { protect };
