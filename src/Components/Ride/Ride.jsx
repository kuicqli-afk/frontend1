import React, { useContext, useEffect, useState } from "react";
import "../FareLink/FareLink.css";
import "./Ride.css";

import TwoWheeler from "../../assets/2wheeler.png";
import MiniAuto from "../../assets/MiniAuto.png";
import Eloader from "../../assets/Eloader.png";
import ThreeWheeler from "../../assets/3wheeler.png";
import MiniTruck from "../../assets/Minitruck.png";

import { SocketContext } from "../../context/Socketcontext";
import { useGoogleMaps } from "../../providers/GoogleMapsProvider.jsx";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

import { GoogleMap, Marker } from "@react-google-maps/api";
import bikeIcon from '../../assets/bike-2.png'

function Ride() {
  const ride = JSON.parse(localStorage.getItem("ride"));
  const { socket } = useContext(SocketContext);
  const { isLoaded } = useGoogleMaps();
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
   const [progress, setProgress] = useState(0);
  const pickupLocation =ride.pickupCoordinates
  const nearByDrivers=ride.nearbyDrivers;


    useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 1000); // increment progress every 100ms
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = (ride) => {
      alert(`Status: ${ride.status}\nDriver: ${ride.driverId.name}`);
      localStorage.setItem("ride", JSON.stringify(ride));
      navigate("/ride/confirmed");
    };

    socket.on("ride-confirmed", handleRideConfirmed);

    return () => socket.off("ride-confirmed", handleRideConfirmed);
  }, [socket, navigate]);

  if (!ride) return <p>No ride found</p>;
  if (!isLoaded || !pickupLocation) return <p>Loading map...</p>;

  const vehicleData = {
    bike: { img: TwoWheeler, name: "2 Wheeler." },
    miniAuto: { img: MiniAuto, name: "Mini Auto" },
    ELoader: { img: Eloader, name: "E Loader" },
    threeWheeler: { img: ThreeWheeler, name: "3 Wheeler" },
    miniTruck: { img: MiniTruck, name: "Mini Truck" },
  };



  return (
    <>
      <Navbar />
      <div className="fare-container">
        <div className="fare-body">
          {/* LEFT CARD */}
          <div className="fare-card">
            <div className="fare-trip">
              <p>Trip Id.</p>
              <p>{ride._id}</p>
            </div>

            <div className="fare-top">
              <img src={vehicleData[ride.vehcile].img} alt="vehicle" />
            </div>

            <div className="fare-detail">
              <div className="address-box">
                <p className="address-title">Address Details</p>

                <div className="address-item">
                  <span className="dot green"></span>
                  <div className="address-content">
                    <p className="label">Pickup Location</p>
                    <p className="value">{ride.pickUp}</p>
                  </div>
                </div>

                <div className="address-line"></div>

                <div className="address-item">
                  <span className="dot red"></span>
                  <div className="address-content">
                    <p className="label">Drop Location • {name}</p>
                    <p className="value">{ride.drop}</p>
                  </div>
                </div>
              </div>

              <h3>{vehicleData[ride.vehcile].name}</h3>
              <h4>₹{ride.fare}/-</h4>
            </div>
          </div>

          <div className="ride-divider"></div>

          {/* RIGHT SIDE */}
          <div className="ride-right">
            <div className="right-text">
              <h2>SEARCHING FOR DRIVER NEARBY</h2>
              <p>Finding Driver near you.</p>
            </div>

            {/* GOOGLE MAP */}
            <div className="ride-map" style={{ width: "700px", height: "400px", position: "relative" }}>
                    
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={pickupLocation}
                        zoom={10}
                        options={{ disableDefaultUI: true, zoomControl: true }}
                      >
                        <Marker position={pickupLocation} />
                        {nearByDrivers.map((element, index) => (
                          <Marker
                            key={index}
                            position={{
                              lat: element[1],
                              lng: element[0],
                            }}
                            icon={{
                              url: bikeIcon,
                              scaledSize: new window.google.maps.Size(60, 60),
                              anchor: new window.google.maps.Point(15, 15),
                            }}
                          />
                        ))}
                        </GoogleMap>
                   

                    {/* Centered animations */}
                    <div className="animation-box"></div>
                    <div className="animation-box-2"></div>
                  </div>

            <div className="progress-container">
              <div className="progress-bar"   style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Ride;
