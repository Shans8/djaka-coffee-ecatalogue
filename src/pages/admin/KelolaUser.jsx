import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import UserTable from '../../components/UserTable.jsx';
import { createUser, deleteUser, getUsers, updateUser, updateUserStatus } from '../../services/userService.js';

const initial = { nama: '', email: '', password: '', no_hp: '', alamat: '', role: 'sales', status: 'aktif' };
function KelolaUser() {
  const [users, setUsers] = useState([]); const [form, setForm] = useState(initial); const [editing, setEditing] = useState(null);
  const load = async () => setUsers((await getUsers()).data);
  useEffect(() => { load(); }, []);
  const submit = async (e) => { e.preventDefault(); editing ? await updateUser(editing.id_user, form) : await createUser(form); setForm(initial); setEditing(null); load(); };
  return <AppLayout role="admin" title="Kelola User/Sales">
    <form className="panel form-grid" onSubmit={submit}><p className="page-kicker">User Management</p><h2>{editing ? 'Edit User/Sales' : 'Tambah User/Sales'}</h2><input required placeholder="Nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /><input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input type="password" required={!editing} placeholder={editing ? 'Kosongkan jika tidak diubah' : 'Password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><input placeholder="Nomor HP" value={form.no_hp || ''} onChange={(e) => setForm({ ...form, no_hp: e.target.value })} /><textarea placeholder="Alamat" value={form.alamat || ''} onChange={(e) => setForm({ ...form, alamat: e.target.value })} /><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="admin">Admin</option><option value="sales">Sales</option></select><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select><div className="actions"><button className="btn btn-primary">Simpan</button>{editing && <button type="button" className="btn btn-outline" onClick={() => { setEditing(null); setForm(initial); }}>Batal</button>}</div></form>
    <UserTable users={users} onEdit={(u) => { setEditing(u); setForm({ ...u, role: u.nama_role, password: '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={async (id) => { if (confirm('Hapus user?')) { await deleteUser(id); load(); } }} onStatus={async (u) => { await updateUserStatus(u.id_user, u.status === 'aktif' ? 'nonaktif' : 'aktif'); load(); }} />
  </AppLayout>;
}
export default KelolaUser;
