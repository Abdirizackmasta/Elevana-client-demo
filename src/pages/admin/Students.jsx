import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import api from '../../api/axios.js';
import { formatDate } from '../../utils/format.js';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api.get('/admin/students', { params: { search } }).then(({ data }) => setStudents(data.students)).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleStatus = async (id) => {
    await api.put(`/admin/students/${id}/toggle-status`);
    setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s)));
  };

  return (
    <div>
      <div className="admin-topbar"><h1>Students</h1></div>

      <div className="search-box" style={{ marginBottom: 18, maxWidth: 360 }}>
        <Search size={16} />
        <input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card data-table-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Courses</th><th>Status</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-muted">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="text-muted">No students found</td></tr>
              ) : students.map((s) => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.enrollmentCount}</td>
                  <td>
                    <button className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-red'}`} onClick={() => toggleStatus(s._id)} style={{ border: 'none' }}>
                      {s.status}
                    </button>
                  </td>
                  <td>{formatDate(s.createdAt)}</td>
                  <td><Link to={`/admin/students/${s._id}`} className="icon-btn"><Eye size={14} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
