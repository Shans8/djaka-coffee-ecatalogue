const pool = require('../config/db');

async function getPackageDetails(condition = '', values = []) {
  const [packages] = await pool.query(`SELECT * FROM paket_produk ${condition} ORDER BY id_paket DESC`, values);
  if (!packages.length) return [];
  const ids = packages.map(p => p.id_paket);
  const [items] = await pool.query(
    `SELECT dp.*, p.nama_produk, p.stok, p.spesifikasi, k.nama_kategori, pr.diskon
     FROM detail_paket dp
     JOIN produk p ON dp.id_produk = p.id_produk
     LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
     LEFT JOIN promo pr ON pr.id_produk = p.id_produk AND pr.status='aktif' AND CURDATE() BETWEEN pr.tanggal_mulai AND pr.tanggal_selesai
     WHERE dp.id_paket IN (?)`, [ids]
  );
  return packages.map(pkg => ({ ...pkg, items: items.filter(i => i.id_paket === pkg.id_paket) }));
}

exports.getAll = async (_, res) => { res.json(await getPackageDetails()); };
exports.getById = async (req, res) => { const data = await getPackageDetails('WHERE id_paket = ?', [req.params.id]); data.length ? res.json(data[0]) : res.status(404).json({ message: 'Paket tidak ditemukan.' }); };
exports.recommendation = async (req, res) => {
  const budget = Number(req.query.budget || 0);
  const jenisAcara = req.query.jenis_acara || '';
  if (budget < 0) return res.status(400).json({ message: 'Budget paket tidak boleh kurang dari 0.' });
  const where = `WHERE status='aktif' AND total_harga <= ? ${jenisAcara ? 'AND jenis_acara LIKE ?' : ''}`;
  const values = jenisAcara ? [budget, `%${jenisAcara}%`] : [budget];
  const [packages] = await pool.query(`SELECT * FROM paket_produk ${where} ORDER BY ABS(total_harga - ?) ASC, total_harga DESC`, [...values, budget]);
  if (!packages.length) return res.json([]);
  const ids = packages.map(p => p.id_paket);
  const [items] = await pool.query(`SELECT dp.*, p.nama_produk, p.stok, p.spesifikasi FROM detail_paket dp JOIN produk p ON dp.id_produk=p.id_produk WHERE dp.id_paket IN (?)`, [ids]);
  res.json(packages.map(pkg => ({ ...pkg, items: items.filter(i => i.id_paket === pkg.id_paket) })));
};
exports.compare = async (req, res) => {
  const ids = req.body.packageIds || [];
  if (!ids.length) return res.json([]);
  const [packages] = await pool.query('SELECT * FROM paket_produk WHERE id_paket IN (?)', [ids]);
  const [items] = await pool.query('SELECT dp.*, p.nama_produk, p.stok FROM detail_paket dp JOIN produk p ON dp.id_produk=p.id_produk WHERE dp.id_paket IN (?)', [ids]);
  res.json(packages.map(pkg => ({ ...pkg, items: items.filter(i => i.id_paket === pkg.id_paket) })));
};
exports.create = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { nama_paket, jenis_acara, deskripsi, budget, status='aktif', items=[] } = req.body;
    if (Number(budget) < 0) return res.status(400).json({ message: 'Budget paket tidak boleh kurang dari 0.' });
    await conn.beginTransaction();
    let total = items.reduce((sum, item) => sum + Number(item.jumlah) * Number(item.harga), 0);
    const [result] = await conn.query('INSERT INTO paket_produk (nama_paket, jenis_acara, deskripsi, budget, total_harga, status) VALUES (?,?,?,?,?,?)', [nama_paket, jenis_acara, deskripsi || '', budget, total, status]);
    for (const item of items) await conn.query('INSERT INTO detail_paket (id_paket,id_produk,jumlah,harga,subtotal) VALUES (?,?,?,?,?)', [result.insertId,item.id_produk,item.jumlah,item.harga,Number(item.jumlah)*Number(item.harga)]);
    await conn.commit(); res.status(201).json({ message: 'Paket berhasil dibuat.', id_paket: result.insertId });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: 'Gagal membuat paket.', error: err.message }); }
  finally { conn.release(); }
};
exports.update = async (req, res) => { await pool.query('UPDATE paket_produk SET nama_paket=?, jenis_acara=?, deskripsi=?, budget=?, status=? WHERE id_paket=?', [req.body.nama_paket, req.body.jenis_acara, req.body.deskripsi || '', req.body.budget, req.body.status || 'aktif', req.params.id]); res.json({ message: 'Paket berhasil diperbarui.' }); };
exports.remove = async (req, res) => { await pool.query('DELETE FROM paket_produk WHERE id_paket=?', [req.params.id]); res.json({ message: 'Paket berhasil dihapus.' }); };
