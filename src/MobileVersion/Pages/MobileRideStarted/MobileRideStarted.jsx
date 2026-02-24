import React, { useContext, useEffect, useRef, useState } from "react";
import "./MobileRideStarted.css";
import { data, Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/Logo.png";
import coin from "../../../assets/coin.png";
import bell from "../../../assets/Bell.png";
import { SocketContext } from "../../../context/Socketcontext";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

import axios from "axios";
import location from "../../../assets/Location.png";
import drop2 from "../../../assets/drop2.png";
import profile from "../../../assets/driver2.jpg";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import notification from "../../../assets/notification2.wav";
import { AiOutlineInfo } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import { RideContext } from "../../../context/RideContext.jsx";
import weight2 from "../../../assets/weight2.png";
import MiniAuto from "../../../assets/blue-miniAuto.png";
import Eloader from "../../../assets/blue-eloader.png";
import ThreeWheeler from "../../../assets/3wheeler.png";
import MiniTruck from "../../../assets/blue-minitruck.png";
import TwoWheeler from "../../../assets/blue-scooter.png";
import { MdWatchLater } from "react-icons/md";
import cash from "../../../assets/cash.jpg";
import Footer from "../../Components/Footer/Footer.jsx";


function MobileRideStarted() {
  const [driverLocation, setDriverLocation] = useState();
  const [breakup, setBreakup] = useState(false);
  const { isLoaded } = useGoogleMaps();
  const [directionResponse, setDirectionResponse] = useState(null);
  const [data, setData] = useState(null);
  const phone = localStorage.getItem("phone");
  const name = localStorage.getItem("name");
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const animationRef = useRef(null);
  const targetLocationRef = useRef(driverLocation);
  const [distance,setDistance]=useState();
  const [travelTime,setTravelTime]=useState();
  const {vehicle}=useContext(RideContext);
  const [prohibitedItems, setProhibitedItems] = useState(false);
  const {coins}=useContext(RideContext);
  const [dots, setDots] = useState("");
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
    const vehicleImages = {
      bike: { img: TwoWheeler, name: "2 Wheeler" },
      miniAuto: { img: MiniAuto, name: "Mini Auto" },
      ELoader: { img: Eloader, name: "E Loader" },
      miniTruck: { img: MiniTruck, name: "Mini Truck" },
    };

    
     useEffect(() => {
        const interval = setInterval(() => {
          setDots((prev) => (prev.length < 4 ? prev + "." : ""));
        }, 300); // add one dot every 500ms
    
        return () => clearInterval(interval);
      }, []);
      
  useEffect(() => {
    if (!socket) return;

    const handleRideCompleted = (newRide) => {
      // alert("Ride Completed");
      //  socket.leave(`order_${ride._id}`);
      console.log(newRide);
      navigate("/fare-link");
    };


    const handleConfirmOtp = (data) => {
      const audio = new Audio(notification);
      audio.play().catch((err) => console.log("Audio play blocked:", err));
      //  alert('Ride Confirm Otp')
      console.log("hello");
      console.log(data);
      setData(data);
    };

    socket.on("ride-completed", handleRideCompleted);
    socket.on("confirm-otp", handleConfirmOtp);

    // 🧹 Cleanup
    return () => {
      socket.off("ride-completed", handleRideCompleted);
    };
  }, [socket]);
  useEffect(() => {
    axios
      .post("https://thetest-h9x3.onrender.com/ride/get-ride-detail", {
        rideId: ride._id,
      })
      .then((response) => {
        console.log(response);
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  const ride = JSON.parse(localStorage.getItem("ride"));
  const calculateRoute = async () => {
    if (!window.google || !ride?.pickUp || !ride?.drop) return;

    const directionsService = new window.google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: {
          lat: ride.driverId.location.coordinates[1],
          lng: ride.driverId.location.coordinates[0],
        },
        destination: ride.pickUp.address,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDistance(result.routes[0].legs[0].distance.text); // "12.4 km"
      setTravelTime(result.routes[0].legs[0].duration.text);
      setDirectionResponse(result);
    } catch (err) {
      console.error("Route error:", err);
    }
  };

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
  useEffect(() => {
  if (isLoaded && ride) {
    calculateRoute();
  }
}, [isLoaded]);


// console.log(travelTime)

const formatTime = (totalSeconds) => {
    const hr = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;

    return { hr, min, sec };
};


  const { hr, min, sec } = formatTime(travelTime);
  return (
    <div className="mobile-ride-started-div">
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
              <span>{coins} Coins Available </span>
                 <p style={{ fontSize: '7px', fontWeight: '300', paddingTop: '1px' }}>
                          {coins > 25
                            ? `You can use Coin!`
                            : `Collect ${25 - coins} more coins to use`}
              </p>
            </div>
          </div>
          <div>
            <img src={bell} width={26} />
          </div>
        </div>
      </header>

      <div
        style={{
          padding: "10px 10px 20px 10px",
          // paddingBottom:'0px',
          background:'#0000E6',
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <div
          className="map-container3"
          style={{ height: "200px", borderRadius: "10px", overflow: "hidden" }}
        >
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "200px" }}
            center={{
              lat: ride.driverId.location.coordinates[1],
              lng: ride.driverId.location.coordinates[0],
            }}
            zoom={10}
            //    options={{ styles: darkMapStyle }}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            {/* <Marker
                                                        position={{
                                                        lat: ride.driverId.location.coordinates[1],
                                                        lng: ride.driverId.location.coordinates[0],
                                                        }}
                                                    /> */}
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
        {/* Trip Container Start */}
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
        {/* Trip Container End Here */}

        {/* Vehicle div Starts*/}
                 <div className="fare-container2" >
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
                            {distance} in{" "}
                            <div>({travelTime})</div>
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
                
               {
                prohibitedItems ? 
                  <div className="prohibited-items">
                    {prohibitedItemsData.map((items) => (
                      <div className="prohibited-item-name">• {items}</div>
                    ))}
                  </div>:<></>
               }

                {/* End Of Phibited Item Div */}

     

        <div
          className="info-container3"
          style={{ zIndex: "7", boxShadow: "2px 2px 5px gray" }}
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

          {/* Time Container Div Start */}
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

                {/* Time Container Div End */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            background: "white",
            justifyContent: "space-between",
            zIndex: "5",
            gap: "10px",
            alignItems: "center",
            borderRadius: "10px",
            boxShadow: "2px 2px 5px gray",
            padding: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img src={profile} alt="" width={50} />

            <div>
              <div style={{ fontSize: "16px", fontWeight: "700" }}>
                {ride.driverId.name}
              </div>
              <div style={{ fontSize: "12px", color: "gray" }}>{ride.driverId.phone}</div>
            </div>
          </div>

            
          <div>
            <FontAwesomeIcon icon={faPhone} style={{ color: "#0000E6" }} />
          </div>
          
          
        </div>


        {/* Cash Container */}

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
      <div style={{width:'100%',height:'50px',background:'#0000E6'}}></div>
      <Footer/>
    </div>
  );
}

export default MobileRideStarted;
