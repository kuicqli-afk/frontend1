import React, { useContext, useEffect, useRef, useState } from "react";
import "./MobileRide.css";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";
import { SocketContext } from "../../../context/Socketcontext";
import bikeIcon from "../../../assets/bike-2.png";
import Popup from "../../Components/Popup/Popup.jsx";
import SuccessPopUp from "../../Components/SuccessPopUp/SuccessPopUp.jsx";
import Driver from "../../../assets/driver2.jpg";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/Logo.png";
import coin from "../../../assets/coin.png";
import bell from "../../../assets/Bell.png";
import drop2 from "../../../assets/drop2.png";
import { MdWatchLater } from "react-icons/md";
import location from "../../../assets/Location.png";
import { AiOutlineInfo } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import { RideContext } from "../../../context/RideContext.jsx";
import MiniAuto from "../../../assets/blue-miniAuto.png";
import Eloader from "../../../assets/blue-eloader.png";
import ThreeWheeler from "../../../assets/3wheeler.png";
import MiniTruck from "../../../assets/blue-minitruck.png";
import weight2 from "../../../assets/weight2.png";
import TwoWheeler from "../../../assets/blue-scooter.png";

function MobileRide() {
  const [search, setSearch] = useState(true);
  const { isLoaded } = useGoogleMaps();
  const { socket } = useContext(SocketContext);
  const ride = JSON.parse(localStorage.getItem("ride"));
  const nearByDrivers = ride?.nearbyDrivers || [];
  const [dots, setDots] = useState("");
  const { vehicle,fare } = useContext(RideContext);
  const [prohibitedItems, setProhibitedItems] = useState(false);
  const navigate=useNavigate()
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
    }, 500); // add one dot every 500ms

    return () => clearInterval(interval);
  }, []);
  const vehicleImages = {
    bike: { img: TwoWheeler, name: "2 Wheeler" },
    miniAuto: { img: MiniAuto, name: "Mini Auto" },
    ELoader: { img: Eloader, name: "E Loader" },
    miniTruck: { img: MiniTruck, name: "Mini Truck" },
  };

  if (!isLoaded) return <div className="loading">Loading map…</div>;

  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = (ride) => {
      // alert(`Status: ${ride.status}\nDriver: ${ride.driverId.name}`);
      localStorage.setItem("ride", JSON.stringify(ride));
    };

    socket.on("ride-confirmed", handleRideConfirmed);

    return () => socket.off("ride-confirmed", handleRideConfirmed);
  }, [socket]);

  const phone = localStorage.getItem("phone");
  const name = localStorage.getItem("name");
     const handleCancel=()=>{
    navigate('/fare-link')
  }
 
    const activeVehicle = fare.find((item) => item.vehicleType === vehicle);
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
        <div
          className="map-container3"
          style={{ height: "200px", borderRadius: "10px", overflow: "hidden" }}
        >
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={ride.pickupCoordinates}
            zoom={10}
            options={{ disableDefaultUI: true, zoomControl: true }}
          >
            <Marker position={ride.pickupCoordinates} />
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
        </div>

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
        {/* Product Type Div Start */}
        <div
          className="time-container"
          style={{ color: "#0000E6", fontSize: "14px", fontWeight: "500" ,padding:'9px 10px'}}
        >
          Searching for Kuicqli Heroes near by{dots}
        </div>
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
                
        <div className="searchbar-container">
          <div className="progress-bar2"></div>
        </div>

        {/* End Of Progress Bar */}

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
                    {vehicleImages[activeVehicle.vehicleType].name}
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: "500" }}>
                    {activeVehicle.distance}Km in{" "}
                    <div>({activeVehicle.time} mins)</div>
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
                <div style={{ fontSize: "30px" }}>₹{activeVehicle.fare}</div>
              </div>
            </div>
          )}
        </div>

        
              <div className="info-container3">
                                 <div className="div-info-container">
                                   <div className="location-icon-container">
                                     <img src={location} alt="" width={16} />
                                     <div
                                       style={{
                                         height: "40px",
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
                                       <div
                                         style={{ fontSize: "12px", fontWeight: "600" }}
                                       >
                                         <span style={{ color: "gray" }}>
                                           Sender's Name -{" "}
                                         </span>
                                         {name}
                                       </div>
                                       <div
                                         style={{ fontSize: "12px", fontWeight: "600" }}
                                       >
                                         {ride.pickUp.name}
                                       </div>
                                       <div style={{ fontSize: "12px", color: "gray" }}>
                                         {" "}
                                         {ride.pickUp.address}
                                       </div>
                                     </div>
                                     <div className="pick-up-div">
                                       <div
                                         style={{
                                           color: "red",
                                           fontSize: "14px",
                                           fontWeight: "600",
                                         }}
                                       >
                                         Drop Location
                                       </div>
                                       <div
                                         style={{ fontSize: "12px", fontWeight: "600" }}
                                       >
                                         {" "}
                                         <span style={{ color: "gray" }}>
                                           Receiver's Name -{" "}
                                         </span>
                                         {ride.receiver_name}
                                       </div>
                                       <div
                                         style={{ fontSize: "12px", fontWeight: "600" }}
                                       >
                                         {ride.drop.name}
                                       </div>
                                       <div style={{ fontSize: "12px", color: "gray" }}>
                                         {" "}
                                         {ride.drop.address}
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                                 <div></div>
                                 {/* <div className="btn-container3">
           
           
                                       <div><button onClick={()=>handleChange('pickup')}>Change</button></div>
                                       <div>
                                           <button
                                             onClick={() => handleChange('drop')}
                                           >
                                             Change
                                           </button>
                                         </div>
                                      
                                      
                                 </div> */}
                               </div>

                               <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                        justifyContent: "end",
                      }}
                    >
                      <div className="check-fare-btn" onClick={handleCancel}>
                        Cancel Ride
                      </div>
                    </div>
          
      </div>
      {/* <div className="design" style={{position:'absolute',bottom:'0px',height:'180px',width:'100%'}}></div> */}
       

    </div>
  );
}

export default MobileRide;
