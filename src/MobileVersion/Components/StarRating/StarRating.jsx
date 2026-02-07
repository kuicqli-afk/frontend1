import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'

function StarRating({ rating = 0, total = 5 }) {
  return (
    <div>
      {[...Array(total)].map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={index < rating ? solidStar : regularStar}
          style={{ color: '#f5c518', marginRight: 4 }}
        />
      ))}
    </div>
  )
}

export default StarRating
