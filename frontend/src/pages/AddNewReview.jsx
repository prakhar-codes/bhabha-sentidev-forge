import PlaceCard from "../components/PlaceCard";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./AddNewReview.css";
import { Input } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import StarRating, { SetStarRating } from "../components/StarRating";
import { Select } from "@chakra-ui/react";
import axios from "axios";

function AddNewReview() {
  const [name, setname] = useState("");
  const { placename } = useParams();
  const [rating, setRating] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(""); // Initialize with an empty string
  const [reviewText, setReviewText] = useState(""); // Initialize with an empty string
  const [predicted_rating ,setpredicted_rating] = useState(null)
  
function handleFormSubmit() {
  // Prepare the data to send to the backend
  const data = !rating? {
    name: name,
    company: selectedCompany, // You need to capture the selected company in your component
    rating: rating,
    review: reviewText, // You need to capture the review text in your component
    place: placename, // You already have the placename from useParams
  }: {
    name: name,
    company: selectedCompany, // You need to capture the selected company in your component
    rating: rating,
    review: reviewText, // You need to capture the review text in your component
    place: placename, // You already have the placename from useParams
    predicted_rating: predicted_rating
  };

  axios
  .post("http://127.0.0.1:5000/api/add_item", data)
  .then((response) => {
    console.log("Review data:", response.data);
    
    if (response.data.predicted_rating !== undefined) {
      // Access the predicted rating from the response
      const predictedRatingres = response.data.predicted_rating;
      setpredicted_rating(predictedRatingres)
      setRating(predictedRatingres)
      console.log(`Predicted Rating: ${predictedRatingres}`);
      // You can use the predictedRating as needed in your frontend
    }else if(response.data.inserted !== undefined){
      window.location.href = `/places/${placename}`;
    }


    // Redirect to the place page
   
  })
  .catch((error) => {
    // Handle errors here, e.g., display an error message
    console.error("Error submitting review:", error);
  });
}




  return (
    <>
      <div className="navbar">OpinioMate</div>
      <div className="add-new-content">
        <p className="reviewheading">Add New Review for {placename}</p>
        <Input
          className="inputbox"
          placeholder="Your name"
          width="50%"
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />

        <Select
          placeholder="Who was your company during visit?"
          width="50%"
          style={{ margin: "15px 0 15px 0" }}
          value={selectedCompany} // Set the value attribute to the state variable
          onChange={(e) => {
            setSelectedCompany(e.target.value); // Update the state variable on change
          }}
        >
          <option value="Solo">Solo</option>
          <option value="Family">Family</option>
          <option value="Friends">Friends</option>
          <option value="Couples">Couples</option>
        </Select>
        <Textarea
          width="50%"
          placeholder="Provide your review"
          style={{ margin: "15px 0 20px 0" }}
          value={reviewText} // Set the value attribute to the state variable
          onChange={(e) => {
            setReviewText(e.target.value); // Update the state variable on change
          }}
        />
        {/* <br /> */}
        {/* <SetStarRating rating={rating}
          setrating={setRating} />
        <br/> */}
        <br/>
        {predicted_rating && 
        <div>
          <p>Our model predicted our rating as {predicted_rating}/5</p>
          <SetStarRating rating={rating} setrating={setRating}/>
        </div>
        }
        <br/>
        <Button colorScheme="blue" onClick={handleFormSubmit}>Submit</Button>
      </div>
    </>
  );
}

export default AddNewReview;