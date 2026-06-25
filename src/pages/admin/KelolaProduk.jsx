import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import ProductTable from '../../components/ProductTable.jsx';
import api from '../../services/api.js';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../services/productService.js';
import { getCategories } from '../../services/categoryService.js';

const initialForm = { nama_produk: '', id_kategori: '', deskripsi: '', spesifikasi: '', harga: '', stok: '', status: 'aktif', gambar: null };

function KelolaProduk() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [excel, setExcel] = useState(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const [p, c] = await Promise.all([getProducts(), getCategories()]);
    setProducts(p.data);
    setCategories(c.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => { if (value !== null && value !== '') fd.append(key, value); });
    if (editing) await updateProduct(editing.id_produk, fd); else await createProduct(fd);
    setForm(initialForm); setEditing(null); load();
  };

  const edit = (item) => { setEditing(item); setForm({ ...initialForm, ...item, gambar: null }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const remove = async (id) => { if (confirm('Hapus produk ini?')) { await deleteProduct(id); load(); } };
  const importExcel = async () => {
    if (!excel) return setMessage('Pilih file Excel terlebih dahulu.');
    const fd = new FormData(); fd.append('file', excel);
    const res = await api.post('/import/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setMessage(res.data.message); setExcel(null); load();
  };

  return (
    <AppLayout role="admin" title="Kelola Produk">
      <div className="grid-2">
        <form className="panel form-grid" onSubmit={submit}>
          <div className="section-head"><div><p className="page-kicker">Form Manual</p><h2>{editing ? 'Edit Produk' : 'Tambah Produk'}</h2></div></div>
          <input required placeholder="Nama produk" value={form.nama_produk} onChange={(e) => setForm({ ...form, nama_produk: e.target.value })} />
          <select required value={form.id_kategori} onChange={(e) => setForm({ ...form, id_kategori: e.target.value })}><option value="">Pilih kategori</option>{categories.map(c => <option key={c.id_kategori} value={c.id_kategori}>{c.nama_kategori}</option>)}</select>
          <textarea placeholder="Deskripsi" value={form.deskripsi || ''} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          <textarea placeholder="Spesifikasi" value={form.spesifikasi || ''} onChange={(e) => setForm({ ...form, spesifikasi: e.target.value })} />
          <input required type="number" min="0" placeholder="Harga" value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} />
          <input required type="number" min="0" placeholder="Stok" value={form.stok} onChange={(e) => setForm({ ...form, stok: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select>
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, gambar: e.target.files[0] })} />
          <div className="actions"><button className="btn btn-primary">Simpan</button>{editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setForm(initialForm); }}>Batal</button>}</div>
        </form>
        <div className="panel">
          <div className="section-head"><div><p className="page-kicker">Tambahan</p><h2>Import Produk dari Excel</h2></div></div>
          <p className="muted">Kolom: nama_produk, kategori, deskripsi, spesifikasi, harga, stok, status.</p>
          <input type="file" accept=".xlsx,.xls" onChange={(e) => setExcel(e.target.files[0])} />
          <button className="btn btn-primary" onClick={importExcel}>Import Excel</button>
          {message && <div className="alert success">{message}</div>}
        </div>
      </div>
      <div className="section-head"><div><p className="page-kicker">Data Produk</p><h2>Daftar Produk</h2></div></div>
      <ProductTable products={products} onEdit={edit} onDelete={remove} />
    </AppLayout>
  );
}
export default KelolaProduk;
