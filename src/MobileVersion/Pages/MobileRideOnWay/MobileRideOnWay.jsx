import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import { GoogleMap, Marker ,
  DirectionsRenderer, } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";
import { SocketContext } from "../../../context/Socketcontext";
import bike from '../../../assets/bike-2.png'
import Driver from '../../../assets/driver2.jpg'
import { useNavigate } from "react-router-dom";

function MobileRideOnWay() {

  const [search, setSearch] = useState(true);
  const { isLoaded } = useGoogleMaps();
  const { socket } = useContext(SocketContext);
  const ride = JSON.parse(localStorage.getItem("ride"));
  const [distance, setDistance] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [directionResponse, setDirectionResponse] = useState(null);
  const [driverLocation, setDriverLocation] = useState(
     ride?.driverId?.location
       ? {
           lat: ride.driverId.location.coordinates[1],
           lng: ride.driverId.location.coordinates[0],
         }
       : null
   );
    const mapRef = useRef(null);
     const markerRef = useRef(null);
     const animationRef = useRef(null);
       const targetLocationRef = useRef(driverLocation);

    const mapOptions = useMemo(
       () => ({
         mapTypeControl: false,
         streetViewControl: false,
         fullscreenControl: false,
       }),
       []
     );
  
  // ====== SOCKET: JOIN ORDER ROOM ======
//   useEffect(() => {
//     if (!socket || !ride?._id) return;
//     socket.emit("joinOrder", {
//       orderId: ride._id,
//       userId: ride.userId._id,
//       driverId: ride.driverId._id,
//     });
//   }, [socket, ride?._id]);

const getBearing = (start, end) => {
  if (!start || !end) return 0;
  
  const lat1 = (start.lat * Math.PI) / 180;
  const lng1 = (start.lng * Math.PI) / 180;
  const lat2 = (end.lat * Math.PI) / 180;
  const lng2 = (end.lng * Math.PI) / 180;

  const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
  
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360; // Returns degrees 0-360
};

// Add this to your state declarations
const [rotation, setRotation] = useState(0);




// ====== SOCKET: DRIVER LOCATION TRACKING WITH SMOOTH ANIMATION ======
  useEffect(() => {
    if (!socket) return;

    const animateMarker = () => {
      if (!driverLocation || !targetLocationRef.current) return;

      const latDiff = targetLocationRef.current.lat - driverLocation.lat;
      const lngDiff = targetLocationRef.current.lng - driverLocation.lng;

      // small step for smooth animation
      const step = 0.02; // adjust speed: smaller = slower
      if (Math.abs(latDiff) < 0.00001 && Math.abs(lngDiff) < 0.00001) {
        cancelAnimationFrame(animationRef.current);
        return;
      }

      setDriverLocation((prev) => ({
        lat: prev.lat + latDiff * step,
        lng: prev.lng + lngDiff * step,
      }));

      animationRef.current = requestAnimationFrame(animateMarker);
    };

    const handleDriverLocation = (newLocation) => {
        // Update your handleDriverLocation socket function
        console.log(newLocation)
        if (targetLocationRef.current) {
        const bearing = getBearing(targetLocationRef.current, newLocation);
        // Only update rotation if the driver has actually moved significantly
        if (bearing !== 0) setRotation(bearing);
    }
      targetLocationRef.current = newLocation;
      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animateMarker);
    };

    socket.on("driverLocation", handleDriverLocation);

    return () => {
      socket.off("driverLocation", handleDriverLocation);
      cancelAnimationFrame(animationRef.current);
    };
  }, [socket, driverLocation]);

  // ====== CALCULATE ROUTE ======
  useEffect(() => {
    if (!isLoaded || !driverLocation || !ride?.pickUp || directionResponse) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: driverLocation,
        destination: ride.pickUp,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirectionResponse(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setTravelTime(result.routes[0].legs[0].duration.text);
        }
      }
    );
  }, [isLoaded, driverLocation, ride?.pickUp, directionResponse]);
  if (!isLoaded) return <div className="loading">Loading map…</div>;
  return (
     <div className="searching-page">
          {/* MAP */}
           {/* <SuccessPopUp heading={'Driver Accepted Your Order'} para={'Your Order is Accepted by Driver He is on the way to reach Pickup Location'} btn={'OK'}/> */}
          <div className="map-container2">
               <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={driverLocation}
                zoom={14}
                options={mapOptions}
                onLoad={(map) => (mapRef.current = map)}
              >
                {/* DRIVER MARKER */}
                {driverLocation && (
                  <Marker
                    position={driverLocation}
                    ref={markerRef}
                    icon={{
                    url: bike,
                    scaledSize: new window.google.maps.Size(40, 40),
                    anchor: new window.google.maps.Point(25, 25),
                    rotation: rotation,

                    }}
                  />
                )}

                {/* ROUTE */}
                {directionResponse && (
                  <DirectionsRenderer
                    directions={directionResponse}
                    options={{ suppressMarkers: true }}
            
                  />
                )}
              </GoogleMap>
          </div>

          {/* BOTTOM CARD */}
     {/* DRIVER ASSIGNED CARD */}
<div className="search-card assigned">

  {/* STATUS */}
  <div className="assigned-header">
    <div className="status-icon">✓</div>
    <div>
      <h3>Driver assigned</h3>
      <p>Driver is on the way</p>
    </div>
  </div>

            {/* DRIVER INFO */}
            <div className="driver-info">
                <img
                src={Driver}
                alt="Driver"
                className="driver-avatar"
                />

                <div className="driver-meta">
                <div className="driver-name">
                    {ride.driverId.name}
                    <span className="rating">★ {ride.driverId.rating||'3.5'}</span>
                </div>
                <div className="vehicle-info">
                    {ride.driverId.vehicle} · {ride.driverId.vehicleNumber}
                </div>
                </div>
                <div style={{display:'flex',flexDirection:'row',fontSize:'14px',padding:'5px',background:'#004cff1f',borderRadius:'5px'}}>
                   OTP - {ride.otp}
                </div>

                <div className="eta">
                {/* {ride.eta}  */}
                32min
                </div>
            </div>

            {/* LOCATION */}
            <div className="ride-details">
                <div className="location-row">
                <span className="dot pickup"></span>
                <span>{ride.pickUp}</span>
                </div>

                <div className="location-row">
                <span className="dot drop"></span>
                <span>{ride.drop}</span>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="action-buttons">
                <button className="call-btn">Call</button>
                {/* <button className="chat-btn">Chat</button> */}
            </div>

            {/* FOOTER */}
            <div className="info-text">
                Share OTP only after verifying the driver.
            </div>
            </div>

        </div>
  )
}

export default MobileRideOnWay