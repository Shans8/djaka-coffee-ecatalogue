import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import OrderTable from '../../components/OrderTable.jsx';
import api from '../../services/api.js';

function DashboardSales() {
  const [data, setData] = useState({ stats: {}, latestOrders: [] });
  useEffect(() => { api.get('/dashboard/sales').then(res => setData(res.data)); }, []);
  const cards = [['Katalog Produk', data.stats.totalProduk, '📦'], ['Promo Aktif', data.stats.totalPromoAktif, '🎁'], ['Pesanan Saya', data.stats.totalPesananSaya, '🧾'], ['Status Terbaru', data.stats.statusTerbaru || '-', '🚚']];
  return <AppLayout role="sales" title="Dashboard Sales"><div className="stats-grid">{cards.map(([label, value, icon]) => <div className="stat-card" key={label}><span>{icon}</span><p>{label}</p><strong>{value || 0}</strong></div>)}</div><div className="section-head"><div><p className="page-kicker">Aktivitas</p><h2>Pesanan Terakhir</h2></div></div><OrderTable orders={data.latestOrders || []} onDetail={() => {}} /></AppLayout>;
}
export default DashboardSales;
