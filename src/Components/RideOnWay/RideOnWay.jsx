import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import "./RideOnWay.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { SocketContext } from "../../context/Socketcontext";

import success from "../../assets/success.png";
import TwoWheeler from "../../assets/2wheeler.png";
import MiniAuto from "../../assets/MiniAuto.png";
import Eloader from "../../assets/Eloader.png";
import ThreeWheeler from "../../assets/3wheeler.png";
import MiniTruck from "../../assets/Minitruck.png";
import carIcon from "../../assets/car.png"; // Your car icon for marker
import { ScrollToTopButton } from "../ScrollToTopButton/ScrollToTopButton";

const RideOnWay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useContext(SocketContext);
  const ride = JSON.parse(localStorage.getItem("ride"));

  const [driverLocation, setDriverLocation] = useState(
    ride?.driverId?.location
      ? { lat: ride.driverId.location.coordinates[1], lng: ride.driverId.location.coordinates[0] }
      : null
  );
  const [driverHeading, setDriverHeading] = useState(0); // rotation for car icon
  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [activeTab, setActiveTab] = useState("2 Wheeler.");

  const mapRef = useRef(null);
  const animationRef = useRef(null);

  const vehicleData = {
    "2 Wheeler.": { img: TwoWheeler, price: "140" },
    "Mini Auto.": { img: MiniAuto, price: "180" },
    "E Loader.": { img: Eloader, price: "260" },
    "3 Wheeler.": { img: ThreeWheeler, price: "350" },
    "Mini Truck.": { img: MiniTruck, price: "520" },
  };
  const selected = vehicleData[activeTab];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
  });

  const mapOptions = useMemo(
    () => ({ mapTypeControl: false, streetViewControl: false, fullscreenControl: false }),
    []
  );

  // ====== Set active vehicle ======
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

  // ====== Join order room ======
  useEffect(() => {
    if (!socket || !ride?._id) return;
    socket.emit("joinOrder", { orderId: ride._id, userId: ride.userId._id, driverId: ride.driverId._id });
  }, [socket, ride?._id]);

  // ====== Ride started ======
  useEffect(() => {
    if (!socket) return;

    const handleRideStart = () => {
      alert("Ride Started!");
      navigate("/ride/started");
    };

    socket.on("start-ride", handleRideStart);
    return () => socket.off("start-ride", handleRideStart);
  }, [socket, navigate]);

  // ====== Animate marker along route ======
  const pathRef = useRef([]);
  const stepRef = useRef(0);

  const calculateHeading = (from, to) => {
    const latDiff = to.lat - from.lat;
    const lngDiff = to.lng - from.lng;
    return (Math.atan2(lngDiff, latDiff) * 180) / Math.PI;
  };

  const animateMarker = () => {
    if (!pathRef.current.length) return;

    const nextStep = stepRef.current + 1;
    if (nextStep >= pathRef.current.length) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const nextLatLng = pathRef.current[nextStep];
    const currentLatLng = driverLocation;
    setDriverHeading(calculateHeading(currentLatLng, { lat: nextLatLng.lat(), lng: nextLatLng.lng() }));
    setDriverLocation({ lat: nextLatLng.lat(), lng: nextLatLng.lng() });
    stepRef.current = nextStep;

    animationRef.current = requestAnimationFrame(animateMarker);
  };

  // ====== Track driver location + recalc route ======
  useEffect(() => {
    if (!socket || !ride) return;

    const handleDriverLocation = (loc) => {
      const driverLatLng = { lat: loc.lat, lng: loc.lng };

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverLatLng,
          destination: ride.pickUp,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirectionResponse(result);
            const leg = result.routes[0].legs[0];
            setDistance(leg.distance.text);
            setTravelTime(leg.duration.text);

            // Animate marker along route
            pathRef.current = result.routes[0].overview_path;
            stepRef.current = 0;
            cancelAnimationFrame(animationRef.current);
            animationRef.current = requestAnimationFrame(animateMarker);
          }
        }
      );
    };

    socket.on("driverLocation", handleDriverLocation);
    return () => socket.off("driverLocation", handleDriverLocation);
  }, [socket, ride]);

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
                      <img src={success} alt="success" className="pickup-success-icon" />
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
            <p style={{ fontWeight: "600", color: "blue" }}>OTP - {ride.otp}</p>
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
                {driverLocation && (
                  <Marker
                    position={driverLocation}
                    icon={{
                      url: carIcon,
                      scaledSize: new window.google.maps.Size(50, 50),
                      anchor: new window.google.maps.Point(25, 25),
                      rotation: driverHeading,
                    }}
                  />
                )}
                {directionResponse && (
                  <DirectionsRenderer directions={directionResponse} options={{ suppressMarkers: true }} />
                )}
              </GoogleMap>
            </div>

            {/* Driver info */}
            <div className="driver-card">
              <div className="driver-left">
                <img src={ride.driverId.documents?.profile_photo} alt="driver" className="driver-avatar" />
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
                  <span style={{ color: "green", fontWeight: "600", marginLeft: "10px" }}>{travelTime}</span>
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
