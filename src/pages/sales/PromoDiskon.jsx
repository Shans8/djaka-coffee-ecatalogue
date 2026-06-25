import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { getPromos } from '../../services/promoService.js';

function PromoDiskon() {
  const [promos, setPromos] = useState([]); useEffect(() => { getPromos().then(res => setPromos(res.data.filter(p => p.status === 'aktif'))); }, []);
  return <AppLayout role="sales" title="Promo dan Diskon"><div className="promo-grid">{promos.map(p => <article className="promo-card" key={p.id_promo}><p className="page-kicker">Promo Aktif</p><h2>{p.nama_promo}</h2><h3>{p.diskon}% OFF</h3><p>Produk: <strong>{p.nama_produk}</strong></p><p>Berlaku: {String(p.tanggal_mulai).slice(0,10)} s.d. {String(p.tanggal_selesai).slice(0,10)}</p><StatusBadge status={p.status} /></article>)}</div>{promos.length === 0 && <div className="empty-state">Belum ada promo aktif.</div>}</AppLayout>;
}
export default PromoDiskon;
