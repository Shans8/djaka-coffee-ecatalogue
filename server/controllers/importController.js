const XLSX = require('xlsx');
const pool = require('../config/db');

function readRows(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

exports.importProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File Excel wajib diupload.' });
    const rows = readRows(req.file.buffer);
    let count = 0;
    for (const row of rows) {
      const nama = row.nama_produk || row.NamaProduk || row['Nama Produk'];
      if (!nama) continue;
      let idKategori = row.id_kategori;
      if (!idKategori && row.kategori) {
        const [existing] = await pool.query('SELECT id_kategori FROM kategori WHERE nama_kategori=?', [row.kategori]);
        if (existing.length) idKategori = existing[0].id_kategori;
        else { const [r] = await pool.query('INSERT INTO kategori (nama_kategori, deskripsi) VALUES (?, "Import Excel")', [row.kategori]); idKategori = r.insertId; }
      }
      await pool.query(`INSERT INTO produk (id_kategori,nama_produk,deskripsi,spesifikasi,harga,stok,status) VALUES (?,?,?,?,?,?,?)`, [idKategori || 1, nama, row.deskripsi || '', row.spesifikasi || '', Number(row.harga || 0), Number(row.stok || 0), row.status || 'aktif']);
      count++;
    }
    res.json({ message: `${count} produk berhasil diimport.` });
  } catch (err) { res.status(500).json({ message: 'Import produk gagal.', error: err.message }); }
};
exports.importCategories = async (req, res) => {
  try { if (!req.file) return res.status(400).json({ message: 'File Excel wajib diupload.' }); const rows = readRows(req.file.buffer); let count=0; for (const row of rows) { const nama = row.nama_kategori || row.kategori || row['Nama Kategori']; if (!nama) continue; await pool.query('INSERT INTO kategori (nama_kategori,deskripsi) VALUES (?,?)', [nama,row.deskripsi || '']); count++; } res.json({ message: `${count} kategori berhasil diimport.` }); }
  catch (err) { res.status(500).json({ message: 'Import kategori gagal.', error: err.message }); }
};
exports.importPromos = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File Excel wajib diupload.' });
    const rows = readRows(req.file.buffer); let count = 0;
    for (const row of rows) {
      let idProduk = row.id_produk;
      if (!idProduk && row.nama_produk) { const [p] = await pool.query('SELECT id_produk FROM produk WHERE nama_produk=?', [row.nama_produk]); if (p.length) idProduk = p[0].id_produk; }
      if (!idProduk || !row.nama_promo) continue;
      const diskon = Number(row.diskon || 0); if (diskon < 0 || diskon > 100) continue;
      await pool.query('INSERT INTO promo (id_produk,nama_promo,diskon,tanggal_mulai,tanggal_selesai,status) VALUES (?,?,?,?,?,?)', [idProduk,row.nama_promo,diskon,row.tanggal_mulai,row.tanggal_selesai,row.status || 'aktif']); count++;
    }
    res.json({ message: `${count} promo berhasil diimport.` });
  } catch (err) { res.status(500).json({ message: 'Import promo gagal.', error: err.message }); }
};
