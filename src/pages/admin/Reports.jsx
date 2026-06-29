import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import { formatPrice } from '../../utils/format.js';

const Reports = () => {
  const [revenue, setRevenue] = useState(null);
  const [sales, setSales] = useState(null);
  const [enrollments, setEnrollments] = useState(null);

  useEffect(() => {
    api.get('/admin/reports/revenue').then(({ data }) => setRevenue(data));
    api.get('/admin/reports/course-sales').then(({ data }) => setSales(data.report));
    api.get('/admin/reports/enrollments').then(({ data }) => setEnrollments(data));
  }, []);

  const maxRevenue = revenue ? Math.max(...revenue.series.map((s) => s.total), 1) : 1;
  const maxEnroll = enrollments ? Math.max(...enrollments.series.map((s) => s.count), 1) : 1;

  return (
    <div>
      <div className="admin-topbar"><h1>Reports</h1></div>

      <div className="admin-grid-2" style={{ marginBottom: 20 }}>
        <div className="card admin-panel">
          <div className="admin-panel-title">Revenue by month {revenue ? `(${formatPrice(revenue.totalRevenue)} total)` : ''}</div>
          {!revenue ? (
            <p className="text-muted">Loading...</p>
          ) : revenue.series.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 13.5 }}>No revenue recorded yet.</p>
          ) : (
            <div className="bar-chart">
              {revenue.series.map((s) => (
                <div key={s.month} className="bar-chart-col">
                  <div className="bar-chart-bar" style={{ height: `${(s.total / maxRevenue) * 140}px` }} />
                  <span className="bar-chart-label">{s.month.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card admin-panel">
          <div className="admin-panel-title">Enrollments by month {enrollments ? `(${enrollments.totalEnrollments} total)` : ''}</div>
          {!enrollments ? (
            <p className="text-muted">Loading...</p>
          ) : enrollments.series.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 13.5 }}>No enrollments recorded yet.</p>
          ) : (
            <div className="bar-chart">
              {enrollments.series.map((s) => (
                <div key={s.month} className="bar-chart-col">
                  <div className="bar-chart-bar" style={{ height: `${(s.count / maxEnroll) * 140}px`, background: '#0d9488' }} />
                  <span className="bar-chart-label">{s.month.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card admin-panel">
        <div className="admin-panel-title">Course sales report</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Course</th><th>Units sold</th><th>Revenue</th></tr></thead>
            <tbody>
              {!sales ? (
                <tr><td colSpan={3} className="text-muted">Loading...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={3} className="text-muted">No sales recorded yet.</td></tr>
              ) : sales.map((s) => (
                <tr key={s.title}>
                  <td style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{s.title}</td>
                  <td>{s.sales}</td>
                  <td>{formatPrice(s.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
