import { useEffect, useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios.js';
import { formatPrice, formatDate } from '../../utils/format.js';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/payments/admin/all', { params: { status, search } }).then(({ data }) => setPayments(data.payments)).finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [status, search]);

  const handleVerify = async (id) => {
    if (!window.confirm('Mark this payment as verified and enroll the student?')) return;
    await api.put(`/payments/admin/${id}/verify`);
    load();
  };

  return (
    <div>
      <div className="admin-topbar"><h1>Payments</h1></div>

      <div className="admin-toolbar">
        <div className="search-box" style={{ maxWidth: 320 }}>
          <Search size={16} />
          <input placeholder="Search student, course, receipt" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="card data-table-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Method</th><th>Receipt</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-muted">Loading...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={8} className="text-muted">No payments found</td></tr>
              ) : payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.student?.name}</td>
                  <td>{p.course?.title}</td>
                  <td>{formatPrice(p.amount)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.method}</td>
                  <td>{p.mpesaReceiptNumber || '-'}</td>
                  <td><span className={`badge ${p.status === 'success' ? 'badge-green' : p.status === 'failed' ? 'badge-red' : 'badge-amber'}`}>{p.status}</span></td>
                  <td>{formatDate(p.createdAt)}</td>
                  <td>
                    {p.status !== 'success' && (
                      <button className="icon-btn" title="Verify manually" onClick={() => handleVerify(p._id)}><CheckCircle2 size={14} /></button>
                    )}
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

export default Payments;
