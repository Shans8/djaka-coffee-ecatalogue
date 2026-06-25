import { rupiah } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';

function OrderTable({ orders, onDetail, onStatus }) {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table>
          <thead><tr><th>ID</th><th>Sales</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Catatan</th><th>Aksi</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id_pesanan}>
                <td>#{order.id_pesanan}</td>
                <td>{order.nama_sales || order.nama || '-'}</td>
                <td>{new Date(order.tanggal_pesanan).toLocaleString('id-ID')}</td>
                <td>{rupiah(order.total)}</td>
                <td><StatusBadge status={order.status_pesanan} /></td>
                <td>{order.catatan || '-'}</td>
                <td className="actions"><button className="btn btn-sm" onClick={() => onDetail(order)}>Detail</button>{onStatus ? <button className="btn btn-sm btn-primary" onClick={() => onStatus(order)}>Ubah Status</button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default OrderTable;
