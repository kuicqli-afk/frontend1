import React, { useContext, useState } from "react";
import "../FareLink/FareLink.css";
import "./Ride.css";

import TwoWheeler from "../../assets/2wheeler.png";
import MiniAuto from "../../assets/MiniAuto.png";
import Eloader from "../../assets/Eloader.png";
import ThreeWheeler from "../../assets/3wheeler.png";
import MiniTruck from "../../assets/Minitruck.png";
import GreenCircle from "../../assets/greencircle.png";
import Drop from "../../assets/Drop.png";
import MapImage from "../../assets/SLIDER.png";

import { SocketContext } from "../../context/Socketcontext";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

function Ride() {
  const ride = JSON.parse(localStorage.getItem("ride"));
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showViewDetail, setShowViewDetail] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const name = localStorage.getItem("name");
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const tripId = ride._id;
  const pickup = ride.pickUp;
  const drop = ride.drop;
  const price = `₹${ride.fare}/-`;
  const vehcile = ride.vehcile;

  const vehicleData = {
    bike: { img: TwoWheeler, name: "2 Wheeler." },
    miniAuto: { img: MiniAuto, name: "Mini Auto" },
    ELoader: { img: Eloader, name: "E Loader" },
    threeWheeler: { img: ThreeWheeler, name: "3 Wheeler" },
    miniTruck: { img: MiniTruck, name: "Mini Truck" },
  };

  socket.on("ride-confirmed", (ride) => {
    alert("Status: " + ride.status + "\nDriver: " + ride.driverId.name);
    localStorage.setItem("ride", JSON.stringify(ride));
    navigate("/ride/confirmed");
  });

  /* -------- GOOGLE MAP -------- */
   const { isLoaded } = useJsApiLoader({
     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
   });

  // TEMP pickup location (replace later)
  const pickupLocation = {
    lat: 28.6139,
    lng: 77.2090,
  };

  return (
    <>
      <Navbar />

      <div className="fare-container">
        <div className="fare-body">
          {/* LEFT CARD */}
          <div className="fare-card" id="fare-card">
            <div className="fare-trip">
              <p>Trip Id.</p>
              <p>{tripId}</p>
            </div>

            <div className="fare-top">
              <img src={vehicleData[vehcile].img} alt="vehicle" />
            </div>

            <div className="fare-detail">
              <div className="address-box">
                <p className="address-title">Address Details</p>

                <div className="address-item">
                  <span className="dot green"></span>
                  <div className="address-content">
                    <p className="label">Pickup Location</p>
                    <p className="value">{pickup}</p>
                  </div>
                </div>

                <div className="address-line"></div>

                <div className="address-item">
                  <span className="dot red"></span>
                  <div className="address-content">
                    <p className="label">
                      Drop Location <span className="name">• {name}</span>
                    </p>
                    <p className="value">{drop}</p>
                  </div>
                </div>
              </div>

              <h3>{vehicleData[vehcile].name}</h3>
              <h4>{price}</h4>

              <p id="ride-detail" onClick={() => setShowViewDetail(true)}>
                View Detail
              </p>

              <p
                id="price-cancel"
                className="cancel-trip"
                onClick={() => setShowCancelPopup(true)}
              >
                Cancel Trip
              </p>
            </div>
          </div>

          <div className="ride-divider"></div>

          {/* RIGHT SIDE */}
          <div className="ride-right">
            <div className="right-text">
              <h2>
                SEARCHING FOR <br /> DRIVER NEARBY
              </h2>
              <p>Finding Driver near you.</p>
            </div>

            {/* GOOGLE MAP */}
          <div className="ride-map" style={{ width: "700px", height: "400px", position: "relative" }}>
                    {isLoaded && (
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={pickupLocation}
                        zoom={14}
                        options={{ disableDefaultUI: true, zoomControl: true }}
                      >
                        <Marker position={pickupLocation} />
                      </GoogleMap>
                    )}

                    {/* Centered animations */}
                    <div className="animation-box"></div>
                    <div className="animation-box-2"></div>
                  </div>

            <div className="progress-container">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Ride;
