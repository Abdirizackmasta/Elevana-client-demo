import { Link } from 'react-router-dom';
import { Clock, Layers } from 'lucide-react';
import StarRating from './StarRating.jsx';
import { formatPrice, formatDuration } from '../utils/format.js';

const CourseCard = ({ course }) => {
  const hasDiscount = course.discountPrice > 0 && course.discountPrice < course.price;

  return (
    <Link to={`/courses/${course.slug}`} className="card course-card">
      <img src={course.thumbnail} alt={course.title} className="course-card-thumb" />
      <div className="course-card-body">
        <span className="course-card-category">{course.category?.name || 'Course'}</span>
        <h3 className="course-card-title">{course.title}</h3>
        <div className="course-card-meta">
          <span className="course-card-meta-item"><Clock size={13} /> {formatDuration(course.totalDurationMinutes)}</span>
          <span className="course-card-meta-item"><Layers size={13} /> {course.level}</span>
        </div>
        {course.totalReviews > 0 ? (
          <div className="rating-row">
            <StarRating rating={course.averageRating} />
            <span>{course.averageRating}</span>
            <span className="text-muted">({course.totalReviews})</span>
          </div>
        ) : (
          <div className="rating-row text-muted">No reviews yet</div>
        )}
        <div className="course-card-footer">
          <div className="course-card-price">
            <span className="price-current">{formatPrice(hasDiscount ? course.discountPrice : course.price)}</span>
            {hasDiscount && <span className="price-original">{formatPrice(course.price)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
