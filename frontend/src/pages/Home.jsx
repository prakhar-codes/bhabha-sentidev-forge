import React, { useState, useEffect } from "react";
import PlaceCard from "../components/PlaceCard";
import axios from "axios";

function HomePage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://127.0.0.1:5000/api/places")
      .then((response) => {
        console.log(response.data);
        setPlaces(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="navbar">OpinioMate</div>
      <div className="main-content">
        {places.map((place) => (
          <PlaceCard
            key={place.name}
            name={place.name}
            image={'../../src/assets/img/'+place.name.replace(/\s+/g, '').toLowerCase()+'.jpg'}
            rating={place.rating.toFixed(1)}
            totalreviews={place.num_reviews}
            company={place.best_company}
          />
        ))}
      </div>
    </>
  );
}

export default HomePage;
