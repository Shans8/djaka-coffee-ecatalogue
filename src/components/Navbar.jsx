import { useNavigate } from 'react-router-dom';
import { getStoredUser } from '../utils/format.js';

function Navbar({ title, onToggle }) {
  const navigate = useNavigate();
  const user = getStoredUser();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={onToggle} aria-label="Buka menu">☰</button>
      <div>
        <p className="page-kicker">Djaka Coffee E-Catalogue</p>
        <h1>{title}</h1>
      </div>
      <div className="nav-user">
        <div className="avatar">{user?.nama?.charAt(0) || 'D'}</div>
        <div className="nav-user-text">
          <strong>{user?.nama || 'User'}</strong>
          <span>{user?.role || '-'}</span>
        </div>
        <button className="btn btn-outline" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
