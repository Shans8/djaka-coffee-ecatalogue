import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { getOrders, updateOrderStatus } from '../../services/orderService.js';
import { getTracking } from '../../services/trackingService.js';

function KelolaTracking() {
  const [orders, setOrders] = useState([]); const [selected, setSelected] = useState(''); const [history, setHistory] = useState([]); const [form, setForm] = useState({ status_pesanan: 'diproses', keterangan: '' });
  useEffect(() => { getOrders().then(res => setOrders(res.data)); }, []);
  useEffect(() => { if (selected) getTracking(selected).then(res => setHistory(res.data)); }, [selected]);
  const submit = async (e) => { e.preventDefault(); await updateOrderStatus(selected, form.status_pesanan, form.keterangan); const res = await getTracking(selected); setHistory(res.data); setForm({ status_pesanan: 'diproses', keterangan: '' }); };
  return <AppLayout role="admin" title="Kelola Tracking Order">
    <div className="grid-2"><form className="panel form-grid" onSubmit={submit}><p className="page-kicker">Tracking</p><h2>Tambah Status Tracking</h2><select required value={selected} onChange={(e) => setSelected(e.target.value)}><option value="">Pilih pesanan</option>{orders.map(o => <option key={o.id_pesanan} value={o.id_pesanan}>#{o.id_pesanan} - {o.nama_sales} - {o.status_pesanan}</option>)}</select><select value={form.status_pesanan} onChange={(e) => setForm({ ...form, status_pesanan: e.target.value })}>{['menunggu','diproses','dikirim','selesai','dibatalkan'].map(s => <option key={s} value={s}>{s}</option>)}</select><textarea required placeholder="Keterangan" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} /><button className="btn btn-primary">Simpan Tracking</button></form><div className="panel"><p className="page-kicker">Riwayat</p><h2>Riwayat Tracking</h2>{history.length === 0 ? <div className="empty-state">Pilih pesanan untuk melihat riwayat.</div> : history.map(h => <div className="timeline" key={h.id_tracking}><StatusBadge status={h.status} /><strong>{h.keterangan}</strong><span>{new Date(h.tanggal_update).toLocaleString('id-ID')}</span></div>)}</div></div>
  </AppLayout>;
}
export default KelolaTracking;
