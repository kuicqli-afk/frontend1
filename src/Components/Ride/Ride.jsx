import React from "react";
import "../FareLink/FareLink.css";
import "./Ride.css"

import TwoWheeler from "../../assets/2wheeler.png";
import MiniAuto from "../../assets/MiniAuto.png";
import Eloader from "../../assets/Eloader.png";
import ThreeWheeler from "../../assets/3wheeler.png";
import MiniTruck from "../../assets/Minitruck.png";
import GreenCircle from "../../assets/greencircle.png";
import Drop from "../../assets/Drop.png";
import MapImage from "../../assets/SLIDER.png"; // static map image (replace later with real map)
function Ride() {
  // You can later fetch this from API / localStorage
  const ride = JSON.parse(localStorage.getItem("ride"));
  //
  const tripId = ride._id;
  const pickup = ride.pickUp;
  const drop = ride.drop;
  const price = `₹${ride.fare}/-`;
  const vehcile=ride.vehcile;

    const vehicleData = {
      "bike": { img: TwoWheeler, weight: "18kg.", price: "140",name:"2 Wheeler."},
      "miniAuto": { img: MiniAuto, weight: "45kg.", price: "180", name: "Mini Auto" },
      "ELoader": { img: Eloader, weight: "400kg.", price: "260", name: "E Loader" },
      "threeWheeler": { img: ThreeWheeler, weight: "550kg.", price: "350", name: "3 Wheeler" },
      "miniTruck": { img: MiniTruck, weight: "720kg.", price: "520", name: "Mini Truck" }
    };
  

  return (
    <div className="fare-container">
      <div className="searching-driver-wrapper">

        {/* ================= LEFT ================= */}
        <div className="searching-left">
          <p className="trip-id">Trip Id. {tripId}</p>

          <img src={vehicleData[vehcile].img} alt="vehicle" className="vehicle-icon" />

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

          <h2>{vehicleData[vehcile].name}</h2>
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

export default Ride