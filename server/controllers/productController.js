const pool = require('../config/db');

function validateProduct(data) {
  if (!data.nama_produk || !data.id_kategori) return 'Nama produk dan kategori wajib diisi.';
  if (Number(data.harga) < 0) return 'Harga produk tidak boleh kurang dari 0.';
  if (Number(data.stok) < 0) return 'Stok produk tidak boleh kurang dari 0.';
  return null;
}

exports.getAll = async (req, res) => {
  try {
    const { search, kategori, harga_min, harga_max, status } = req.query;
    const params = [];
    let where = 'WHERE 1=1';
    if (search) { where += ' AND p.nama_produk LIKE ?'; params.push(`%${search}%`); }
    if (kategori) { where += ' AND p.id_kategori = ?'; params.push(kategori); }
    if (harga_min) { where += ' AND p.harga >= ?'; params.push(harga_min); }
    if (harga_max) { where += ' AND p.harga <= ?'; params.push(harga_max); }
    if (status) { where += ' AND p.status = ?'; params.push(status); }
    const [rows] = await pool.query(
      `SELECT p.*, k.nama_kategori,
              pr.nama_promo, pr.diskon, pr.tanggal_mulai, pr.tanggal_selesai
       FROM produk p
       LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
       LEFT JOIN promo pr ON pr.id_produk = p.id_produk AND pr.status = 'aktif'
         AND CURDATE() BETWEEN pr.tanggal_mulai AND pr.tanggal_selesai
       ${where}
       ORDER BY p.created_at DESC`, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: 'Gagal mengambil produk.', error: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, k.nama_kategori, pr.nama_promo, pr.diskon, pr.tanggal_mulai, pr.tanggal_selesai
       FROM produk p LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
       LEFT JOIN promo pr ON pr.id_produk = p.id_produk AND pr.status = 'aktif'
       WHERE p.id_produk = ?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: 'Gagal mengambil detail produk.', error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const error = validateProduct(req.body);
    if (error) return res.status(400).json({ message: error });
    const gambar = req.file ? `uploads/products/${req.file.filename}` : null;
    const { id_kategori, nama_produk, deskripsi, spesifikasi, harga, stok, status = 'aktif' } = req.body;
    const [result] = await pool.query(
      `INSERT INTO produk (id_kategori, nama_produk, deskripsi, spesifikasi, harga, stok, gambar, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_kategori, nama_produk, deskripsi || '', spesifikasi || '', harga, stok, gambar, status]
    );
    res.status(201).json({ message: 'Produk berhasil ditambahkan.', id_produk: result.insertId });
  } catch (err) { res.status(500).json({ message: 'Gagal menambahkan produk.', error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const error = validateProduct(req.body);
    if (error) return res.status(400).json({ message: error });
    const gambar = req.file ? `uploads/products/${req.file.filename}` : req.body.gambar;
    const { id_kategori, nama_produk, deskripsi, spesifikasi, harga, stok, status = 'aktif' } = req.body;
    await pool.query(
      `UPDATE produk SET id_kategori=?, nama_produk=?, deskripsi=?, spesifikasi=?, harga=?, stok=?, gambar=COALESCE(?, gambar), status=? WHERE id_produk=?`,
      [id_kategori, nama_produk, deskripsi || '', spesifikasi || '', harga, stok, gambar || null, status, req.params.id]
    );
    res.json({ message: 'Produk berhasil diperbarui.' });
  } catch (err) { res.status(500).json({ message: 'Gagal memperbarui produk.', error: err.message }); }
};

exports.remove = async (req, res) => {
  try { await pool.query('DELETE FROM produk WHERE id_produk = ?', [req.params.id]); res.json({ message: 'Produk berhasil dihapus.' }); }
  catch (err) { res.status(500).json({ message: 'Gagal menghapus produk. Pastikan produk tidak sedang dipakai pada paket/pesanan.', error: err.message }); }
};
