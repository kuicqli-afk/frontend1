// StarRating.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'

function StarRating({ 
  rating = 0, 
  total = 5, 
  onRatingChange, 
  readOnly: readOnlyProp = false,
  size = 18 
}) {
  const [hoverRating, setHoverRating] = useState(0);
   const readOnly = readOnlyProp || rating > 0;
 const handleClick = (value, e) => {
  if (readOnly || !onRatingChange) return;

  onRatingChange(value);
  e.currentTarget.blur(); // remove focus instantly
};

  return (
    <div style={{ display: 'inline-flex', gap: '4px' }}>
      {[...Array(total)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);
        
        return (
          <FontAwesomeIcon
            key={index}
            icon={isFilled ? solidStar : regularStar}
            style={{ 
              color: '#f5c518', 
              cursor: readOnly ? 'default' : 'pointer',
              fontSize: `${size}px`,
              transition: 'transform 0.1s',
              outline: 'none' 
            }}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            tabIndex={readOnly ? -1 : 0}
            onKeyDown={(e) => {
              if (!readOnly && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleClick(starValue);
              }
            }}
            role={readOnly ? 'img' : 'button'}
            aria-label={readOnly 
              ? `${rating} out of ${total} stars` 
              : `Rate ${starValue} stars`
            }
            aria-pressed={rating === starValue}
          />
        );
      })}
    </div>
  );
}

export default StarRating;