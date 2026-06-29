import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, Wallet } from 'lucide-react';
import api from '../../api/axios.js';
import { formatPrice, formatDate } from '../../utils/format.js';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setData(data));
  }, []);

  if (!data) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;
  const { stats, recentPayments, recentEnrollments } = data;

  const cards = [
    { label: 'Total students', value: stats.totalStudents, icon: Users, color: '#6f2de2' },
    { label: 'Total courses', value: stats.totalCourses, icon: BookOpen, color: '#0d9488' },
    { label: 'Total enrollments', value: stats.totalEnrollments, icon: GraduationCap, color: '#d97706' },
    { label: 'Total revenue', value: formatPrice(stats.totalRevenue), icon: Wallet, color: '#16a34a' }
  ];

  return (
    <div>
      <div className="admin-topbar"><h1>Dashboard</h1></div>

      <div className="stat-grid">
        {cards.map((c) => (
          <div key={c.label} className="card stat-card">
            <div>
              <div className="stat-card-value">{c.value}</div>
              <div className="stat-card-label">{c.label}</div>
            </div>
            <span className="stat-card-icon" style={{ background: `${c.color}1A`, color: c.color }}>
              <c.icon size={18} />
            </span>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        <div className="card admin-panel">
          <div className="admin-panel-title">Recent payments</div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr><td colSpan={4} className="text-muted">No payments yet</td></tr>
                ) : recentPayments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.student?.name}</td>
                    <td>{p.course?.title}</td>
                    <td>{formatPrice(p.amount)}</td>
                    <td>{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card admin-panel">
          <div className="admin-panel-title">Recent enrollments</div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Student</th><th>Course</th><th>Date</th></tr></thead>
              <tbody>
                {recentEnrollments.length === 0 ? (
                  <tr><td colSpan={3} className="text-muted">No enrollments yet</td></tr>
                ) : recentEnrollments.map((e) => (
                  <tr key={e._id}>
                    <td>{e.student?.name}</td>
                    <td>{e.course?.title}</td>
                    <td>{formatDate(e.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
