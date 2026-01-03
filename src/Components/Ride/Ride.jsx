import React, { useContext, useState } from "react";
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
import { SocketContext } from "../../context/Socketcontext";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
// import ScrollToTopButton from '../ScrollToTopButton/ScrollToTopButton'
function Ride() {
  // You can later fetch this from API / localStorage
  const ride = JSON.parse(localStorage.getItem("ride"));
    const [showCancelPopup, setShowCancelPopup] = useState(false);
    const [showViewDetail, setShowViewDetail] = useState(false);
    
    const [activeInput, setActiveInput] = useState(null);
  const name=localStorage.getItem('name');
  const {socket}=useContext(SocketContext);
  const tripId = ride._id;
  const pickup = ride.pickUp;
  const drop = ride.drop;
  const price = `₹${ride.fare}/-`;
  const vehcile=ride.vehcile;

  const navigate=useNavigate();

    const vehicleData = {
      "bike": { img: TwoWheeler, weight: "18kg.", price: "140",name:"2 Wheeler."},
      "miniAuto": { img: MiniAuto, weight: "45kg.", price: "180", name: "Mini Auto" },
      "ELoader": { img: Eloader, weight: "400kg.", price: "260", name: "E Loader" },
      "threeWheeler": { img: ThreeWheeler, weight: "550kg.", price: "350", name: "3 Wheeler" },
      "miniTruck": { img: MiniTruck, weight: "720kg.", price: "520", name: "Mini Truck" }
    };
  

    socket.on('ride-confirmed', ride => {
    alert("Status: " + ride.status + "\nDriver: " + ride.driverId.name);
    console.log(ride);
    localStorage.setItem("ride",ride);
    navigate('/ride/confirmed');

  });

   
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
              {/* VEHICLE IMAGE */}
              <div className="fare-top">
                <img src={vehicleData[vehcile].img} alt="vehicle" />
              </div>
  
              <div className="fare-detail">
                {/* ADDRESS SUMMARY */}
                <div className="address-box">
                  <p className="address-title">Address Details</p>
  
                  {/* PICKUP */}
                  <div className="address-item">
                    <span className="dot green"></span>
                    <div className="address-content">
                      <p className="label">Pickup Location</p>
                      <p className="value">
                        {pickup || "Pickup location not selected"}
                        <span className="route-dot green"></span>
                        <span className="route-dot green"></span>
                        <span className="route-dot green"></span>
                        <span className="route-dot green"></span>
                      </p>
                    </div>
                  </div>
  
                  <div className="address-line"></div>
  
                  {/* DROP */}
                  <div className="address-item">
                    <span className="dot red"></span>
                    <div className="address-content">
                      <p className="label">
                        Drop Location
                        <span className="name">
                          {" "}• {name || "Name not added"}
                        </span>
                        <span className="mid-dot"> • </span>
                        <span className="phone">
                          {"" || "Phone not added"}
                        </span>
                      </p>
                      <p className="value">
                        {drop || "Drop location not selected"}
                        <span className="route-dot red"></span>
                        <span className="route-dot red"></span>
                        <span className="route-dot red"></span>
                        <span className="route-dot red"></span>
                      </p>
                    </div>
                  </div>
                </div>
  
  
                {/* VEHICLE NAME */}
                <h3>{vehicleData[vehcile].name}</h3>
  
                {/* PRICE */}
                <h4>{price ? `${price}` : `₹111/-`}</h4>
  
                {/* EDIT & VIEW DETAIL */}
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
  
                  <p
                    id="ride-detail"
                    onClick={() => setShowViewDetail(true)}
                  >
                    View Detail
                  </p>
  
                  <p
                    id="price-cancel"
                    className="cancel-trip"
                    onClick={() => setShowCancelPopup(true)}
                  >
                    Cancel Trip
                  </p>
                  {showCancelPopup && (
                    <div className="cancel-popup-overlay">
                      <div className="cancel-popup">
  
                        <span
                          className="popup-close"
                          onClick={() => setShowCancelPopup(false)}
                        >
                          ✕
                        </span>
  
                        <h2>HEY, WAIT!</h2>
                        <p>Are you sure you want to cancel your order?</p>
  
                        <div className="popup-actions">
                          <button
                            className="popup-btn cancel"
                            onClick={() => {
                              setShowCancelPopup(false);
                              setShowSummary(false);
                              setFare("");
                              navigate("/fare-link");
                            }}
                          >
                            CANCEL TRIP
                          </button>
  
                          <button
                            className="popup-btn save"
                            onClick={() => setShowCancelPopup(false)}
                          >
                            SAVE TRIP
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
  
  
                {/* VIEW DETAIL MODAL */}
                {showViewDetail && (
                  <div className="view-detail-overlay">
                    <div className="view-detail-modal">
  
                      <span
                        className="view-detail-close"
                        onClick={() => setShowViewDetail(false)}
                      >
                        ✕
                      </span>
  
                      <div className="view-detail-body">
  
                        {/* LEFT */}
                        <div className="view-left">
                          <img src={selected.img} alt="vehicle" />
                          <h4>{activeTab}</h4>
                          <h2>₹{fare || price}/-</h2>
                        </div>
  
                        <div className="view-divider"></div>
  
                        {/* RIGHT */}
                        <div className="view-right">
                          <h3>View Detail</h3>
  
                          <div className="info-block">
                            <h5>Pickup Location</h5>
                            <p>
                              <img src={GreenCircle} alt="" />
                              <span className="text">{pickup}</span>
                            </p>
                          </div>
  
                          <div className="info-block">
                            <h5>Drop Location</h5>
                            <p>
                              <img src={Drop} alt="" />
                              <span className="text">{drop}</span>
                            </p>
                          </div>
  
                          <div className="info-block meta-row">
                            <p>
                              <img src={PhoneNumber} alt="" />
                              <span className="text">+91 {phone?phone:'1212121212'}</span>
                            </p>
                            <span className="meta-label receiver">Receiver</span>
                          </div>
  
                          <div className="info-block meta-row">
                            <p>
                              <img src={Username} alt="" />
                              <span className="text">{name}</span>
                            </p>
                            <span className="meta-label receiver">Receiver</span>
                          </div>
  
                          <button
                            className="view-book-btn"
                            onClick={handleRequestedRide}
                          >
                            BOOK NOW
                          </button>
                        </div>
  
                      </div>
                    </div>
                  </div>
                )}
  
              </div>
            </div>
            <div class="ride-divider"></div>
  
            <div className="ride-right">
              <div className="right-text">
                <h2>SEARCHING FOR <br /> DRIVER NEARBY<span className="route-dot blue"></span><span className="route-dot blue"></span><span className="route-dot blue"></span></h2>
                <p>Finding Driver near you.</p>
              </div>
              <div className="ride-map">
                {/* <img src={SLIDER} alt="" /> */}
              </div>
              <div class="progress-container">
                <div class="progress-bar"></div>
              </div>
            </div>
  
          </div>
        </div>
        <Footer />
      
        {/* <ScrollToTopButton /> */}
      </>
    );
};

export default Ride