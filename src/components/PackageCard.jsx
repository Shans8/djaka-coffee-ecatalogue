import { rupiah } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';

function PackageCard({ paket, onChoose, selected }) {
  return (
    <article className={`package-card ${selected ? 'selected' : ''}`}>
      <div className="row-between gap">
        <div>
          <p className="page-kicker">{paket.jenis_acara}</p>
          <h3>{paket.nama_paket}</h3>
        </div>
        <StatusBadge status={paket.status} />
      </div>
      <p className="muted">{paket.deskripsi}</p>
      <strong className="price">{rupiah(paket.total_harga)}</strong>
      <div className="package-items">
        {(paket.items || []).map((item) => (
          <span key={item.id_detail_paket || item.id_produk}>{item.jumlah}x {item.nama_produk}</span>
        ))}
      </div>
      {onChoose ? <button className="btn btn-primary full" onClick={() => onChoose(paket)}>Masukkan ke Pesanan</button> : null}
    </article>
  );
}

export default PackageCard;
