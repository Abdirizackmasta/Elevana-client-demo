import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Layers, Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios.js';
import { formatPrice } from '../../utils/format.js';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/courses/admin/all').then(({ data }) => setCourses(data.courses)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleTogglePublish = async (id) => {
    await api.put(`/courses/admin/${id}/toggle-publish`);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    await api.delete(`/courses/admin/${id}`);
    load();
  };

  return (
    <div>
      <div className="admin-topbar">
        <h1>Courses</h1>
        <Link to="/admin/courses/new" className="btn btn-primary btn-sm"><Plus size={15} /> New course</Link>
      </div>

      <div className="card data-table-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Course</th><th>Category</th><th>Price</th><th>Status</th><th>Enrollments</th><th></th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-muted">Loading...</td></tr>
              ) : courses.length === 0 ? (
                <tr><td colSpan={6} className="text-muted">No courses yet. Create your first course.</td></tr>
              ) : courses.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{c.title}</td>
                  <td>{c.category?.name || '-'}</td>
                  <td>{formatPrice(c.discountPrice > 0 ? c.discountPrice : c.price)}</td>
                  <td><span className={`badge ${c.status === 'published' ? 'badge-green' : 'badge-gray'}`}>{c.status}</span></td>
                  <td>{c.totalEnrollments}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <Link to={`/admin/courses/${c._id}/curriculum`} className="icon-btn" title="Curriculum"><Layers size={15} /></Link>
                      <Link to={`/admin/courses/${c._id}/edit`} className="icon-btn" title="Edit"><Pencil size={15} /></Link>
                      <button className="icon-btn" title={c.status === 'published' ? 'Unpublish' : 'Publish'} onClick={() => handleTogglePublish(c._id)}>
                        {c.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button className="icon-btn" title="Delete" onClick={() => handleDelete(c._id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Courses;
