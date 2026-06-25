import { NavLink } from 'react-router-dom';

const adminMenus = [
  ['Dashboard', '/admin/dashboard', '☕'],
  ['Kelola Produk', '/admin/produk', '📦'],
  ['Kelola Kategori', '/admin/kategori', '🏷️'],
  ['Kelola Promo', '/admin/promo', '🎁'],
  ['Kelola Pesanan', '/admin/pesanan', '🧾'],
  ['Kelola Tracking', '/admin/tracking', '🚚'],
  ['Kelola User', '/admin/user', '👥']
];

const salesMenus = [
  ['Dashboard', '/sales/dashboard', '☕'],
  ['Katalog Produk', '/sales/katalog', '📦'],
  ['Pencarian & Filter', '/sales/filter', '🔎'],
  ['Bandingkan/Bundling', '/sales/bandingkan', '🧺'],
  ['Promo Diskon', '/sales/promo', '🎁'],
  ['Buat Pesanan', '/sales/pesanan', '🧾'],
  ['Tracking Order', '/sales/tracking', '🚚'],
  ['Mode Offline', '/sales/offline', '📶']
];

function Sidebar({ role, open, onClose }) {
  const menus = role === 'admin' ? adminMenus : salesMenus;
  return (
    <aside className={`sidebar ${open ? 'show' : ''}`}>
      <div className="brand">
        <div className="brand-logo">DC</div>
        <div>
          <strong>Djaka Coffee</strong>
          <span>E-Catalogue Sales</span>
        </div>
      </div>
      <div className="menu-list">
        {menus.map(([label, to, icon]) => (
          <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => isActive ? 'menu active' : 'menu'}>
            <span>{icon}</span>{label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
