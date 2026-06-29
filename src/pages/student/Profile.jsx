import { useState } from 'react';
import { Save, Lock } from 'lucide-react';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [status, setStatus] = useState({ message: '', error: '', loading: false });

  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : '';

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      setStatus({ loading: false, message: 'Profile updated', error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.response?.data?.message || 'Could not update profile' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      await api.put('/auth/change-password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setStatus({ loading: false, message: 'Password changed successfully', error: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.response?.data?.message || 'Could not change password' });
    }
  };

  return (
    <div className="container section">
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Account settings</h1>
      <p className="text-muted" style={{ marginBottom: 24, fontSize: 14 }}>Manage your profile and password</p>

      <div className="profile-avatar-row">
        <div className="profile-avatar-lg">{initials}</div>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: 16 }}>{user?.name}</div>
          <div className="text-muted" style={{ fontSize: 13.5 }}>{user?.email}</div>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`profile-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>Profile</button>
        <button className={`profile-tab ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>Password</button>
      </div>

      {status.message && <div className="alert alert-success">{status.message}</div>}
      {status.error && <div className="alert alert-error">{status.error}</div>}

      {tab === 'profile' ? (
        <form className="card form-card" onSubmit={handleProfileSubmit}>
          <div className="input-group">
            <label className="input-label">Full name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="input-group">
            <label className="input-label">Phone number</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07XXXXXXXX" />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input className="input-field" value={user?.email} disabled />
          </div>
          <button className="btn btn-primary" disabled={status.loading}><Save size={15} /> Save changes</button>
        </form>
      ) : (
        <form className="card form-card" onSubmit={handlePasswordSubmit}>
          <div className="input-group">
            <label className="input-label">Current password</label>
            <input className="input-field" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
          </div>
          <div className="input-group">
            <label className="input-label">New password</label>
            <input className="input-field" type="password" minLength={6} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
          </div>
          <button className="btn btn-primary" disabled={status.loading}><Lock size={15} /> Update password</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
