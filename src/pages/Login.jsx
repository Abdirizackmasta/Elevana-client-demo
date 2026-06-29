import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname;
      if (redirectTo) navigate(redirectTo);
      else navigate(user.role === 'admin' ? '/admin' : '/my-courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-logo"><img src={settings.logo || '/brand/logo-horizontal.png'} alt={settings.siteName} /></div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to continue learning</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-with-icon">
              <Mail size={16} />
              <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} />
              <input className="input-field" type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
          </div>
          <div className="auth-forgot"><Link to="/forgot-password">Forgot password?</Link></div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Log in'}
          </button>
        </form>

        <p className="auth-footer-text">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
};

export default Login;
