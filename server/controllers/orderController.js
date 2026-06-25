const pool = require('../config/db');

exports.getAll = async (_, res) => {
  const [rows] = await pool.query(`SELECT ps.*, u.nama AS nama_sales FROM pesanan ps LEFT JOIN users u ON ps.id_user=u.id_user ORDER BY ps.tanggal_pesanan DESC`);
  res.json(rows);
};
exports.getByUser = async (req, res) => {
  const [rows] = await pool.query(`SELECT ps.*, u.nama AS nama_sales FROM pesanan ps LEFT JOIN users u ON ps.id_user=u.id_user WHERE ps.id_user=? ORDER BY ps.tanggal_pesanan DESC`, [req.params.id_user]);
  res.json(rows);
};
exports.getById = async (req, res) => {
  const [[order]] = await pool.query(`SELECT ps.*, u.nama AS nama_sales FROM pesanan ps LEFT JOIN users u ON ps.id_user=u.id_user WHERE ps.id_pesanan=?`, [req.params.id]);
  if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
  const [items] = await pool.query(`SELECT dp.*, p.nama_produk, pk.nama_paket FROM detail_pesanan dp LEFT JOIN produk p ON dp.id_produk=p.id_produk LEFT JOIN paket_produk pk ON dp.id_paket=pk.id_paket WHERE dp.id_pesanan=?`, [req.params.id]);
  res.json({ order, items });
};
exports.create = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id_user = req.user?.id_user || req.body.id_user;
    const { catatan = '', items = [] } = req.body;
    if (!items.length) return res.status(400).json({ message: 'Item pesanan tidak boleh kosong.' });
    await conn.beginTransaction();
    let total = 0;
    for (const item of items) total += Number(item.harga) * Number(item.jumlah);
    const [orderResult] = await conn.query('INSERT INTO pesanan (id_user, status_pesanan, total, catatan) VALUES (?, "menunggu", ?, ?)', [id_user, total, catatan]);
    const id_pesanan = orderResult.insertId;
    for (const item of items) {
      const jumlah = Number(item.jumlah);
      const harga = Number(item.harga);
      if (jumlah < 1) throw new Error('Jumlah item minimal 1.');
      if (item.id_produk) {
        const [[product]] = await conn.query('SELECT stok FROM produk WHERE id_produk=? FOR UPDATE', [item.id_produk]);
        if (!product || product.stok < jumlah) throw new Error('Jumlah pesanan tidak boleh melebihi stok produk.');
        await conn.query('UPDATE produk SET stok = stok - ? WHERE id_produk=?', [jumlah, item.id_produk]);
      }
      if (item.id_paket) {
        const [details] = await conn.query('SELECT id_produk, jumlah FROM detail_paket WHERE id_paket=?', [item.id_paket]);
        for (const detail of details) {
          const need = Number(detail.jumlah) * jumlah;
          const [[product]] = await conn.query('SELECT stok FROM produk WHERE id_produk=? FOR UPDATE', [detail.id_produk]);
          if (!product || product.stok < need) throw new Error('Stok produk pada paket tidak mencukupi.');
          await conn.query('UPDATE produk SET stok = stok - ? WHERE id_produk=?', [need, detail.id_produk]);
        }
      }
      await conn.query('INSERT INTO detail_pesanan (id_pesanan,id_produk,id_paket,jumlah,harga,subtotal) VALUES (?,?,?,?,?,?)', [id_pesanan, item.id_produk || null, item.id_paket || null, jumlah, harga, jumlah * harga]);
    }
    await conn.query('INSERT INTO tracking_order (id_pesanan,status,keterangan) VALUES (?,"menunggu","Pesanan berhasil dibuat dan menunggu diproses admin.")', [id_pesanan]);
    await conn.commit(); res.status(201).json({ message: 'Pesanan berhasil dibuat.', id_pesanan });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: 'Gagal membuat pesanan.', error: err.message }); }
  finally { conn.release(); }
};
exports.updateStatus = async (req, res) => {
  const { status_pesanan, keterangan } = req.body;
  const allowed = ['menunggu','diproses','dikirim','selesai','dibatalkan'];
  if (!allowed.includes(status_pesanan)) return res.status(400).json({ message: 'Status pesanan tidak valid.' });
  await pool.query('UPDATE pesanan SET status_pesanan=? WHERE id_pesanan=?', [status_pesanan, req.params.id]);
  await pool.query('INSERT INTO tracking_order (id_pesanan,status,keterangan) VALUES (?,?,?)', [req.params.id, status_pesanan, keterangan || `Status pesanan berubah menjadi ${status_pesanan}.`]);
  res.json({ message: 'Status pesanan dan tracking berhasil diperbarui.' });
};
