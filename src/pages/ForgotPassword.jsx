import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import api from '../api/axios.js';
import { useSettings } from '../context/SettingsContext.jsx';

const ForgotPassword = () => {
  const settings = useSettings();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setStatus({ loading: false, message: data.message, error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.response?.data?.message || 'Something went wrong' });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-logo"><img src={settings.logo || '/brand/logo-horizontal.png'} alt={settings.siteName} /></div>
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-subtitle">We will email you a link to reset your password</p>

        {status.message && <div className="alert alert-success">{status.message}</div>}
        {status.error && <div className="alert alert-error">{status.error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-with-icon">
              <Mail size={16} />
              <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <button className="btn btn-primary btn-block" disabled={status.loading}>
            {status.loading ? <span className="spinner" /> : 'Send reset link'}
          </button>
        </form>

        <p className="auth-footer-text"><Link to="/login">Back to log in</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
