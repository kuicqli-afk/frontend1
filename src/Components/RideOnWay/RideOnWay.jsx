import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import "./RideOnWay.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useGoogleMaps } from "../../providers/GoogleMapsProvider.jsx";
import { SocketContext } from "../../context/Socketcontext";

// Assets
import success from "../../assets/success.png";
import TwoWheeler from "../../assets/2wheeler.png";
import MiniAuto from "../../assets/MiniAuto.png";
import Eloader from "../../assets/Eloader.png";
import ThreeWheeler from "../../assets/3wheeler.png";
import MiniTruck from "../../assets/Minitruck.png";

import { ScrollToTopButton } from "../ScrollToTopButton/ScrollToTopButton";

const RideOnWay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useContext(SocketContext);

  const ride = JSON.parse(localStorage.getItem("ride"));

  // ====== STATE ======
  const [driverLocation, setDriverLocation] = useState(
    ride?.driverId?.location
      ? {
          lat: ride.driverId.location.coordinates[1],
          lng: ride.driverId.location.coordinates[0],
        }
      : null
  );
  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [activeTab, setActiveTab] = useState("2 Wheeler.");
   const { isLoaded } = useGoogleMaps();

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const animationRef = useRef(null);
  const targetLocationRef = useRef(driverLocation);

  const vehicleData = {
    "2 Wheeler.": { img: TwoWheeler, price: "140", name: "bike" },
    "Mini Auto.": { img: MiniAuto, price: "180", name: "miniAuto" },
    "E Loader.": { img: Eloader, price: "260", name: "ELoader" },
    "3 Wheeler.": { img: ThreeWheeler, price: "350", name: "threeWheeler" },
    "Mini Truck.": { img: MiniTruck, price: "520", name: "miniTruck" },
  };

  const selected = vehicleData[activeTab];

  // ====== GOOGLE MAP LOADER ======


  const mapOptions = useMemo(
    () => ({
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    }),
    []
  );

  // ====== SET ACTIVE VEHICLE ======
  useEffect(() => {
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

  // ====== SOCKET: JOIN ORDER ROOM ======
  useEffect(() => {
    if (!socket || !ride?._id) return;
    socket.emit("joinOrder", {
      orderId: ride._id,
      userId: ride.userId._id,
      driverId: ride.driverId._id,
    });
  }, [socket, ride?._id]);

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

    const handleDriverLocation = (location) => {
      targetLocationRef.current = location;
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

  // Ride Started

  useEffect(()=>{
    socket.on('start-ride',(ride)=>{
      navigate('/ride/started')
      alert('Ride Started')
    })
  },[])

  if (!isLoaded) return <div>Loading Map...</div>;
  if (!ride) return <h2>No Ride Found</h2>;

  return (
    <>
      <Navbar />

      <div className="fare-container">
        <div className="fare-body">
          {/* Left card */}
          <div className="fare-card" id="fare-card">
            <div className="fare-trip">
              <p>Trip Id.</p>
              <p>{ride._id}</p>
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
                      {ride.pickUp}
                      <img
                        src={success}
                        alt="success"
                        className="pickup-success-icon"
                      />
                    </p>
                  </div>
                </div>

                <div className="address-line"></div>

                <div className="address-item">
                  <span className="dot red"></span>
                  <div className="address-content">
                    <p className="label">
                      Drop Location • {ride.userId.name} • {ride.userId.phone}
                    </p>
                    <p className="value">{ride.drop}</p>
                  </div>
                </div>
              </div>

              <h3>{activeTab}</h3>
              <h4>₹{ride.fare || selected.price}/-</h4>
            </div>

            <p style={{ fontWeight: "600", color: "blue" }}>
              OTP - {ride.otp}
            </p>
          </div>

          {/* Right side */}
          <div className="ride-right">
            <div className="right-text">
              <h2>DRIVER ON THE WAY <br /> TO PICKUP.</h2>
              <p>Driver is on the way.</p>
            </div>

            {/* Map */}
            <div className="ride-map">
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
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: "blue",
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: "#fff",
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

            {/* Driver info */}
            <div className="driver-card">
              <div className="driver-left">
                <img
                  src={ride.driverId.documents?.profile_photo}
                  alt="driver"
                  className="driver-avatar"
                />

                <div className="driver-info">
                  <h2 className="vehicle-number">{ride.driverId.numberPlate}</h2>
                  <p className="call-driver">Call Driver - {ride.driverId.phone}</p>

                  <div className="driver-name">
                    <strong>{ride.driverId.name}</strong>
                    <span>View</span>
                  </div>
                </div>
              </div>

              <div className="driver-right">
                <p className="ride-type">
                  {ride.driverId.vehcile} - 
                  <span style={{ color: "green", fontWeight: "600", marginLeft: "10px" }}>
                    {travelTime}
                  </span>
                  <span style={{ marginLeft: "20px" }}>({distance})</span>
                </p>
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
