import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardAdmin from './pages/admin/DashboardAdmin.jsx';
import KelolaProduk from './pages/admin/KelolaProduk.jsx';
import KelolaKategori from './pages/admin/KelolaKategori.jsx';
import KelolaPromo from './pages/admin/KelolaPromo.jsx';
import KelolaPesanan from './pages/admin/KelolaPesanan.jsx';
import KelolaTracking from './pages/admin/KelolaTracking.jsx';
import KelolaUser from './pages/admin/KelolaUser.jsx';
import DashboardSales from './pages/sales/DashboardSales.jsx';
import KatalogProduk from './pages/sales/KatalogProduk.jsx';
import DetailProduk from './pages/sales/DetailProduk.jsx';
import BandingkanProduk from './pages/sales/BandingkanProduk.jsx';
import PromoDiskon from './pages/sales/PromoDiskon.jsx';
import BuatPesanan from './pages/sales/BuatPesanan.jsx';
import TrackingOrder from './pages/sales/TrackingOrder.jsx';
import ModeOffline from './pages/sales/ModeOffline.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><DashboardAdmin /></ProtectedRoute>} />
      <Route path="/admin/produk" element={<ProtectedRoute role="admin"><KelolaProduk /></ProtectedRoute>} />
      <Route path="/admin/kategori" element={<ProtectedRoute role="admin"><KelolaKategori /></ProtectedRoute>} />
      <Route path="/admin/promo" element={<ProtectedRoute role="admin"><KelolaPromo /></ProtectedRoute>} />
      <Route path="/admin/pesanan" element={<ProtectedRoute role="admin"><KelolaPesanan /></ProtectedRoute>} />
      <Route path="/admin/tracking" element={<ProtectedRoute role="admin"><KelolaTracking /></ProtectedRoute>} />
      <Route path="/admin/user" element={<ProtectedRoute role="admin"><KelolaUser /></ProtectedRoute>} />

      <Route path="/sales/dashboard" element={<ProtectedRoute role="sales"><DashboardSales /></ProtectedRoute>} />
      <Route path="/sales/katalog" element={<ProtectedRoute role="sales"><KatalogProduk /></ProtectedRoute>} />
      <Route path="/sales/filter" element={<ProtectedRoute role="sales"><KatalogProduk /></ProtectedRoute>} />
      <Route path="/sales/produk/:id" element={<ProtectedRoute role="sales"><DetailProduk /></ProtectedRoute>} />
      <Route path="/sales/bandingkan" element={<ProtectedRoute role="sales"><BandingkanProduk /></ProtectedRoute>} />
      <Route path="/sales/promo" element={<ProtectedRoute role="sales"><PromoDiskon /></ProtectedRoute>} />
      <Route path="/sales/pesanan" element={<ProtectedRoute role="sales"><BuatPesanan /></ProtectedRoute>} />
      <Route path="/sales/tracking" element={<ProtectedRoute role="sales"><TrackingOrder /></ProtectedRoute>} />
      <Route path="/sales/offline" element={<ProtectedRoute role="sales"><ModeOffline /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
