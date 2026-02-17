import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./MobileRideOnWay.css";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";
import { SocketContext } from "../../../context/Socketcontext";
import bike from "../../../assets/bike-2.png";
import Driver from "../../../assets/driver2.jpg";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../assets/Logo.png";
import coin from "../../../assets/coin.png";
import bell from "../../../assets/Bell.png";
import { MdWatchLater } from "react-icons/md";
import drop2 from "../../../assets/drop2.png";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import location from "../../../assets/Location.png";
import profile from "../../../assets/driver2.jpg";
import TwoWheeler from "../../../assets/blue-scooter.png";
import StarRating from "../../Components/StarRating/StarRating.jsx";
import cash from "../../../assets/cash.jpg";
import { AiOutlineInfo } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import { RideContext } from "../../../context/RideContext.jsx";
import weight2 from "../../../assets/weight2.png";
import MiniAuto from "../../../assets/blue-miniAuto.png";
import Eloader from "../../../assets/blue-eloader.png";
import ThreeWheeler from "../../../assets/3wheeler.png";
import MiniTruck from "../../../assets/blue-minitruck.png";

function MobileRideOnWay() {
  const [search, setSearch] = useState(true);
  const phone = localStorage.getItem("phone");
  const name = localStorage.getItem("name");
  const { isLoaded } = useGoogleMaps();
  const { socket } = useContext(SocketContext);
  const ride = JSON.parse(localStorage.getItem("ride"));
  const [distance, setDistance] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [directionResponse, setDirectionResponse] = useState(null);
  const [activeVehicle, setActiveVehicle] = useState("");
  const { vehicle, fare } = useContext(RideContext);
  const [dots, setDots] = useState("");
  const [breakup, setBreakup] = useState(false);
  const vehicleImages = {
    bike: { img: TwoWheeler, name: "2 Wheeler" },
    miniAuto: { img: MiniAuto, name: "Mini Auto" },
    ELoader: { img: Eloader, name: "E Loader" },
    miniTruck: { img: MiniTruck, name: "Mini Truck" },
  };
  const [prohibitedItems, setProhibitedItems] = useState(false);
  const navigate = useNavigate();
  const prohibitedItemsData = [
    "Weapons and Firearms",
    "Explosive Substances and Devices",
    "Flammable Materials",
    "Hazardous and Toxic Goods",
    "Radioactive Substances",
    "Narcotics and Prohibited Drugs",
    "Illegal or Restricted Items",
    "Gambling Equipment and Lottery Materials",
    "Currency, Coins, and Negotiable Instruments",
    "Precious Jewellery and Valuable Ornaments",
    "Gemstones and Semi-Precious Stones",
    "Tobacco Products, Cigarettes, and Alcoholic Beverages",
    "Dry Ice and Temperature-Sensitive Chemicals",
    "Fire Safety Equipment (e.g., Fire Extinguishers)",
    "Live Animals and Pets",
    "Livestock and Farm Animals",
    "Human Organs or Body Parts",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 6 ? prev + "." : ""));
    }, 300); // add one dot every 500ms

    return () => clearInterval(interval);
  }, []);
  const [driverLocation, setDriverLocation] = useState(
    ride?.driverId?.location
      ? {
          lat: ride.driverId.location.coordinates[1],
          lng: ride.driverId.location.coordinates[0],
        }
      : null,
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
    [],
  );

  useEffect(() => {
    if (!fare) return;
    console.log(fare);
    const activeVehicle = fare.find((item) => item.vehicleType === vehicle);
    setActiveVehicle(activeVehicle);
  }, [fare]);

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
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
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
      console.log(newLocation);
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
    if (!isLoaded || !driverLocation || !ride?.pickUp || directionResponse)
      return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: driverLocation,
        destination: ride.pickUp.address,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirectionResponse(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setTravelTime(result.routes[0].legs[0].duration.value);
          console.log(travelTime);
        }
      },
    );
  }, [isLoaded, driverLocation, ride?.pickUp, directionResponse]);

  const formatTime = (totalSeconds) => {
    const hr = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;

    return { hr, min, sec };
  };

  const { hr, min, sec } = formatTime(travelTime);

  if (!isLoaded) return <div className="loading">Loading map…</div>;
  return (
    <div className="search-conatiner">
      <header className="header2" style={{ background: "#0000E6" }}>
        <Link to="/fare-link">
          <img src={logo} alt="" width={120} style={{ marginTop: "4px" }} />
        </Link>

        <div className="header-right">
          <div className="coin-badge">
            <div style={{ marginLeft: "-10px" }}>
              <img src={coin} alt="" width={22} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>12 Coins Available </span>
              <p
                style={{
                  fontSize: "7px",
                  fontWeight: "300",
                  paddingTop: "1px",
                }}
              >
                Earn 11 More Coins To Use
              </p>
            </div>
          </div>
          <div>
            <img src={bell} width={26} />
          </div>
        </div>
      </header>

      <div className="container" style={{ zIndex: "5", gap: "5px" }}>
        <div className="map-container3" style={{ height: "200px" }}>
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
              borderRadius: "10px",
            }}
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

        {/* Trip Id Container Div */}

        <div className="trip-container">
          <div style={{ fontSize: "15px", fontWeight: "500" }}>
            Trip Id - {ride._id.slice(0, 15)}
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div className="icon-div-3">
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%", // makes it circular
                  border: "1px solid #007bff", // blue border
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <AiOutlineInfo size={14} color="#007bff" />
              </div>
              Info
            </div>
            <div className="icon-div-3">
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <FiShare2 size={18} color="#007bff" />
              </div>
              Share
            </div>
          </div>
        </div>

        {/* Trip ID Container End Here */}

         <div className="time-container" style={{ padding: "10px 15px" }}>
          <div
            className="time-container"
            style={{
              color: "#0000E6",
              fontSize: "14px",
              fontWeight: "500",
              padding: "2px",
            }}
          >
            Kuicqli heroes on the way {dots}
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <MdWatchLater size={30} style={{ color: "green" }} />
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0px",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "600" }}>
                  {String(hr).padStart(2, "0")}
                </div>
                <p style={{ color: "gray", fontSize: "10px" }}>HR</p>
              </div>
              <div>:</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0px",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "600" }}>
                  {String(min).padStart(2, "0")}
                </div>
                <p style={{ color: "gray", fontSize: "10px" }}>MIN</p>
              </div>
              <div>:</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0px",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "600" }}>
                  {String(sec).padStart(2, "0")}
                </div>
                <p style={{ color: "gray", fontSize: "10px" }}>SEC</p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="searchbar-conatiner">
                                     <div></div>
                                     <div></div>
                                     <div></div>
                                  </div> */}
        {/* Progress Bar Start */}
        <div className="searchbar-container">
          <div className="progress-bar2"></div>
        </div>
        {/* Progress Bar End */}

        {/* Vehicle div Starts*/}
        <div className="fare-container2">
          {vehicle && (
            <div
              className="vehicle"
              key={vehicle} // unique key
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "15px",
                  padding: "5px 20px",
                }}
              >
                <div
                  style={{
                    background: "blue",
                    borderRadius: "0px 0px 20px 20px",
                    padding: "10px",
                    marginTop: "-10px",
                    height: "70px",
                  }}
                >
                  <p style={{ color: "white", fontSize: "10px" }}>40KG</p>
                  <img src={weight2} alt="" width={30} />
                </div>
                <div>
                  <img
                    src={vehicleImages[vehicle].img}
                    alt=""
                    width={vehicle === "miniTruck" ? 65 : 60}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    color: "gray",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {vehicleImages[vehicle].name}
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: "500" }}>
                    {distance}Km in <div>({travelTime} mins)</div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#18bd18",
                  color: "white",
                  fontWeight: "700",
                  padding: "16px",
                  justifyContent: "center",
                  alignItems: "start",
                  lineHeight: "22px",
                  marginTop: "-2px",
                  width: "100px",
                }}
                id="green-div"
              >
                <div style={{ fontSize: "14px" }}>Fare</div>
                <div style={{ fontSize: "30px" }}>₹{ride.fare}</div>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Div Container End Here */}

        {/* Product Type Div Start */}

        <div className="input-div" style={{ padding: "9px 10px" }}>
          <div className="select-container-div">
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginLeft: "5px",
              }}
            >
              Product type selected -&nbsp;{" "}
            </div>
            <div style={{ fontWeight: "500", fontSize: "13px" }}>
              {ride.productType}
            </div>
          </div>
        </div>

        {/* Prohibited Items Div Start */}
        <div className="input-div" style={{ padding: "5px 10px" }}>
          <div className="select-container-div">
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginLeft: "5px",
                color: "  #0000E6",
              }}
            >
              List of Prohibited Items
            </div>
          </div>

          <div className="btn-container3">
            <button
              style={{
                marginTop: "0px",
                background: "none",
                padding: "5px",
                fontSize: "12px",
              }}
              onClick={() => setProhibitedItems((prev) => !prev)}
            >
              {prohibitedItems ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {prohibitedItems ? (
          <div className="prohibited-items">
            {prohibitedItemsData.map((items) => (
              <div className="prohibited-item-name">• {items}</div>
            ))}
          </div>
        ) : (
          <></>
        )}

        {/* End Of Phibited Item Div */}

        {/* Ride Address Detail Information */}

        <div
          className="info-container3"
          style={{ boxShadow: "2px 2px 5px gray" }}
        >
          <div className="div-info-container">
            <div className="location-icon-container">
              <img src={location} alt="" width={16} />
              <div
                style={{
                  height: "42px",
                  width: "0px",
                  border: "none",
                  marginLeft: "7px",
                  borderRight: "1px dashed black",
                }}
              ></div>
              <img
                src={drop2}
                alt=""
                width={15}
                height={20}
                style={{ marginTop: "5px" }}
              />
            </div>
            <div className="location-name-container">
              <div className="pick-up-div">
                <div
                  style={{
                    color: "green",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Pick Up Location
                </div>
                <div style={{ fontSize: "12px", fontWeight: "600" }}>
                  {name}.{phone}
                </div>
                <div style={{ fontSize: "10px", color: "gray" }}>
                  {" "}
                  {ride.pickUp.address}
                </div>
              </div>
              <div className="pick-up-div">
                <div
                  style={{ color: "red", fontSize: "14px", fontWeight: "600" }}
                >
                  Drop Location
                </div>
                <div style={{ fontSize: "12px", fontWeight: "600" }}>
                  {ride.receiver_name}.{ride.receiver_phone}
                </div>
                <div style={{ fontSize: "10px", color: "gray" }}>
                  {" "}
                  {ride.drop.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start of Searching text */}
        {/* <div
                                    className="time-container"
                                    style={{ color: "#0000E6", fontSize: "14px", fontWeight: "500" ,padding:'9px 12px'}}
                                  >
                                    Kuicqli heros on the way to pick Up ...
                                  </div> */}
        {/* End Of Searching Text */}

       
        <div className="driver-info-div">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <img src={profile} alt="" width={40} />
            <img src={TwoWheeler} alt="" width={50} />
            <div className="driver-info-2">
              <div style={{ fontSize: "14px", fontWeight: "700" }}>
                {ride.driverId.numberPlate}
              </div>
              <div style={{ fontSize: "12px", color: "gray" }}>{ride.driverId.name}</div>
              <div style={{ fontSize: "10px" }}>
                <StarRating rating={3} />
              </div>
            </div>
          </div>

          <div className="otp-div">OTP - {ride.otp}</div>

          <div
            style={{
              border: "2px solid blue",
              padding: "5px",
              borderRadius: "90px",
            }}
          >
            <FontAwesomeIcon
              icon={faPhone}
              size="1"
              style={{ color: "#0000E6" }}
            />
          </div>
        </div>

        <div className="cash-container">
          <div className="cash-container-1">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  margin: "5px",
                  border: "1px solid gary",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={cash}
                  alt=""
                  width={40}
                  style={{ borderRadius: "10px" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: "600" }}>Cash</div>
                <div style={{ fontSize: "10px", color: "gray" }}>
                  Payment Method
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
              }}
            >
              <div style={{ fontWeight: "600", textAlign: "right" }}>₹160</div>
              <div
                style={{ color: "blue", fontSize: "12px", padding: "1px 0px" }}
                onClick={() => setBreakup((prev) => !prev)}
              >
                {breakup ? "Hide" : "View"} Breakup
              </div>
            </div>
          </div>
          {breakup && (
            <div className="bill-detail-container">
              <h4>Bill Details</h4>
              <div
                style={{
                  borderBottom: "1px solid gray",
                  display: "flex",
                  padding: "10px 0px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <div>
                  Trip Fare{" "}
                  <span style={{ color: "gray", fontSize: "12px" }}>
                    (incl. Toll & Taxes)
                  </span>
                </div>
                <div style={{ fontWeight: "600" }}>₹{ride.fare}</div>
              </div>
              <div
                style={{
                  borderBottom: "1px solid gray",
                  display: "flex",
                  padding: "10px 0px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <div>Net Fare</div>
                <div style={{ fontWeight: "600" }}>₹{ride.fare}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "10px 0px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <div style={{ fontWeight: "600" }}>
                  Amount Payable (rounded)
                </div>
                <div style={{ fontWeight: "600" }}>₹{ride.fare}</div>
              </div>
            </div>
          )}

          {/* <div style={{display:'flex',marginTop:'10px',flexDirection:'row',background:'rgb(255, 220, 220)',padding:'10px',borderRadius:'5px',fontSize:'12px'}}>
                                                   You will receive 2 coins on this order
                                               </div> */}
        </div>
      </div>
    </div>
  );
}

export default MobileRideOnWay;
