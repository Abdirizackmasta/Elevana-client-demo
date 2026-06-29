import { useEffect, useState } from 'react';
import { Save, UploadCloud } from 'lucide-react';
import api from '../../api/axios.js';

const Settings = () => {
  const [form, setForm] = useState(null);
  const [tab, setTab] = useState('general');
  const [status, setStatus] = useState({ message: '', loading: false });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/settings/admin').then(({ data }) => setForm(data.settings));
  }, []);

  if (!form) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;

  const handleField = (key, value) => setForm({ ...form, [key]: value });
  const handleSocial = (key, value) => setForm({ ...form, social: { ...form.social, [key]: value } });
  const handleMpesa = (key, value) => setForm({ ...form, mpesa: { ...form.mpesa, [key]: value } });

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload/branding', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      handleField('logo', data.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setStatus({ loading: true, message: '' });
    await api.put('/settings/admin', form);
    setStatus({ loading: false, message: 'Settings saved' });
  };

  return (
    <div>
      <div className="admin-topbar">
        <h1>Site settings</h1>
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={status.loading}>
          <Save size={15} /> Save settings
        </button>
      </div>

      {status.message && <div className="alert alert-success">{status.message}</div>}

      <div className="profile-tabs">
        <button className={`profile-tab ${tab === 'general' ? 'active' : ''}`} onClick={() => setTab('general')}>General</button>
        <button className={`profile-tab ${tab === 'social' ? 'active' : ''}`} onClick={() => setTab('social')}>Social links</button>
        <button className={`profile-tab ${tab === 'mpesa' ? 'active' : ''}`} onClick={() => setTab('mpesa')}>M-Pesa</button>
      </div>

      {tab === 'general' && (
        <div className="card form-card">
          <div className="input-group">
            <label className="input-label">Site name</label>
            <input className="input-field" value={form.siteName} onChange={(e) => handleField('siteName', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Tagline</label>
            <input className="input-field" value={form.tagline} onChange={(e) => handleField('tagline', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Logo</label>
            {form.logo && <img src={form.logo} alt="Logo" style={{ height: 36, marginBottom: 10 }} />}
            <label className="btn btn-outline btn-sm" style={{ width: 'fit-content' }}>
              <UploadCloud size={14} /> {uploading ? 'Uploading...' : 'Upload logo'}
              <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
            </label>
          </div>
          <div className="input-group">
            <label className="input-label">Contact email</label>
            <input className="input-field" value={form.contactEmail} onChange={(e) => handleField('contactEmail', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Contact phone</label>
            <input className="input-field" value={form.contactPhone} onChange={(e) => handleField('contactPhone', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Address</label>
            <input className="input-field" value={form.address} onChange={(e) => handleField('address', e.target.value)} />
          </div>
        </div>
      )}

      {tab === 'social' && (
        <div className="card form-card">
          {['facebook', 'instagram', 'twitter', 'youtube', 'tiktok', 'linkedin'].map((key) => (
            <div className="input-group" key={key}>
              <label className="input-label" style={{ textTransform: 'capitalize' }}>{key}</label>
              <input className="input-field" value={form.social?.[key] || ''} onChange={(e) => handleSocial(key, e.target.value)} placeholder={`https://${key}.com/yourpage`} />
            </div>
          ))}
        </div>
      )}

      {tab === 'mpesa' && (
        <div className="card form-card">
          <div className="input-group">
            <label className="input-label">Environment</label>
            <select className="input-field" value={form.mpesa?.env || 'sandbox'} onChange={(e) => handleMpesa('env', e.target.value)}>
              <option value="sandbox">Sandbox</option>
              <option value="production">Production</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Shortcode</label>
            <input className="input-field" value={form.mpesa?.shortcode || ''} onChange={(e) => handleMpesa('shortcode', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Consumer key</label>
            <input className="input-field" value={form.mpesa?.consumerKey || ''} onChange={(e) => handleMpesa('consumerKey', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Consumer secret</label>
            <input className="input-field" type="password" value={form.mpesa?.consumerSecret || ''} onChange={(e) => handleMpesa('consumerSecret', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Passkey</label>
            <input className="input-field" type="password" value={form.mpesa?.passkey || ''} onChange={(e) => handleMpesa('passkey', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
