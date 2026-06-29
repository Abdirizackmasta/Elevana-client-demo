import { useEffect, useState } from 'react';
import { Award, Download } from 'lucide-react';
import api from '../../api/axios.js';
import { formatDate } from '../../utils/format.js';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my-certificates').then(({ data }) => setCertificates(data.certificates)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;

  return (
    <div className="container section">
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Certificates</h1>
      <p className="text-muted" style={{ marginBottom: 24, fontSize: 14 }}>Certificates earned from completed courses</p>

      {certificates.length === 0 ? (
        <div className="empty-state">
          <Award size={36} />
          <p>Complete a course to earn your first certificate.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {certificates.map((cert) => (
            <div key={cert._id} className="card certificate-card">
              <span className="certificate-icon"><Award size={22} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: 15 }}>{cert.course?.title}</div>
                <div className="text-muted" style={{ fontSize: 12.5 }}>
                  Issued {formatDate(cert.issuedAt)} &middot; No. {cert.certificateNumber}
                </div>
              </div>
              <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                <Download size={14} /> Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
