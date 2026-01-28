import React, { useContext, useEffect, useState } from "react";
import "./MobileRide.css";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";
import { SocketContext } from "../../../context/Socketcontext";
import bikeIcon from "../../../assets/bike-2.png";

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
        navigate("/ride/confirmed");
      };
  
      socket.on("ride-confirmed", handleRideConfirmed);
  
      return () => socket.off("ride-confirmed", handleRideConfirmed);
    }, [socket]);

  return (
    <>
      {search ? (
        <div className="searching-page">
          {/* MAP */}
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
                <span>{ride.pickUp}</span>
              </div>

              <div className="location-row">
                <span className="dot drop"></span>
                <span>{ride.drop}</span>
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
      ) : (
        <div className="confirmed">Ride Cancelled</div>
      )}
    </>
  );
}

export default MobileRide;
