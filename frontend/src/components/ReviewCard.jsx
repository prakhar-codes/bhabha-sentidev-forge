import { useState } from "react";
import "./review.css";
import StarRating from "./StarRating";

function ReviewCard({ rating, personname, review, date, typeofvisit, prediction }) {
  function map_prediction(pred){
    switch (pred){
      case 1:
        return '😞'; // Terrible
      case 2:
        return '😕'; // Bad
      case 3:
        return '😐'; // Okay
      case 4:
        return '😊'; // Good
      case 5:
        return '😄'; // Excellent
      default:
        return 'Invalid rating';
    }
  }
  return (
    <div className="reviewcard">
      {/* Details about author */}
      <div className="person-details">
        <div>
          <p style={{ margin: 0, textIndent: "4px", fontSize: "20px" }}>
            {personname}
          </p>
          <StarRating rating={rating} /> ({rating}/5)
        </div>
        <div>
          <p
            style={{
              margin: 0,
              textIndent: "4px",
              fontSize: "18px",
              color: "grey",
            }}
          >
            {date}
          </p>
          <p
            style={{
              margin: 0,
              textIndent: "4px",
              fontSize: "18px",
              color: "grey",
            }}
          >
            {typeofvisit}
          </p>
        </div>
        <div style={{ fontSize: "20px"}}>
          <p style={{ margin: 0, textIndent: "4px", fontSize: "30px" }}>
            {map_prediction(prediction)}
          </p>
            Our model predicts it as {prediction}/5
            </div>
      </div>
      <div className="review-sub">
        <p className="review-content">{review} </p>
      </div>
    </div>
  );
}

export default ReviewCard;
