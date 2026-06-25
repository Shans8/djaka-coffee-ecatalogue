import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../services/api.js';
import { getProducts } from '../../services/productService.js';
import { createPromo, deletePromo, getPromos, updatePromo } from '../../services/promoService.js';

const initial = { id_produk: '', nama_promo: '', diskon: '', tanggal_mulai: '', tanggal_selesai: '', status: 'aktif' };
function KelolaPromo() {
  const [promos, setPromos] = useState([]); const [products, setProducts] = useState([]); const [form, setForm] = useState(initial); const [editing, setEditing] = useState(null); const [excel, setExcel] = useState(null); const [message, setMessage] = useState('');
  const load = async () => { setPromos((await getPromos()).data); setProducts((await getProducts()).data); };
  useEffect(() => { load(); }, []);
  const submit = async (e) => { e.preventDefault(); editing ? await updatePromo(editing.id_promo, form) : await createPromo(form); setForm(initial); setEditing(null); load(); };
  const importExcel = async () => { if (!excel) return setMessage('Pilih file Excel.'); const fd = new FormData(); fd.append('file', excel); const res = await api.post('/import/promos', fd); setMessage(res.data.message); load(); };
  return <AppLayout role="admin" title="Kelola Promo">
    <div className="grid-2">
      <form className="panel form-grid" onSubmit={submit}><p className="page-kicker">Form Manual</p><h2>{editing ? 'Edit Promo' : 'Tambah Promo'}</h2><select required value={form.id_produk} onChange={(e) => setForm({ ...form, id_produk: e.target.value })}><option value="">Pilih produk</option>{products.map(p => <option key={p.id_produk} value={p.id_produk}>{p.nama_produk}</option>)}</select><input required placeholder="Nama promo" value={form.nama_promo} onChange={(e) => setForm({ ...form, nama_promo: e.target.value })} /><input required type="number" min="0" max="100" placeholder="Diskon %" value={form.diskon} onChange={(e) => setForm({ ...form, diskon: e.target.value })} /><input required type="date" value={form.tanggal_mulai} onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })} /><input required type="date" value={form.tanggal_selesai} onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })} /><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select><div className="actions"><button className="btn btn-primary">Simpan</button>{editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setForm(initial); }}>Batal</button>}</div></form>
      <div className="panel"><p className="page-kicker">Tambahan</p><h2>Import Promo dari Excel</h2><p className="muted">Kolom: nama_promo, nama_produk/id_produk, diskon, tanggal_mulai, tanggal_selesai, status.</p><input type="file" accept=".xlsx,.xls" onChange={(e) => setExcel(e.target.files[0])} /><button className="btn btn-primary" onClick={importExcel}>Import Excel</button>{message && <div className="alert success">{message}</div>}</div>
    </div>
    <div className="table-card"><div className="table-responsive"><table><thead><tr><th>Promo</th><th>Produk</th><th>Diskon</th><th>Masa Berlaku</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{promos.map(p => <tr key={p.id_promo}><td><strong>{p.nama_promo}</strong></td><td>{p.nama_produk}</td><td>{p.diskon}%</td><td>{p.tanggal_mulai} s.d. {p.tanggal_selesai}</td><td><StatusBadge status={p.status} /></td><td className="actions"><button className="btn btn-sm" onClick={() => { setEditing(p); setForm({ ...p, tanggal_mulai: String(p.tanggal_mulai).slice(0,10), tanggal_selesai: String(p.tanggal_selesai).slice(0,10) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button><button className="btn btn-sm btn-danger" onClick={async () => { if (confirm('Hapus promo?')) { await deletePromo(p.id_promo); load(); } }}>Hapus</button></td></tr>)}</tbody></table></div></div>
  </AppLayout>;
}
export default KelolaPromo;
