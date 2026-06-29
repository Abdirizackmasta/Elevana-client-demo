import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/my-courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-logo"><img src={settings.logo || '/brand/logo-horizontal.png'} alt={settings.siteName} /></div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start learning practical skills today</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full name</label>
            <div className="input-with-icon">
              <User size={16} />
              <input className="input-field" name="name" value={form.name} onChange={handleChange} required />
            </div>
          </div>
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
              <input className="input-field" type="password" name="password" minLength={6} value={form.password} onChange={handleChange} required />
            </div>
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create account'}
          </button>
        </form>

        <p className="auth-footer-text">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
};

export default Register;
