import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Ban } from 'lucide-react';
import api from '../../api/axios.js';
import { formatPrice, formatDate } from '../../utils/format.js';

const StudentDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  const load = () => api.get(`/admin/students/${id}`).then(({ data }) => setData(data));

  useEffect(() => {
    load();
    api.get('/courses/admin/all').then(({ data }) => setCourses(data.courses));
  }, [id]);

  const handleManualEnroll = async () => {
    if (!selectedCourse) return;
    await api.post('/admin/enroll', { studentId: id, courseId: selectedCourse });
    setSelectedCourse('');
    load();
  };

  const handleRevoke = async (courseId) => {
    if (!window.confirm('Revoke access to this course?')) return;
    await api.post('/admin/revoke', { studentId: id, courseId });
    load();
  };

  if (!data) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;
  const { student, enrollments, payments } = data;

  return (
    <div>
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin/students" className="icon-btn"><ArrowLeft size={15} /></Link>
          <h1>{student.name}</h1>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="card admin-panel">
          <div className="admin-panel-title">Student details</div>
          <p style={{ fontSize: 13.5, marginBottom: 6 }}><strong>Email:</strong> {student.email}</p>
          <p style={{ fontSize: 13.5, marginBottom: 6 }}><strong>Phone:</strong> {student.phone || '-'}</p>
          <p style={{ fontSize: 13.5, marginBottom: 6 }}><strong>Joined:</strong> {formatDate(student.createdAt)}</p>
          <p style={{ fontSize: 13.5 }}><strong>Status:</strong> {student.status}</p>
        </div>

        <div className="card admin-panel">
          <div className="admin-panel-title">Grant course access</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="input-field" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Select a course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={handleManualEnroll}><UserPlus size={14} /> Enroll</button>
          </div>
        </div>
      </div>

      <div className="card admin-panel" style={{ marginTop: 20 }}>
        <div className="admin-panel-title">Enrollments</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Course</th><th>Source</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr><td colSpan={4} className="text-muted">No enrollments</td></tr>
              ) : enrollments.map((e) => (
                <tr key={e._id}>
                  <td>{e.course?.title}</td>
                  <td>{e.source === 'admin_grant' ? 'Manually granted' : 'Purchase'}</td>
                  <td><span className={`badge ${e.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{e.status}</span></td>
                  <td>
                    {e.status === 'active' && (
                      <button className="icon-btn" onClick={() => handleRevoke(e.course._id)}><Ban size={14} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card admin-panel" style={{ marginTop: 20 }}>
        <div className="admin-panel-title">Payment history</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Course</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={4} className="text-muted">No payments</td></tr>
              ) : payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.course?.title}</td>
                  <td>{formatPrice(p.amount)}</td>
                  <td><span className={`badge ${p.status === 'success' ? 'badge-green' : p.status === 'failed' ? 'badge-red' : 'badge-amber'}`}>{p.status}</span></td>
                  <td>{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
