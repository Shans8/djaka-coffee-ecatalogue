const pool = require('../config/db');
exports.admin = async (_, res) => {
  const [[produk]] = await pool.query('SELECT COUNT(*) total FROM produk');
  const [[kategori]] = await pool.query('SELECT COUNT(*) total FROM kategori');
  const [[promo]] = await pool.query("SELECT COUNT(*) total FROM promo WHERE status='aktif'");
  const [[pesanan]] = await pool.query('SELECT COUNT(*) total FROM pesanan');
  const [[sales]] = await pool.query("SELECT COUNT(*) total FROM users u JOIN roles r ON u.id_role=r.id_role WHERE r.nama_role='sales'");
  const [latestOrders] = await pool.query('SELECT ps.*, u.nama AS nama_sales FROM pesanan ps LEFT JOIN users u ON ps.id_user=u.id_user ORDER BY ps.tanggal_pesanan DESC LIMIT 6');
  res.json({ stats: { totalProduk: produk.total, totalKategori: kategori.total, totalPromoAktif: promo.total, totalPesanan: pesanan.total, totalSales: sales.total }, latestOrders });
};
exports.sales = async (req, res) => {
  const [[produk]] = await pool.query("SELECT COUNT(*) total FROM produk WHERE status='aktif'");
  const [[promo]] = await pool.query("SELECT COUNT(*) total FROM promo WHERE status='aktif'");
  const [[pesananSaya]] = await pool.query('SELECT COUNT(*) total FROM pesanan WHERE id_user=?', [req.user.id_user]);
  const [latestOrders] = await pool.query('SELECT ps.*, u.nama AS nama_sales FROM pesanan ps LEFT JOIN users u ON ps.id_user=u.id_user WHERE ps.id_user=? ORDER BY ps.tanggal_pesanan DESC LIMIT 6', [req.user.id_user]);
  res.json({ stats: { totalProduk: produk.total, totalPromoAktif: promo.total, totalPesananSaya: pesananSaya.total, statusTerbaru: latestOrders[0]?.status_pesanan || '-' }, latestOrders });
};
