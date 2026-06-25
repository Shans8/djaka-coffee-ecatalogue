import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import OrderTable from '../../components/OrderTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { getUserOrders } from '../../services/orderService.js';
import { getTracking } from '../../services/trackingService.js';
import { getStoredUser } from '../../utils/format.js';

function TrackingOrder() {
  const user = getStoredUser(); const [orders, setOrders] = useState([]); const [history, setHistory] = useState([]);
  useEffect(() => { getUserOrders(user.id_user).then(res => setOrders(res.data)); }, [user.id_user]);
  const show = async (order) => setHistory((await getTracking(order.id_pesanan)).data);
  return <AppLayout role="sales" title="Tracking Order"><OrderTable orders={orders} onDetail={show} /> <div className="panel"><p className="page-kicker">Riwayat Status</p><h2>Tracking Pesanan</h2>{history.length === 0 ? <div className="empty-state">Klik detail pada pesanan untuk melihat tracking.</div> : history.map(h => <div className="timeline" key={h.id_tracking}><StatusBadge status={h.status} /><strong>{h.keterangan}</strong><span>{new Date(h.tanggal_update).toLocaleString('id-ID')}</span></div>)}</div></AppLayout>;
}
export default TrackingOrder;
