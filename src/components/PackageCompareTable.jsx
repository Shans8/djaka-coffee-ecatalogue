import { rupiah } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';

function PackageCompareTable({ packages }) {
  if (!packages?.length) return <div className="empty-state">Belum ada paket untuk dibandingkan.</div>;
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Paket</th>
              <th>Isi Paket</th>
              <th>Total Harga</th>
              <th>Stok Produk</th>
              <th>Promo</th>
              <th>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((paket) => (
              <tr key={paket.id_paket}>
                <td><strong>{paket.nama_paket}</strong><br /><span className="muted">{paket.jenis_acara}</span></td>
                <td>{(paket.items || []).map((item) => <div key={item.id_produk}>{item.jumlah}x {item.nama_produk} - {rupiah(item.subtotal)}</div>)}</td>
                <td>{rupiah(paket.total_harga)}</td>
                <td>{(paket.items || []).map((item) => <div key={item.id_produk}>{item.nama_produk}: {item.stok}</div>)}</td>
                <td>{(paket.items || []).some((item) => item.diskon) ? 'Ada promo' : '-'}</td>
                <td><StatusBadge status={paket.status} /></td>
                <td>{paket.deskripsi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default PackageCompareTable;
