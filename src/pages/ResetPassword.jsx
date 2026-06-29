import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import api from '../api/axios.js';
import { useSettings } from '../context/SettingsContext.jsx';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const settings = useSettings();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-logo"><img src={settings.logo || '/brand/logo-horizontal.png'} alt={settings.siteName} /></div>
        <h1 className="auth-title">Set a new password</h1>
        <p className="auth-subtitle">Choose a strong password for your account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">New password</label>
            <div className="input-with-icon">
              <Lock size={16} />
              <input className="input-field" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Reset password'}
          </button>
        </form>

        <p className="auth-footer-text"><Link to="/login">Back to log in</Link></p>
      </div>
    </div>
  );
};

export default ResetPassword;
