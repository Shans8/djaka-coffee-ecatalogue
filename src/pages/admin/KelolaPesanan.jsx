import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import OrderTable from '../../components/OrderTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { getOrder, getOrders, updateOrderStatus } from '../../services/orderService.js';
import { rupiah } from '../../utils/format.js';

function KelolaPesanan() {
  const [orders, setOrders] = useState([]); const [detail, setDetail] = useState(null); const [statusForm, setStatusForm] = useState({ open: false, order: null, status: 'menunggu', keterangan: '' });
  const load = async () => setOrders((await getOrders()).data);
  useEffect(() => { load(); }, []);
  const showDetail = async (order) => setDetail((await getOrder(order.id_pesanan)).data);
  const saveStatus = async () => { await updateOrderStatus(statusForm.order.id_pesanan, statusForm.status, statusForm.keterangan); setStatusForm({ open: false, order: null, status: 'menunggu', keterangan: '' }); load(); };
  return <AppLayout role="admin" title="Kelola Pesanan">
    <OrderTable orders={orders} onDetail={showDetail} onStatus={(order) => setStatusForm({ open: true, order, status: order.status_pesanan, keterangan: '' })} />
    {detail && <div className="panel modal-like"><div className="section-head"><div><p className="page-kicker">Detail Pesanan</p><h2>Pesanan #{detail.order.id_pesanan}</h2></div><button className="btn btn-outline" onClick={() => setDetail(null)}>Tutup</button></div><p><strong>Sales:</strong> {detail.order.nama_sales}</p><p><strong>Status:</strong> <StatusBadge status={detail.order.status_pesanan} /></p><div className="table-responsive"><table><thead><tr><th>Item</th><th>Jenis</th><th>Jumlah</th><th>Harga</th><th>Subtotal</th></tr></thead><tbody>{detail.items.map((i, idx) => <tr key={idx}><td>{i.nama_produk || i.nama_paket}</td><td>{i.id_paket ? 'Paket' : 'Produk'}</td><td>{i.jumlah}</td><td>{rupiah(i.harga)}</td><td>{rupiah(i.subtotal)}</td></tr>)}</tbody></table></div><h3>Total: {rupiah(detail.order.total)}</h3></div>}
    {statusForm.open && <div className="panel modal-like"><h2>Ubah Status Pesanan #{statusForm.order.id_pesanan}</h2><select value={statusForm.status} onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}>{['menunggu','diproses','dikirim','selesai','dibatalkan'].map(s => <option key={s} value={s}>{s}</option>)}</select><textarea placeholder="Keterangan tracking" value={statusForm.keterangan} onChange={(e) => setStatusForm({ ...statusForm, keterangan: e.target.value })} /><div className="actions"><button className="btn btn-primary" onClick={saveStatus}>Simpan</button><button className="btn btn-outline" onClick={() => setStatusForm({ open: false, order: null, status: 'menunggu', keterangan: '' })}>Batal</button></div></div>}
  </AppLayout>;
}
export default KelolaPesanan;
