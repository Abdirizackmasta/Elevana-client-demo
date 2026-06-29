import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios.js';
import { formatPrice } from '../../utils/format.js';

const Checkout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState('form');
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  useEffect(() => {
    api.get(`/courses/${slug}`).then(({ data }) => {
      if (data.isEnrolled) navigate(`/learn/${data.course._id}`);
      setCourse(data.course);
    });
    return () => clearInterval(pollRef.current);
  }, [slug]);

  const amount = course ? (course.discountPrice > 0 ? course.discountPrice : course.price) : 0;

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setStage('sending');
    try {
      const { data } = await api.post('/payments/mpesa/initiate', { courseId: course._id, phone });
      setStage('pending');
      pollRef.current = setInterval(async () => {
        const res = await api.get(`/payments/status/${data.paymentId}`);
        if (res.data.status === 'success') {
          clearInterval(pollRef.current);
          setStage('success');
          setTimeout(() => navigate(`/learn/${course._id}`), 1800);
        } else if (res.data.status === 'failed') {
          clearInterval(pollRef.current);
          setStage('form');
          setError('Payment was not completed. Please try again.');
        }
      }, 4000);
    } catch (err) {
      setStage('form');
      setError(err.response?.data?.message || 'Could not initiate payment');
    }
  };

  if (!course) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;

  return (
    <div className="container checkout-grid">
      <div className="card checkout-summary">
        <img src={course.thumbnail} alt={course.title} />
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>{course.title}</h3>
        <div className="checkout-row"><span className="text-muted">Course price</span><span>{formatPrice(course.price)}</span></div>
        {course.discountPrice > 0 && (
          <div className="checkout-row"><span className="text-muted">Discount</span><span>-{formatPrice(course.price - course.discountPrice)}</span></div>
        )}
        <div className="checkout-row total"><span>Total</span><span>{formatPrice(amount)}</span></div>
      </div>

      <div className="card checkout-form-card">
        <span className="mpesa-logo-badge"><Smartphone size={15} /> Pay with M-Pesa</span>
        <h2 style={{ fontSize: 19, marginBottom: 6 }}>Complete your enrollment</h2>
        <p className="text-muted" style={{ fontSize: 13.5, marginBottom: 20 }}>
          Enter your M-Pesa phone number. You will receive a prompt on your phone to complete payment.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {stage === 'success' ? (
          <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} /> Payment successful. Taking you to your course.
          </div>
        ) : stage === 'pending' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="spinner spinner-dark" style={{ margin: '0 auto 14px' }} />
            <p style={{ fontSize: 14, color: 'var(--color-ink)', fontWeight: 600 }}>Check your phone</p>
            <p className="text-muted" style={{ fontSize: 13 }}>Enter your M-Pesa PIN to complete the payment of {formatPrice(amount)}.</p>
          </div>
        ) : (
          <form onSubmit={handlePay}>
            <div className="input-group">
              <label className="input-label">M-Pesa phone number</label>
              <input
                className="input-field"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={stage === 'sending'}>
              {stage === 'sending' ? <span className="spinner" /> : `Pay ${formatPrice(amount)}`}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 12.5, color: 'var(--color-muted)' }}>
              <ShieldCheck size={14} /> Payments are processed securely through Safaricom M-Pesa.
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
