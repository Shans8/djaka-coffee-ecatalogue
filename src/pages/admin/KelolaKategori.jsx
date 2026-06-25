import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../services/api.js';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../services/categoryService.js';

const initial = { nama_kategori: '', deskripsi: '' };
function KelolaKategori() {
  const [rows, setRows] = useState([]); const [form, setForm] = useState(initial); const [editing, setEditing] = useState(null); const [excel, setExcel] = useState(null); const [message, setMessage] = useState('');
  const load = async () => setRows((await getCategories()).data);
  useEffect(() => { load(); }, []);
  const submit = async (e) => { e.preventDefault(); editing ? await updateCategory(editing.id_kategori, form) : await createCategory(form); setForm(initial); setEditing(null); load(); };
  const importExcel = async () => { if (!excel) return setMessage('Pilih file Excel.'); const fd = new FormData(); fd.append('file', excel); const res = await api.post('/import/categories', fd); setMessage(res.data.message); load(); };
  return <AppLayout role="admin" title="Kelola Kategori">
    <div className="grid-2">
      <form className="panel form-grid" onSubmit={submit}><p className="page-kicker">Form Manual</p><h2>{editing ? 'Edit Kategori' : 'Tambah Kategori'}</h2><input required placeholder="Nama kategori" value={form.nama_kategori} onChange={(e) => setForm({ ...form, nama_kategori: e.target.value })} /><textarea placeholder="Deskripsi" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} /><div className="actions"><button className="btn btn-primary">Simpan</button>{editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setForm(initial); }}>Batal</button>}</div></form>
      <div className="panel"><p className="page-kicker">Tambahan</p><h2>Import Kategori dari Excel</h2><p className="muted">Kolom: nama_kategori, deskripsi.</p><input type="file" accept=".xlsx,.xls" onChange={(e) => setExcel(e.target.files[0])} /><button className="btn btn-primary" onClick={importExcel}>Import Excel</button>{message && <div className="alert success">{message}</div>}</div>
    </div>
    <div className="table-card"><div className="table-responsive"><table><thead><tr><th>Nama Kategori</th><th>Deskripsi</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{rows.map(r => <tr key={r.id_kategori}><td><strong>{r.nama_kategori}</strong></td><td>{r.deskripsi || '-'}</td><td><StatusBadge status="aktif" /></td><td className="actions"><button className="btn btn-sm" onClick={() => { setEditing(r); setForm(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button><button className="btn btn-sm btn-danger" onClick={async () => { if (confirm('Hapus kategori?')) { await deleteCategory(r.id_kategori); load(); } }}>Hapus</button></td></tr>)}</tbody></table></div></div>
  </AppLayout>;
}
export default KelolaKategori;
