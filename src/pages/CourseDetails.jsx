import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock, Layers, Globe, CheckCircle2, ChevronDown, ChevronUp, PlayCircle,
  Lock, ShieldCheck, Smartphone, Infinity as InfinityIcon
} from 'lucide-react';
import api from '../api/axios.js';
import StarRating from '../components/StarRating.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice, formatDuration } from '../utils/format.js';

const CourseDetails = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [openSection, setOpenSection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/courses/${slug}`)
      .then(({ data }) => setData(data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;
  if (!data) return <div className="empty-state"><p>Course not found.</p></div>;

  const { course, curriculum, reviews, isEnrolled } = data;
  const hasDiscount = course.discountPrice > 0 && course.discountPrice < course.price;
  const totalLessons = curriculum.reduce((sum, s) => sum + s.lessons.length, 0);

  const handleEnroll = () => {
    if (!user) return navigate('/login', { state: { from: { pathname: `/checkout/${course.slug}` } } });
    if (isEnrolled) return navigate(`/learn/${course._id}`);
    navigate(`/checkout/${course.slug}`);
  };

  return (
    <div>
      <div className="course-hero">
        <div className="container course-hero-grid">
          <div>
            <div className="course-hero-category">{course.category?.name}</div>
            <h1>{course.title}</h1>
            <p className="course-hero-sub">{course.subtitle}</p>
            <div className="course-hero-meta">
              <span><Clock size={15} /> {formatDuration(course.totalDurationMinutes)}</span>
              <span><Layers size={15} /> {totalLessons} lessons</span>
              <span><Globe size={15} /> {course.language}</span>
              <span style={{ textTransform: 'capitalize' }}><PlayCircle size={15} /> {course.level}</span>
            </div>
            {course.totalReviews > 0 && (
              <div className="rating-row" style={{ marginTop: 14, color: '#fff' }}>
                <StarRating rating={course.averageRating} />
                <span>{course.averageRating}</span>
                <span style={{ color: '#a8a3bc' }}>({course.totalReviews} reviews)</span>
              </div>
            )}
          </div>
          <div />
        </div>
      </div>

      <div className="container">
        <div className="course-body">
          <div>
            <h2 className="course-section-title">What you will learn</h2>
            <div className="outcomes-grid">
              {course.learningOutcomes?.map((item, i) => (
                <div key={i} className="outcome-item"><CheckCircle2 size={17} /> {item}</div>
              ))}
            </div>

            <h2 className="course-section-title">Description</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--color-body)', marginBottom: 40 }}>
              {course.description}
            </p>

            <h2 className="course-section-title">Course curriculum</h2>
            <div style={{ marginBottom: 40 }}>
              {curriculum.map((section, i) => (
                <div key={section._id} className="curriculum-section">
                  <div className="curriculum-section-header" onClick={() => setOpenSection(openSection === i ? -1 : i)}>
                    <span>{section.title}</span>
                    <span className="curriculum-section-meta">
                      {section.lessons.length} lessons
                      {openSection === i ? <ChevronUp size={16} style={{ marginLeft: 8 }} /> : <ChevronDown size={16} style={{ marginLeft: 8 }} />}
                    </span>
                  </div>
                  {openSection === i && section.lessons.map((lesson) => (
                    <div key={lesson._id} className="curriculum-lesson">
                      <span className="curriculum-lesson-left">
                        {lesson.isPreview ? <PlayCircle size={15} /> : <Lock size={15} />}
                        {lesson.title}
                      </span>
                      <span className="text-muted">{formatDuration(lesson.durationMinutes)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <h2 className="course-section-title">Requirements</h2>
            <div className="outcomes-grid" style={{ marginBottom: 40 }}>
              {course.requirements?.map((item, i) => (
                <div key={i} className="outcome-item"><CheckCircle2 size={17} /> {item}</div>
              ))}
            </div>

            <h2 className="course-section-title">Student reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted" style={{ fontSize: 14 }}>No reviews yet. Be the first to review this course.</p>
            ) : (
              <div>
                <div className="reviews-summary">
                  <span className="reviews-score">{course.averageRating}</span>
                  <div>
                    <StarRating rating={course.averageRating} size={16} />
                    <div className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>{course.totalReviews} reviews</div>
                  </div>
                </div>
                {reviews.map((r) => (
                  <div key={r._id} className="review-item">
                    <div className="review-person">
                      <span className="review-avatar">{r.student?.name?.[0]?.toUpperCase()}</span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-ink)' }}>{r.student?.name}</div>
                        <StarRating rating={r.rating} size={12} />
                      </div>
                    </div>
                    <p style={{ fontSize: 13.5, color: 'var(--color-body)' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="purchase-card" style={{ marginTop: -160 }}>
              <img src={course.thumbnail} alt={course.title} />
              <div className="purchase-card-body">
                <div className="purchase-price-row">
                  <span className="purchase-price-current">{formatPrice(hasDiscount ? course.discountPrice : course.price)}</span>
                  {hasDiscount && <span className="purchase-price-original">{formatPrice(course.price)}</span>}
                  {hasDiscount && (
                    <span className="purchase-discount-badge">
                      {Math.round((1 - course.discountPrice / course.price) * 100)}% off
                    </span>
                  )}
                </div>
                <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 14 }} onClick={handleEnroll}>
                  {isEnrolled ? 'Go to course' : 'Enroll now'}
                </button>
                <div className="purchase-list">
                  <div className="purchase-list-item"><InfinityIcon size={16} /> Full lifetime access</div>
                  <div className="purchase-list-item"><Smartphone size={16} /> Access on mobile and desktop</div>
                  <div className="purchase-list-item"><ShieldCheck size={16} /> Certificate on completion</div>
                  <div className="purchase-list-item"><Lock size={16} /> Secure M-Pesa checkout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
