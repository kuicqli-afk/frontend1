import React from "react";
import "./FareLink.css";
import "./Map.css"

import TwoWheeler from "../../assets/2wheeler.png";
import GreenCircle from "../../assets/greencircle.png";
import Drop from "../../assets/Drop.png";
import MapImage from "../../assets/SLIDER.png"; // static map image (replace later with real map)

const Map = () => {
  // You can later fetch this from API / localStorage
  const tripId = "CRN1238650422";
  const pickup = "Golaganj, Wazirganj, Lucknow, Uttar Pradesh";
  const drop = "Kanchana Bihari Marg, Kalyanpur (East)";
  const price = "₹140/-";

  return (
    <div className="fare-container">
      <div className="searching-driver-wrapper">

        {/* ================= LEFT ================= */}
        <div className="searching-left">
          <p className="trip-id">Trip Id. {tripId}</p>

          <img src={TwoWheeler} alt="vehicle" className="vehicle-icon" />

          <div className="address-block">
            <p>
              <img src={GreenCircle} alt="" />
              {pickup}
            </p>

            <p>
              <img src={Drop} alt="" />
              {drop}
            </p>
          </div>

          <h2>2 Wheeler.</h2>
          <h2>{price}</h2>

          <div className="action-links">
            <span className="view">View Detail.</span>
            <span className="cancel">Cancel Trip.</span>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="searching-right">
          <h1>SEARCHING FOR DRIVER NEARBY...</h1>
          <p>Finding Driver near you.</p>

          {/* MAP */}
          <div className="map-container">
            <img src={MapImage} alt="map" className="map-overlay" />
          </div>

          {/* PROGRESS BAR */}
          <div className="search-progress">
            <div className="progress-fill"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Map;
