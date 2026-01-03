import React, { useState, useEffect } from "react";
import "./RideOnWay.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";

import success from "../../assets/success.png";
import TwoWheeler from "../../assets/2wheeler.png";
import MiniAuto from "../../assets/MiniAuto.png";
import Eloader from "../../assets/Eloader.png";
import ThreeWheeler from "../../assets/3wheeler.png";
import MiniTruck from "../../assets/Minitruck.png";

import GreenCircle from "../../assets/greencircle.png";
import Drop from "../../assets/Drop.png";
import PhoneNumber from "../../assets/phonenumber.png";
import Username from "../../assets/username.png";
import { ScrollToTopButton } from "../ScrollToTopButton/ScrollToTopButton";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const RideOnWay = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [fare, setFare] = useState("");
  const [showViewDetail, setShowViewDetail] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance,setDistance]=useState('')
  const [travelTime,setTravelTime]=useState('')

  const vehicleData = {
    "2 Wheeler.": { img: TwoWheeler, price: "140", name: "bike" },
    "Mini Auto.": { img: MiniAuto, price: "180", name: "miniAuto" },
    "E Loader.": { img: Eloader, price: "260", name: "ELoader" },
    "3 Wheeler.": { img: ThreeWheeler, price: "350", name: "threeWheeler" },
    "Mini Truck.": { img: MiniTruck, price: "520", name: "miniTruck" },
  };

  const [activeTab, setActiveTab] = useState("2 Wheeler.");
  const selected = vehicleData[activeTab];

  const ride = JSON.parse(localStorage.getItem("ride"));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (location.state?.vehicle) {
      const map = {
        "2-wheeler": "2 Wheeler.",
        "mini-auto": "Mini Auto.",
        "e-loader": "E Loader.",
        "3-wheeler": "3 Wheeler.",
        "mini-truck": "Mini Truck.",
      };
      setActiveTab(map[location.state.vehicle] || "2 Wheeler.");
    }
  }, [location.state]);

  /* ================= GOOGLE MAP ================= */

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
  });

  const calculateRoute = async () => {
    if (!window.google || !ride?.pickUp || !ride?.drop) return;

    const directionsService = new window.google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin:{
            lat:ride.driverId.location.coordinates[1],
            lng:ride.driverId.location.coordinates[0],
        },
        destination: ride.pickUp,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
     setDistance( result.routes[0].legs[0].distance.text )  // "12.4 km"
     setTravelTime( result.routes[0].legs[0].duration.text)
      setDirectionResponse(result);
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <>
      <Navbar />
      <div className="fare-container">
        <div className="fare-body">
          <div className="fare-card" id="fare-card">
            <div className="fare-trip">
              <p>Trip Id.</p>
              <p>{ride?._id}</p>
            </div>

            <div className="fare-top">
              <img src={selected.img} alt="vehicle" />
            </div>

            <div className="fare-detail">
              <div className="address-box">
                <p className="address-title">Address Details</p>

                <div className="address-item">
                  <span className="dot green"></span>
                  <div className="address-content">
                    <p className="label">Pickup Location</p>
                    <p className="value">
                      {ride?.pickUp}
                      <img src={success} alt="success" className="pickup-success-icon" />
                    </p>
                  </div>
                </div>

                <div className="address-line"></div>

                <div className="address-item">
                  <span className="dot red"></span>
                  <div className="address-content">
                    <p className="label">
                      Drop Location • {ride?.userId?.name} • {ride?.userId?.phone}
                    </p>
                    <p className="value">{ride?.drop}</p>
                  </div>
                </div>
              </div>

              <h3>{activeTab}</h3>
              <h4>₹{ride?.fare || selected.price}/-</h4>

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

          <div className="rideon-divider"></div>

          <div className="ride-right">
            <div className="right-text">
              <h2>DRIVER ON THE WAY <br /> TO PICKUP.</h2>
              <p>Finding Driver near you.</p>
            </div>

            <div className="ride-map">
              {ride?.driverId?.location && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "400px" ,borderRadius:"6px"}}
                  center={{
                    lat: ride.driverId.location.coordinates[1],
                    lng: ride.driverId.location.coordinates[0],
                  }}
                  zoom={10}
                >
                  <Marker
                    position={{
                      lat: ride.driverId.location.coordinates[1],
                      lng: ride.driverId.location.coordinates[0],
                    }}
                  />

                  {directionResponse && (
                    <DirectionsRenderer directions={directionResponse} />
                  )}
                </GoogleMap>
              )}
            </div>

            <div className="driver-card">
              <div className="driver-left">
                <img
                  src={ride?.driverId?.documents?.profile_photo}
                  alt="driver"
                  className="driver-avatar"
                />

                <div className="driver-info">
                  <h2 className="vehicle-number">{ride?.driverId?.numberPlate}</h2>
                  <p className="call-driver">Call Driver - {ride?.driverId?.phone}</p>

                  <div className="driver-name">
                    <strong>{ride?.driverId?.name}</strong>
                    <span>View</span>
                  </div>
                </div>
              </div>

              <div className="driver-divider"></div>

              <div className="driver-right">
                <p className="ride-type">
                  {ride?.driverId?.vehcile} - 
                  <span style={{color:"green",fontWeight:"600",marginLeft:"10px"}}>{travelTime}</span>
                  <span style={{marginLeft:"20px"}}>({distance})</span>
                </p>
                
                <p className="coming-text">Coming soon wait for while</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default RideOnWay;
