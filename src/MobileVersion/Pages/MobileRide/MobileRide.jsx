import React, { useContext, useEffect, useRef, useState } from "react";
import "./MobileRide.css";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";
import { SocketContext } from "../../../context/Socketcontext";
import bikeIcon from "../../../assets/bike-2.png";
import Popup from "../../Components/Popup/Popup.jsx";
import SuccessPopUp from "../../Components/SuccessPopUp/SuccessPopUp.jsx";
import Driver from '../../../assets/driver2.jpg'
import { useNavigate } from "react-router-dom";

function MobileRide() {
  const [search, setSearch] = useState(true);
  const { isLoaded } = useGoogleMaps();
  const { socket } = useContext(SocketContext);
  const ride = JSON.parse(localStorage.getItem("ride"));
  const nearByDrivers = ride?.nearbyDrivers || [];


  if (!isLoaded) return <div className="loading">Loading map…</div>;

    useEffect(() => {
      if (!socket) return;
  
      const handleRideConfirmed = (ride) => {
        alert(`Status: ${ride.status}\nDriver: ${ride.driverId.name}`);
        localStorage.setItem("ride", JSON.stringify(ride));
        
        
      };
  
      socket.on("ride-confirmed", handleRideConfirmed);
  
      return () => socket.off("ride-confirmed", handleRideConfirmed);
    }, [socket]);

  return (
    <>
        <div className="searching-page">
          {/* MAP */}
           {/* <SuccessPopUp heading={'Driver Accepted Your Order'} para={'Your Order is Accepted by Driver He is on the way to reach Pickup Location'} btn={'OK'}/> */}
          <div className="map-container2">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={ride.pickupCoordinates}
              zoom={13}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              {/* Pickup Marker */}
              <Marker position={ride.pickupCoordinates} />

              {/* Nearby Drivers */}
              {nearByDrivers.map((driver, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: driver[1],
                    lng: driver[0],
                  }}
                  icon={{
                    url: bikeIcon,
                    scaledSize: new window.google.maps.Size(40, 40),
                    anchor: new window.google.maps.Point(20, 20),
                  }}
                />
              ))}
            </GoogleMap>
          </div>

          {/* BOTTOM CARD */}
          <div className="search-card">
            <div className="search-header">
              <h3>Searching drivers</h3>
              <p>Matching with nearby drivers</p>
            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>

            {/* RIDE DETAILS */}
            <div className="ride-details">
              <div className="location-row">
                <span className="dot pickup"></span>
                <div><strong>PickUp Location </strong></div>
                <div>{ride.pickUp}</div>
              </div>
             
              <div className="location-row">
                <span className="dot drop"></span>
                <strong>Drop Location </strong>
                <div>{ride.drop}</div>
              </div>

              <div className="ride-meta">
                <div className="meta-item">
                  <span className="label">Distance</span>
                  <span className="value">{ride.distance} km</span>
                </div>

                <div className="meta-item">
                  <span className="label">Fare</span>
                  <span className="value">₹{ride.fare}</span>
                </div>

                <div className="meta-item">
                  <span className="label">Vehicle</span>
                  <span className="value">Bike</span>
                </div>
              </div>

              <button className="cancel-btn" onClick={() => setSearch(false)}>
                Cancel Ride
              </button>

             
            </div>
          </div>
        </div>
      
    </>
  )
}

export default MobileRide;
