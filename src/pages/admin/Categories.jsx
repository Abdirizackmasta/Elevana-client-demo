import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../api/axios.js';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const load = () => api.get('/categories').then(({ data }) => setCategories(data.categories));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: '', description: '' }); setModal({ mode: 'create' }); setError(''); };
  const openEdit = (cat) => { setForm({ name: cat.name, description: cat.description || '' }); setModal({ mode: 'edit', id: cat._id }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.mode === 'create') await api.post('/categories', form);
      else await api.put(`/categories/${modal.id}`, form);
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete category');
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <h1>Categories</h1>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={15} /> New category</button>
      </div>

      <div className="card data-table-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Description</th><th></th></tr></thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={3} className="text-muted">No categories yet</td></tr>
              ) : categories.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.name}</td>
                  <td>{c.description || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="icon-btn" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                      <button className="icon-btn" onClick={() => handleDelete(c._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 className="modal-title">{modal.mode === 'create' ? 'New category' : 'Edit category'}</h2>
              <button className="icon-btn" onClick={() => setModal(null)}><X size={15} /></button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Name</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <button className="btn btn-primary btn-block">Save category</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
