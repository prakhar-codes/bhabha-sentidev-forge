import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import PlaceCard from "./components/PlaceCard";
import HomePage from "./pages/Home";
import Place from "./pages/Place";
import AddNewReview from "./pages/AddNewReview";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/places/:placename" element={<Place />} />
        <Route path="/addnewreview/:placename" element={<AddNewReview />} />

        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
