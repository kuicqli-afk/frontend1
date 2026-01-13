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

import { SocketContext } from "../../context/Socketcontext";

const RideOnWay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useContext(SocketContext);

  const ride = JSON.parse(localStorage.getItem("ride"));

  /* ================= STATE ================= */
  const [driverLocation, setDriverLocation] = useState(null);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [travelTime, setTravelTime] = useState("");

  /* ================= MAP REFS ================= */
  const mapRef = useRef(null);
  const initialCenterRef = useRef(null);

  /* ================= GOOGLE MAP LOADER ================= */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
  });

  const mapOptions = useMemo(
    () => ({
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    }),
    []
  );

  /* ================= JOIN ORDER ROOM ================= */
  useEffect(() => {
    if (!socket || !ride?._id) return;

    socket.emit("joinOrder", {
      orderId: ride._id,
      userId: ride.userId._id,
      driverId: ride.driverId._id,
    });
  }, [socket, ride?._id]);

  /* ================= DRIVER LOCATION TRACKING ================= */
  useEffect(() => {
    if (!socket) return;

    const handleDriverLocation = (location) => {
      setDriverLocation((prev) => {
        if (
          prev &&
          prev.lat === location.lat &&
          prev.lng === location.lng
        ) {
          return prev;
        }
        return location;
      });

      mapRef.current?.panTo(location);
    };

    socket.on("driverLocation", handleDriverLocation);

    return () => {
      socket.off("driverLocation", handleDriverLocation);
    };
  }, [socket]);

  /* ================= LOCK MAP CENTER ================= */
  useEffect(() => {
    if (!initialCenterRef.current && driverLocation) {
      initialCenterRef.current = driverLocation;
    }
  }, [driverLocation]);

  /* ================= ROUTE (CALCULATE ONCE) ================= */
  useEffect(() => {
    if (
      !isLoaded ||
      !driverLocation ||
      !ride?.pickUp ||
      directionResponse
    )
      return;

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

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <>
      <Navbar />

      <div className="ride-map">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={initialCenterRef.current}
          zoom={14}
          options={mapOptions}
          onLoad={(map) => (mapRef.current = map)}
        >
          {/* DRIVER LIVE MARKER */}
          {driverLocation && (
            <Marker
              position={driverLocation}
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

      <div className="driver-card">
        <p>
          ETA: <strong>{travelTime}</strong> ({distance})
        </p>
      </div>

      <Footer />
    </>
  );
};

export default RideOnWay;
