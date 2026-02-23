import React, { useContext, useEffect, useRef, useState } from "react";
import "./DilivaryLocation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/Logo.png";
import {
  faArrowLeft,
  faMicrophone,
  faPlus,
  faLocationCrosshairs,
  faHeart,
  faClockRotateLeft,
  faUser,
  faChevronRight,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { faLocationDot, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../../../context/Socketcontext.jsx";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";
import { GoogleMap, Marker } from "@react-google-maps/api";

import MiniAuto from "../../../assets/blue-miniAuto.png";
import Eloader from "../../../assets/blue-eloader.png";
import ThreeWheeler from "../../../assets/3wheeler.png";
import MiniTruck from "../../../assets/blue-minitruck.png";
import coin from "../../../assets/coin.png";
import bell from "../../../assets/Bell.png";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { RideContext } from "../../../context/RideContext.jsx";
import driverRegistration2 from "../../../assets/driverRegistration2.png";
import driverRegistration from "../../../assets/driverRegistration.png";
import drop2 from "../../../assets/drop2.png";
import dropHome from "../../../assets/receiver-red.png";
import redProfile from "../../../assets/red-profile.png";
import dropPhone from "../../../assets/mobile-red.png";
import location from "../../../assets/Location.png";
import sender from "../../../assets/sender.png";
import weight2 from "../../../assets/weight2.png";
import TwoWheeler from "../../../assets/blue-scooter.png";
import { DirectionsRenderer } from "@react-google-maps/api";
import location2 from "../../../assets/location2.png";
import Footer from "../../Components/Footer/Footer.jsx";
import { useLocation } from 'react-router-dom'
import wheeler from '../../../assets/blue3wheeler.png'



export default function DeliveryLocation() {
  const { isLoaded } = useGoogleMaps();
  const again = useLocation();

  const [ride, setRide] = useState([]);
  const [pickup, setPickup] = useState({
    name: "",
    address: "",
    coords: { lat: "", lng: "" },
  });
  const [pickupQuery, setPickupQuery] = useState();
  const [drop, setDrop] = useState({
    name: "",
    address: "",
    coords: { lat: "", lng: "" },
  });
  const [dropQuery, setDropQuery] = useState();
  const [activeInput, setActiveInput] = useState(null);
  const [pickupPredictions, setPickupPredictions] = useState([]);
  const [dropPredictions, setDropPredictions] = useState([]);
  const [getEstimate, setGetEstimate] = useState(false);
  const [pickupLocation, setPickupLocation] = useState([]);
  
  const [active, setActive] = useState();
  const { socket, sendMessage } = useContext(SocketContext);
  const { previousRides, vehicle, setVehicle ,fare,setFare} = useContext(RideContext);
  const [finalDetail, setFinalDetail] = useState(false);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [checkfare, setChaeckFare] = useState();
  const [prohibitedItems, setProhibitedItems] = useState(false);
  const distinctPickups = [
  ...new Map(
    previousRides.map(ride => [
      ride.pickUp.name + ride.pickUp.address, // unique key
      ride.pickUp
    ])
  ).values()
];
const distinctDrops = [
  ...new Map(
    previousRides.map(ride => [
      ride.drop.name + ride.drop.address, // unique key
      ride.drop
    ])
  ).values()
];
console.log(vehicle)

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

  // const [show,setShow]=useState()
 
  const [dropDetail, setDropDetail] = useState({
    landmark: "",
    receiver_name: "",
    receiver_phone: "",
    productType: "",
  });

  const pickupInputRef = useRef(null);
  const dropInputRef = useRef(null);

  useEffect(() => {
  if (again.state) {
    setPickup(again.state.pickUp || '');
    setDrop(again.state.drop || '');
    setDropDetail({...dropDetail,receiver_name:again.state.receiver_name,receiver_phone:again.state.receiver_phone,productType:again.state.productType,landmark:again.state.landmark})
    setVehicle(again.state.vehcile)
    setGetEstimate(true);
    console.log(again);
  }
}, [location.state]);

  useEffect(() => {
    setActive(vehicle);
  }, [vehicle]);

  useEffect(() => {
    if (!pickup?.address) return;

    axios
      .get("https://thetest-h9x3.onrender.com/maps/getLocation", {
        params: { address: pickup.address },
      })
      .then((res) => {
        setPickupCoords(res.data.message);
      })
      .catch(console.error);
  }, [pickup.address]);

  useEffect(() => {
    if (!drop?.address) return;

    axios
      .get("https://thetest-h9x3.onrender.com/maps/getLocation", {
        params: { address: drop.address },
      })
      .then((res) => {
        setDropCoords(res.data.message);
      })
      .catch(console.error);
  }, [drop.address]);

  const name = localStorage.getItem("name");
  const phone = localStorage.getItem("phone");
  const navigate = useNavigate();

  // ✅ DEFINE IT HERE (IMPORTANT)
  const vehicleImages = {
    bike: { img: TwoWheeler, name: "2 Wheeler" },
    miniAuto: { img: MiniAuto, name: "Mini Auto" },
    ELoader: { img: Eloader, name: "E Loader" },
    Wheeler: { img: wheeler, name: "3 Wheeler" },
    miniTruck: { img: MiniTruck, name: "Mini Truck" },
  };
 

  //Fetching Previous Rides

  //  useEffect(()=>{
  //   axios.post('https://thetest-h9x3.onrender.com/ride/get-ride/userId/',{
  //     phone:phone
  //   }).then((response)=>{
  //     console.log(response.data.data)
  //     setPreviousRides(response.data.data)

  //   }).catch((error)=>console.log(error))
  //  },[])

  //Creating New Ride

  useEffect(() => {
    if (!pickupCoords || !dropCoords) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: pickupCoords,
        destination: dropCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          const shortestRoute = result.routes.reduce((prev, curr) =>
            curr.legs[0].distance.value < prev.legs[0].distance.value
              ? curr
              : prev,
          );
          setDirections({ ...result, routes: [shortestRoute] });
          // console.log(result)
          setDistance(shortestRoute.legs[0].distance.text);
          console.log(shortestRoute.legs[0].distance.text); // distance
        } else {
          console.error("Directions error:", status);
        }
      },
    );
  }, [pickupCoords, dropCoords]);

  const handleRide = async () => {
   
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("pickupName", pickup.name);
    formData.append("pickupAddress", pickup.address);
    formData.append("dropName", drop.name);
    formData.append("dropAddress", drop.address);
    formData.append("userPhone", phone);
    formData.append("receiver_name", dropDetail.receiver_name);
    formData.append("receiver_phone", dropDetail.receiver_phone);
    formData.append('productType',dropDetail.productType)
    formData.append("landmark", dropDetail.landmark);
    formData.append("productType", dropDetail.productType);
    formData.append("fare", activeVehicle.fare);
    formData.append("vehcile", activeVehicle.vehicleType);
    formData.append("distance",distance)
    
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axios.post(
      "https://thetest-h9x3.onrender.com/ride/createRide",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.success) {
      // alert('New Ride Registered Successfully')
      localStorage.setItem("ride", JSON.stringify(response.data.data));
      console.log(response.data.data);
      sendMessage("joinOrder", {
        orderId: response.data.data._id,
        userId: response.data.data.userId,
      });

      navigate("/search/ride");
    } else {
      console.log(response.error);
    }
  };

  const handleChange = (state) => {
    setGetEstimate(false);

    if (state === "pickup") {
      setPickup((prev) => ({ ...prev, name: "", address: "" }));
      setActiveInput("pickup"); // ✅ focus pickup input
    } else if (state === "drop") {
      setDrop((prev) => ({ ...prev, name: "", address: "" }));
      setActiveInput("drop");
      // ✅ focus drop input
    }

    navigate("/ride");
  };

  useEffect(() => {
    if (activeInput === "pickup") {
      pickupInputRef.current?.focus();
    }
    if (activeInput === "drop") {
      dropInputRef.current?.focus();
    }
  }, [activeInput]);

  const handleCheckfare = () => {
    if (!checkfare) return;
    if(dropDetail.receiver_phone.length<10||dropDetail.receiver_phone.length>10)
    {
      alert('Please Enter Valid Phone Number')
      return
    }
    if (
      !dropDetail.landmark ||
      !dropDetail.receiver_name ||
      !dropDetail.receiver_phone
    ) {
      alert("All Field are Required");
      return;
    }
    setGetEstimate(true);
    //  setActive(vehicle)
    console.log(vehicle);
  };
  useEffect(() => {
    if (!getEstimate) return;
    if (!pickup?.address || !drop?.address) return;

    console.log("Pickup:", pickup.address);
    console.log("Drop:", drop.address);

    axios
      .get("https://thetest-h9x3.onrender.com/maps/get-fare-estimate-all", {
        params: {
          pickup: pickup.address,
          drop: drop.address,
        },
      })
      .then((response) => {
        console.log("Fare estimate:", response.data);
        setFare(response.data.data);
      })
      .catch((error) => {
        console.error("Fare error:", error.response || error);
      });
  }, [getEstimate]);

  useEffect(() => {
    let query = "";
    let setter = null;

    if (activeInput === "pickup") {
      query = pickupQuery;
      setter = setPickupPredictions;
    }

    if (activeInput === "drop") {
      query = dropQuery;
      setter = setDropPredictions;
    }

    if (!query) return;

    axios
      .get("https://thetest-h9x3.onrender.com/maps/getSuggestion", {
        params: { input: query },
      })
      .then((res) => {
        setter(res.data.results || []);
        console.log(res.data.results);
      })
      .catch(console.error);
  }, [pickupQuery, dropQuery, activeInput]);

  useEffect(() => {
    console.log("chek cehek");
    if (
      !dropDetail.landmark ||
      !dropDetail.receiver_name ||
      !dropDetail.receiver_phone ||
      !dropDetail.productType
    ) {
      setChaeckFare(false);
    } else {
      setChaeckFare(true);
    }
  }, [
    dropDetail.landmark,
    dropDetail.receiver_name,
    dropDetail.receiver_phone,
    dropDetail.productType,
  ]);

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  const activeVehicle = fare.find((item) => item.vehicleType === vehicle);
  return (
    <div className="delivery-screen">
      {/* Header with Back Button */}

      {getEstimate ? (
        <>
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

          {finalDetail ? (
            <>
              <div className="container" style={{ gap: "5px" }}>
                <div className="map-container2" style={{ height: "200px" }}>
                  <div
                    className="map-container-fixed"
                    style={{ height: "100%" }}
                  >
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={pickupCoords}
                      zoom={14}
                      options={{ disableDefaultUI: true }}
                    >
                      {pickupCoords && (
                        <Marker
                          position={pickupCoords}
                          icon={{
                            url: location2,
                            scaledSize: new window.google.maps.Size(30, 40),
                          }}
                        />
                      )}
                      {dropCoords && <Marker position={dropCoords} />}

                      {directions && (
                        <DirectionsRenderer
                          directions={directions}
                          options={{
                            suppressMarkers: true, // we already add markers
                            polylineOptions: {
                              strokeColor: "#0000E6",
                              strokeWeight: 5,
                            },
                          }}
                        />
                      )}
                    </GoogleMap>
                    <button
                      className="back-btn-overlay"
                      onClick={() => setFinalDetail(false)}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                  </div>
                </div>
                {/* MAp Container End */}
                <div className="fare-container2">
                  {activeVehicle && (
                    <div
                      className="vehicle"
                      key={activeVehicle.vehicleType} // unique key
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
                          <p style={{ color: "white", fontSize: "10px" }}>
                            {activeVehicle.weight}
                          </p>
                          <img src={weight2} alt="" width={30} />
                        </div>
                        <div>
                          <img
                            src={vehicleImages[activeVehicle.vehicleType].img}
                            alt=""
                            width={
                              activeVehicle.vehicleType === "miniTruck"
                                ? 65
                                : 60
                            }
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
                        <div style={{ fontSize: "30px" }}>
                          ₹{activeVehicle.fare}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Selected Caontainer End Here */}
                <div className="input-div" style={{ padding: "9px 20px" }}>
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
                      {dropDetail.productType}
                    </div>
                  </div>
                </div>
                <div className="input-div" style={{ padding: "5px 20px" }}>
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

                {/* End of Info Container */}

                {prohibitedItems ? (
                  <div className="prohibited-items">
                    {prohibitedItemsData.map((items) => (
                      <div className="prohibited-item-name">• {items}</div>
                    ))}
                  </div>
                ) : (
                  <>
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
                              {pickup.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "gray" }}>
                              {" "}
                              {pickup.address}
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
                              {dropDetail.receiver_name}
                            </div>
                            <div
                              style={{ fontSize: "12px", fontWeight: "600" }}
                            >
                              {drop.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "gray" }}>
                              {" "}
                              {drop.address}
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
                      <div className="check-fare-btn" onClick={handleRide}>
                        Book Ride
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="container" style={{ gap: "5px" }}>
                <div className="map-container2" style={{ height: "200px" }}>
                  <div
                    className="map-container-fixed"
                    style={{ height: "100%" }}
                  >
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={pickupCoords}
                      zoom={14}
                      options={{ disableDefaultUI: true }}
                    >
                      {pickupCoords && (
                        <Marker
                          position={pickupCoords}
                          icon={{
                            url: location2,
                            scaledSize: new window.google.maps.Size(30, 40),
                          }}
                        />
                      )}
                      {dropCoords && <Marker position={dropCoords} />}

                      {directions && (
                        <DirectionsRenderer
                          directions={directions}
                          options={{
                            suppressMarkers: true, // we already add markers
                            polylineOptions: {
                              strokeColor: "#0000E6",
                              strokeWeight: 5,
                            },
                          }}
                        />
                      )}
                    </GoogleMap>
                    <button
                      className="back-btn-overlay"
                      onClick={() => {
                        setGetEstimate(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                  </div>
                </div>

                <div className="fare-container2">
                  {activeVehicle && (
                    <div
                      className="vehicle"
                      key={activeVehicle.vehicleType} // unique key
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
                          <p style={{ color: "white", fontSize: "10px" ,textAlign:'center'}}>
                            {activeVehicle.weight}Kg
                          </p>
                          <img src={weight2} alt="" width={30} />
                        </div>
                        <div>
                          <img
                            src={vehicleImages[activeVehicle.vehicleType].img}
                            alt=""
                            width={
                              activeVehicle.vehicleType === "miniTruck"
                                ? 65
                                : 60
                            }
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
                          <div style={{ fontSize: "12px", fontWeight: "500" }}>
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
                        <div style={{ fontSize: "30px" }}>
                          ₹{activeVehicle.fare}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="input-div" style={{ padding: "10px 15px" }}>
                  <div className="select-container-div">
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        marginLeft: "5px",
                      }}
                    >
                      Product Type -
                    </div>
                    <div style={{ fontWeight: "500" ,fontSize:'14px'}}>
                       &nbsp;{dropDetail.productType}
                    </div>
                  </div>

                  <div className="btn-container3" style={{ marginTop: "0px" }}>
                    <button
                      style={{ marginTop: "0px" }}
                      onClick={() => setGetEstimate(false)}
                    >
                      Change
                    </button>
                  </div>
                </div>
                 <div className="input-div" style={{ padding: "10px 15px" }}>
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
                prohibitedItems?(
                      <div className="prohibited-items">
                    {prohibitedItemsData.map((items) => (
                      <div className="prohibited-item-name">• {items}</div>
                    ))}
                  </div>
                ):
                  <></>
                
               }
                

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
                        <div style={{ fontSize: "12px", fontWeight: "600" }}>
                          <span style={{ color: "gray" }}>
                            Sender's Name -{" "}
                          </span>
                          {name}
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: "600" }}>
                          {pickup.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "gray" }}>
                          {" "}
                          {pickup.address.length > 35
                            ? pickup.address.slice(0, 35) + "..."
                            : pickup.address}
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
                        <div style={{ fontSize: "12px", fontWeight: "600" }}>
                          {" "}
                          <span style={{ color: "gray" }}>
                            Receiver's Name -{" "}
                          </span>
                          {dropDetail.receiver_name}
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: "600" }}>
                          {drop.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "gray" }}>
                          {" "}
                          {drop.address.length > 70
                            ? drop.address.slice(0, 70) + "..."
                            : drop.address}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <div className="btn-container3">
                    <div>
                      <button onClick={() => handleChange("pickup")}>
                        Change
                      </button>
                    </div>
                    <div>
                      <button onClick={() => handleChange("drop")}>
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                <div className="fare-container2" style={{maxHeight:'300px'}}>
                  {fare.map((item) => {
                    if (vehicle == item.vehicleType) return null;
                    return (
                      <div
                        className="vehicle"
                        onClick={() => {
                          setActive(item);
                          console.log(active);
                          setVehicle(item.vehicleType);
                        }}
                        style={{ padding: "5px" }}
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
                              maxWidth:'50px'
                            }}
                          >
                            <p style={{ color: "white", fontSize: "10px" ,textAlign:'center',padding:'2px'}}>
                              {item.weight}kg
                            </p>
                            <img src={weight2} alt="" width={30} />
                          </div>
                          <div>
                            <img
                              src={vehicleImages[item.vehicleType].img}
                              alt=""
                              style={{ width: "60px", height: "60px" }}
                            />
                            {/* <div style={{width:'60px',height:'60px'}}></div> */}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              color: "gray",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{ fontWeight: "600", fontSize: "14px" }}
                            >
                              {vehicleImages[item.vehicleType].name}
                            </div>
                            <div
                              style={{ fontSize: "12px", fontWeight: "500" }}
                            >
                              {item.distance}Km in <div>({item.time} mins)</div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            color: "gray",
                            fontWeight: "700",
                            padding: "16px",
                            justifyContent: "center",
                            alignItems: "start",
                            lineHeight: "22px",
                            marginTop: "-2px",
                            width: "100px",
                            paddingRight:'5px'
                          }}
                          id="green-div"
                        >
                          <div style={{ fontSize: "14px" }}>Fare</div>
                          <div style={{ fontSize: "28px" }}>₹{item.fare}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="check-fare-btn"
                  style={{ fontWeight: "600" }}
                  onClick={() => setFinalDetail(true)}
                >
                  Continue with {vehicleImages[vehicle].name}
                </div>
              </div>
            </>
          )}
        </>
      ) : pickup.name && drop.name ? (
        <>
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

          <div className="container">
            <div className="map-container2" style={{ height: "200px" }}>
              <div className="map-container-fixed" style={{ height: "100%" }}>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={dropCoords}
                  zoom={15}
                  options={{ disableDefaultUI: true }}
                >
                  {dropCoords && <Marker position={dropCoords} />}
                </GoogleMap>
                <button
                  className="back-btn-overlay"
                  onClick={() => setDrop("")}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>
            </div>
            <div className="info-container2">
              <div className="drop-div">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "",
                    gap: "10px",
                  }}
                >
                  <img src={drop2} alt="" className="drop-image" />
                  <div className="drop-div-info">
                    <div className="drop-div-info-1">Drop Location</div>
                    <div style={{ fontWeight: "700", fontSize: "13px" }}>
                      {drop.name}
                    </div>
                    <div style={{ fontSize: "12px", paddingRight: "20px" }}>
                      {drop.address.length > 50
                        ? drop.address.slice(0, 50) + "..."
                        : drop.address}
                    </div>
                  </div>
                </div>
                <div className="change-btn-conatiner">
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "blue",
                      textAlign: "center",
                      marginTop: "10px",
                    }}
                  >
                    {distance}
                  </p>
                  <button onClick={() => setDrop("")}>Change</button>
                </div>
              </div>
              <div className="input-div">
                <img
                  src={dropHome}
                  alt=""
                  width={18}
                  style={{ margin: "8px 15px" }}
                />
                <input
                  type="text"
                  placeholder="Enter House / Appartment / Landmark"
                  onChange={(e) =>
                    setDropDetail({ ...dropDetail, landmark: e.target.value })
                  }
                  value={dropDetail.landmark}
                />
              </div>
              <div className="input-div">
                <img
                  src={redProfile}
                  alt=""
                  width={18}
                  style={{ margin: "8px 15px" }}
                />
                <input
                  type="text"
                  placeholder="Enter Receiver's Name"
                  onChange={(e) =>
                    setDropDetail({
                      ...dropDetail,
                      receiver_name: e.target.value,
                    })
                  }
                  value={dropDetail.receiver_name}
                />
              </div>
              {/* Drop Div Started LandMark Screen */}
              <div className="input-div">
                <img
                  src={dropPhone}
                  alt=""
                  width={18}
                  style={{ margin: "8px 15px" }}
                />
                <input
                  type="text"
                  placeholder="Enter Receiver's Mobile Number"
                  onChange={(e) =>
                    setDropDetail({
                      ...dropDetail,
                      receiver_phone: e.target.value,
                    })
                  }
                  value={dropDetail.receiver_phone}
                />
              </div>
              <div className="input-div">
                <img
                  src={sender}
                  alt=""
                  width={18}
                  style={{ margin: "8px 15px" }}
                />
                <input
                  type="text"
                  placeholder="Sender's Mobile Number "
                  value={phone + " ( Sender's Phone Number )"}
                  style={{ color: "#cbcbcb" }}
                  readOnly="true"
                />
              </div>
       
              <div className="input-div" style={{ padding: "5px 15px" }}>
                <select
                  name=""
                  id=""
                  style={{
                    width: "100%",
                    padding: "10px",
                    color: "#000000",
                    display: "block", // Ensures it takes up the full width of the container
                    margin: "0 auto", // Centers the element if the parent is wider
                    boxSizing: "border-box", // Prevents padding from pushing the box outside its bounds
                    
                  }}
                  value={dropDetail.productType}
                  onChange={(e) =>
                    setDropDetail({
                      ...dropDetail,
                      productType: e.target.value,
                    })
                  }
                >
                  <option value="">Select Product Type</option>
                  <option value="wood">Wood</option>
                  <option value="metal">Metal</option>
                  <option value="paper">Paper</option>
                  <option value="plastic">Plastic</option>
                </select>
              </div>
                     {/* Prohibited Div Landmark Screen */}
               <div className="input-div" style={{ padding: "10px 20px" }}>
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
            </div>
               {prohibitedItems ? (
                  <div className="prohibited-items">
                    {prohibitedItemsData.map((items) => (
                      <div className="prohibited-item-name">• {items}</div>
                    ))}
                  </div>
                ) :  (<div
              className="check-fare-btn"
              style={checkfare ? { opacity: "100%" } : { opacity: "50%" }}
              onClick={handleCheckfare}
            >
              Check Fare
            </div>)   }      
            
          </div>
        </>
      ) : (
        <>
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

          {/* Floating Input Card */}
          <div
            className="input-card"
            style={{ marginTop: "-40px", borderRadius: "12px" }}
          >
            <div className="location-flow">
              <div className="dots-container">
                <div className="dot green"></div>
                <div className="dashed-line"></div>
                <div className="dot red"></div>
              </div>

              <div className="inputs-container">
                {pickup.name ? (
                  <div className="pickup-display">
                    <div className="info">
                      <strong>
                        {" "}
                        {pickup.name.length > 30
                          ? pickup.name.slice(0, 30) + "..."
                          : pickup.name}
                      </strong>
                      <p>
                        {pickup.address.length > 50
                          ? pickup.address.slice(0, 50) + "..."
                          : pickup.address}
                      </p>
                    </div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      onClick={() => setPickup({ name: "", address: "" })}
                      className="arrow-small"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter Your Pick Up Location"
                    className="drop-input"
                    onChange={(e) => setPickupQuery(e.target.value)}
                    value={pickupQuery}
                    onFocus={() => {
                      setActiveInput("pickup");
                      console.log(previousRides);
                    }}
                  />
                )}

                {drop.name ? (
                  <div className="pickup-display">
                    <div className="info">
                      <strong>
                        {drop.name.length > 30
                          ? drop.name.slice(0, 30) + "..."
                          : drop.name}
                      </strong>
                      <p>
                        {drop.address.length > 50
                          ? drop.address.slice(0, 50) + "..."
                          : drop.address}
                      </p>
                    </div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      onClick={() => setDrop({ name: "", address: "" })}
                      className="arrow-small"
                    />
                  </div>
                ) : (
                  <div className="drop-input-wrapper">
                    <input
                      type="text"
                      placeholder="Where is your Drop?"
                      className="drop-input"
                      onFocus={() => setActiveInput("drop")}
                      onChange={(e) => setDropQuery(e.target.value)}
                    />
                    {/* <FontAwesomeIcon icon={faMicrophone} className="mic-icon" /> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs2" style={{ borderRadius: "10px" }}>
            {/* <div className="tab active">
          <FontAwesomeIcon icon={faLocationCrosshairs} /> Select on map
        </div> */}
            {/* <div className="tab-divider"></div> */}
            <div className="tab2" style={{ padding: "10px" }}>
              <FontAwesomeIcon icon={faHeart} /> Saved Addresses
            </div>
          </div>

          {/* History List */}
          <div className="history-list">
            {activeInput &&
              activeInput === "pickup" &&
              (pickupPredictions.length > 0
                ? pickupPredictions
                    .map((item, index) => (
                      <div
                        key={index}
                        className="history-item"
                        style={{ zIndex: "2" }}
                        onClick={() => {
                          setPickup({
                            name: item.name,
                            address: item.formatted_address,
                          });
                          setPickupLocation(item.geometry.location);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="time-icon"
                        />
                        <div className="item-details">
                          <div className="item-header">
                            <span className="location-name">{item.name}</span>
                            <div className="user-tag">
                              <div>
                                <FontAwesomeIcon icon={faUser} size="xs" />
                              </div>{" "}
                              <div>{item.user}</div>
                            </div>
                          </div>
                          <p className="location-address">
                            {item.formatted_address}
                          </p>
                        </div>
                        {/* <div className="save-action">
                          <FontAwesomeIcon
                            icon={faBookmark}
                            className="heart-icon"
                          />
                          <span>SAVE</span>
                        </div> */}
                      </div>
                    ))
                    .slice(0, 7)
                : distinctPickups.map((item, index) => (
                    <div
                      key={index}
                      className="history-item"
                      onClick={() => {
                        setPickup({
                          name: item.name,
                          address: item.address,
                        });
                        setDropPredictions([]);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faClock}
                        style={{ color: "gray", padding: "8px" }}
                        size="xl"
                      />
                      <div className="item-details">
                        <div className="item-header">
                          <span className="location-name">
                            {item.name}
                          </span>
                          <span className="user-tag">
                            <FontAwesomeIcon icon={faUser} size="xs" />{" "}
                            {/* {item.receiver_name} */}
                          </span>
                        </div>
                        <p className="location-address">
                          {item.address}
                        </p>
                      </div>
                      {/* <div className="save-action">
                        <FontAwesomeIcon
                          icon={faBookmark}
                          className="heart-icon"
                        />
                        <span>SAVE</span>
                      </div> */}
                    </div>
                  ))
              ).slice(0, 4)}
            {activeInput === "drop" &&
              (dropPredictions.length > 0
                ? dropPredictions.slice(0, 7).map((item, index) => (
                    <div
                      key={index}
                      className="history-item"
                      onClick={() => {
                        setDrop({
                          name: item.name,
                          address: item.formatted_address,
                        });
                        setDropPredictions([]); // ✅ NEVER null
                      }}
                      style={{ alignItems: "center" }}
                    >
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="time-icon"
                      />
                      <div className="item-details">
                        <div className="item-header">
                          <span className="location-name">{item.name}</span>
                        </div>
                        <p className="location-address">
                          {item.formatted_address}
                        </p>
                      </div>
                      {/* <div className="save-action">
                        <FontAwesomeIcon
                          icon={faBookmark}
                          className="heart-icon"
                        />
                        <span>SAVE</span>
                      </div> */}
                    </div>
                  ))
                : distinctDrops.slice(0, 8).map((item, index) => (
                    <div
                      key={index}
                      className="history-item"
                      onClick={() => {
                        setDrop({
                          name: item.name,
                          address: item.address,
                        });
                        setDropPredictions([]);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faClock}
                        style={{ color: "gray", padding: "8px" }}
                        size="xl"
                      />
                      <div className="item-details">
                        <div className="item-header">
                          <span className="location-name">
                            {item.name}
                          </span>
                          <span className="user-tag">
                            <FontAwesomeIcon icon={faUser} size="xs" />{" "}
                            {/* {item.receiver_name} */}
                          </span>
                        </div>
                        <p className="location-address">{item.address}</p>
                      </div>
                      {/* <div className="save-action">
                        <FontAwesomeIcon
                          icon={faBookmark}
                          className="heart-icon"
                        />
                        <span>SAVE</span>
                      </div> */}
                    </div>
                  )))}
          </div>
        </>
      )}

      <div
        style={{
          width: "100%",
          height: "100px",
          background: "#0000E6",
          border: "2px solid #0000E6",
        }}
      ></div>
    <Footer/>
    
    </div>
  );
}
