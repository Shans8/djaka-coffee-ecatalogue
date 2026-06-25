import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import OrderTable from '../../components/OrderTable.jsx';
import api from '../../services/api.js';

function DashboardAdmin() {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/dashboard/admin').then((res) => {
      setStats(res.data.stats);
      setOrders(res.data.latestOrders || []);
    });
  }, []);

  const cards = [
    ['Jumlah Produk', stats.totalProduk, '📦'],
    ['Jumlah Kategori', stats.totalKategori, '🏷️'],
    ['Promo Aktif', stats.totalPromoAktif, '🎁'],
    ['Jumlah Pesanan', stats.totalPesanan, '🧾'],
    ['User/Sales', stats.totalSales, '👥']
  ];

  return (
    <AppLayout role="admin" title="Dashboard Admin">
      <div className="stats-grid">
        {cards.map(([label, value, icon]) => (
          <div className="stat-card" key={label}><span>{icon}</span><p>{label}</p><strong>{value || 0}</strong></div>
        ))}
      </div>
      <div className="section-head"><div><p className="page-kicker">Monitoring</p><h2>Pesanan Terbaru</h2></div></div>
      <OrderTable orders={orders} onDetail={() => {}} />
    </AppLayout>
  );
}
export default DashboardAdmin;
