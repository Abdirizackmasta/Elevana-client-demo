import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award } from 'lucide-react';
import api from '../../api/axios.js';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my-courses').then(({ data }) => setEnrollments(data.enrollments)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;

  return (
    <div className="container section">
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>My courses</h1>
      <p className="text-muted" style={{ marginBottom: 24, fontSize: 14 }}>Continue where you left off</p>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={36} />
          <p>You have not enrolled in any course yet.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: 14 }}>Browse courses</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {enrollments.map((enr) => (
            <div key={enr._id} className="card enrolled-card">
              <img className="enrolled-thumb" src={enr.course.thumbnail} alt={enr.course.title} />
              <div className="enrolled-body">
                <span className="course-card-category">{enr.course.category?.name}</span>
                <h3 style={{ fontSize: 16, color: 'var(--color-ink)' }}>{enr.course.title}</h3>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${enr.progressPercent}%` }} />
                </div>
                <span className="text-muted" style={{ fontSize: 12.5 }}>{enr.progressPercent}% complete</span>
                <div className="enrolled-actions">
                  <Link to={`/learn/${enr.course._id}`} className="btn btn-primary btn-sm">
                    {enr.progressPercent > 0 ? 'Continue learning' : 'Start course'}
                  </Link>
                  {enr.progressPercent === 100 && (
                    <Link to="/certificates" className="btn btn-outline btn-sm"><Award size={14} /> Certificate</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
