import { Navigate } from 'react-router-dom';
import { getStoredUser } from '../utils/format.js';

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/sales/dashboard'} replace />;
  }
  return children;
}

export default ProtectedRoute;
