const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const createToken = (user) => jwt.sign({ id_user: user.id_user, role: user.role }, process.env.JWT_SECRET || 'djaka_coffee_secret_key', { expiresIn: '1d' });

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email dan password wajib diisi.' });

    const [rows] = await pool.query(
      `SELECT u.*, r.nama_role AS role FROM users u JOIN roles r ON u.id_role = r.id_role WHERE u.email = ?`,
      [email]
    );
    if (!rows.length) return res.status(401).json({ message: 'Email atau password salah.' });

    const user = rows[0];
    if (user.status !== 'aktif') return res.status(403).json({ message: 'Akun user nonaktif dan tidak boleh login.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Email atau password salah.' });

    const safeUser = { id_user: user.id_user, nama: user.nama, email: user.email, role: user.role, status: user.status };
    res.json({ message: 'Login berhasil.', token: createToken(safeUser), user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Login gagal.', error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { nama, email, password, no_hp, alamat, role = 'sales' } = req.body;
    if (!nama || !email || !password) return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
    const [[roleRow]] = await pool.query('SELECT id_role FROM roles WHERE nama_role = ?', [role]);
    if (!roleRow) return res.status(400).json({ message: 'Role tidak valid.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (id_role, nama, email, password, no_hp, alamat, status) VALUES (?, ?, ?, ?, ?, ?, 'aktif')`,
      [roleRow.id_role, nama, email, hashedPassword, no_hp || '', alamat || '']
    );
    res.status(201).json({ message: 'Registrasi berhasil.' });
  } catch (err) {
    const message = err.code === 'ER_DUP_ENTRY' ? 'Email sudah digunakan.' : 'Registrasi gagal.';
    res.status(500).json({ message, error: err.message });
  }
};
