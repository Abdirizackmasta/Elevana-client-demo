import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, size = 14 }) => {
  return (
    <span className="star-row">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? '#f5a623' : 'none'}
          color={i <= Math.round(rating) ? '#f5a623' : '#d9d6e3'}
        />
      ))}
    </span>
  );
};

export default StarRating;
