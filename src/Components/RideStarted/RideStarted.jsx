import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { SocketContext } from "../../context/Socketcontext";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useGoogleMaps } from "../../utils/useGoogleMaps";

function RideStarted() {
  const { socket } = useContext(SocketContext);
  const { isLoaded } = useGoogleMaps();

  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [rideData, setRideData] = useState(null);

  const ride = JSON.parse(localStorage.getItem("ride") || "null");

  /* ================= SAFETY ================= */
  if (!ride) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h2>No active ride found</h2>
        </div>
      </>
    );
  }

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!socket || !ride?._id) return;

    const handleRideCompleted = (completedRide) => {
      alert("Ride Completed");
      console.log("Completed Ride:", completedRide);

      socket.emit("leave-room", {
        room: `order_${ride._id}`,
      });
    };

    socket.on("ride-completed", handleRideCompleted);

    return () => {
      socket.off("ride-completed", handleRideCompleted);
    };
  }, [socket, ride?._id]);

  /* ================= FETCH RIDE DETAILS ================= */
  useEffect(() => {
    if (!ride?._id) return;

    axios
      .post("https://thetest-h9x3.onrender.com/ride/get-ride-detail", {
        rideId: ride._id,
      })
      .then((res) => {
        setRideData(res.data.data);
      })
      .catch((err) => {
        console.error("Ride detail error:", err);
      });
  }, [ride?._id]);

  /* ================= ROUTE ================= */
  const calculateRoute = async () => {
    if (
      !window.google ||
      !ride?.pickUp ||
      !ride?.drop ||
      !ride?.driverId?.location
    )
      return;

    const directionsService = new window.google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: ride.pickUp,
        destination: ride.drop,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionResponse(result);
      setDistance(result.routes[0].legs[0].distance.text);
      setTravelTime(result.routes[0].legs[0].duration.text);
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "20px" }}>Loading Map...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Ride Started</h1>

        {/* ================= MAP ================= */}
        <div
          style={{
            width: "100%",
            height: "500px",
            border: "2px solid black",
            marginTop: "10px",
          }}
        >
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "400px",
            }}
            center={{
              lat: ride.driverId.location.coordinates[1],
              lng: ride.driverId.location.coordinates[0],
            }}
            zoom={12}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            {/* Driver marker */}
            <Marker
              position={{
                lat: ride.driverId.location.coordinates[1],
                lng: ride.driverId.location.coordinates[0],
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "blue",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#fff",
              }}
            />

            {directionResponse && (
              <DirectionsRenderer directions={directionResponse} />
            )}
          </GoogleMap>
        </div>

        {/* ================= INFO ================= */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "20px",
          }}
        >
          <div>
            <p><strong>Driver:</strong> {ride.driverId?.name}</p>
            <p><strong>Phone:</strong> {ride.driverId?.phone}</p>
          </div>

          <div>
            <h3>
              Ride OTP:{" "}
              <span style={{ color: "blue" }}>
                {rideData?.rideConfirmOtp || "---"}
              </span>
            </h3>
            <p><strong>ETA:</strong> {travelTime || "Calculating..."}</p>
            <p><strong>Distance:</strong> {distance || "Calculating..."}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RideStarted;
