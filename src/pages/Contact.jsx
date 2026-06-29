import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import api from '../api/axios.js';
import { useSettings } from '../context/SettingsContext.jsx';

const Contact = () => {
  const settings = useSettings();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: '', error: '' });
    try {
      await api.post('/contact', form);
      setStatus({ loading: false, success: 'Your message has been sent. We will get back to you soon.', error: '' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: '', error: err.response?.data?.message || 'Something went wrong' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Contact us</h1>
          <p>Have a question about a course or your account? Reach out below.</p>
        </div>
      </div>

      <div className="container contact-grid">
        <div>
          <div className="contact-info-item">
            <span className="contact-info-icon"><Mail size={18} /></span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: 14.5 }}>Email</div>
              <div className="text-muted" style={{ fontSize: 13.5 }}>{settings.contactEmail}</div>
            </div>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-icon"><Phone size={18} /></span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: 14.5 }}>Phone</div>
              <div className="text-muted" style={{ fontSize: 13.5 }}>{settings.contactPhone}</div>
            </div>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-icon"><MapPin size={18} /></span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: 14.5 }}>Location</div>
              <div className="text-muted" style={{ fontSize: 13.5 }}>{settings.address}</div>
            </div>
          </div>
        </div>

        <div className="card contact-form-card">
          {status.success && <div className="alert alert-success">{status.success}</div>}
          {status.error && <div className="alert alert-error">{status.error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Full name</label>
              <input className="input-field" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea className="input-field" rows={5} name="message" value={form.message} onChange={handleChange} required />
            </div>
            <button className="btn btn-primary" disabled={status.loading}>
              {status.loading ? <span className="spinner" /> : <Send size={15} />} Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
