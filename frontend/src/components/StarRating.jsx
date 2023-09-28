import { useState } from "react";



const StarRating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const numberOfStars = fullStars + (hasHalfStar?1:0);
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star full-star">
          {/* ★  */}
          <img src="../../src/assets/img/star.png" width="20px" style={{display: 'inline-block'}}/>
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half-star">
          {/* ⯨ */}
          <img src="../../src/assets/img/star-half.png" width="20px" style={{display: 'inline-block'}}/>
        </span>
      );
    }
    for (let i = 0; i < 5 - numberOfStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty-star">
          {/* ☆ */}
          <img src="../../src/assets/img/star-unfilled.png" width="20px" style={{display: 'inline-block'}}/>
        </span>
      );
    }
    return stars;
  };

  return <div className="star-rating">{renderStars()}</div>;
};

function SetStarRating({rating, setrating, initialRating=0}) {
  // const [customrating, setcustomrating] = useState(initialRating)
  const handleStarClick = (selectedRating) => {
    setrating(selectedRating);
    console.log(selectedRating);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleStarClick(star)}
          style={{
            fontSize: "30px",
            cursor: "pointer",
            color: star <= rating ? "gold" : "gray",
          }}
        >
          &#9733; {/* Unicode character for a filled star */}
        </span>
      ))}
    </div>
  );
}

export default StarRating;
export { SetStarRating };
