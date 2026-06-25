import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService.js';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@djaka.com', password: 'admin123' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/sales/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="coffee-mark">☕</div>
        <h1>E-Catalogue Djaka Coffee</h1>
        <p>Kelola katalog, promo, bundling seminar, pesanan cepat, tracking order, dan aktivitas sales dalam satu dashboard modern.</p>
      </div>
      <form className="login-card" onSubmit={handleSubmit}>
        <p className="page-kicker">Selamat Datang</p>
        <h2>Login Akun</h2>
        {error && <div className="alert danger">{error}</div>}
        <label>Email</label>
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@djaka.com" />
        <label>Password</label>
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="admin123" />
        <button className="btn btn-primary full" disabled={loading}>{loading ? 'Memproses...' : 'Login'}</button>
        <div className="dummy-box">
          <strong>Akun</strong>
          <span>Admin: admin@djaka.com / admin123</span>
          <span>Sales: sales@djaka.com / sales123</span>
        </div>
      </form>
    </div>
  );
}

export default Login;
