import { useState } from "react";
import "./place.css";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

function PlaceCard({ image, rating, name, company, totalreviews }) {
  const navigate = useNavigate();

  return (
    <div className="placecard" onClick={()=> {navigate(`places/${name}`)}}>
      {/* <Navigate to="places/hyderabad" replace={true} /> */}
      <div
        style={{
          width: "100%",
          height: "200px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderRadius: "10px 10px 0 0",
          backgroundImage: `url(${image})`
        }}
      ></div>
      <div className="places-sub">
        <p className="places-heading">{name}</p>
        <StarRating rating={rating} />
        {rating} ({totalreviews})
        <p className="places-content">{"Visit with : "+company}</p>
      </div>
    </div>
  );
}

export default PlaceCard;
