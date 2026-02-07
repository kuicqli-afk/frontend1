import React, { useState, useEffect, useContext } from "react";
import "./FareLink.css";
import axios from 'axios'
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import logo from '../../assets/Logo.png'
import TwoWheeler from "../../assets/2wheeler.png";
import MiniAuto from "../../assets/MiniAuto.png";
import Eloader from "../../assets/Eloader.png";
import ThreeWheeler from "../../assets/3wheeler.png";
import MiniTruck from "../../assets/Minitruck.png";
import Weight from "../../assets/weight.png";

import GreenCircle from "../../assets/greencircle.png";
import Drop from "../../assets/Drop.png";
import PhoneNumber from "../../assets/phonenumber.png";
import Username from "../../assets/username.png";
import { useNavigate, useLocation } from "react-router-dom";
import { SocketContext } from "../../context/Socketcontext";
import { RideContext } from "../../context/RideContext";

const FareLink = () => {

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [login,setLogin]=useState(false);
  const [fare, setFare] = useState();
  const [activeInput, setActiveInput] = useState(null);

  const [phoneType, setPhoneType] = useState("receiver");
  const [nameType, setNameType] = useState("receiver");

  const [showSummary, setShowSummary] = useState(false);

  const [pickupPredictions, setPickupPredictions] = useState([]);
  const [dropPredictions, setDropPredictions] = useState([]);

  const [showViewDetail, setShowViewDetail] = useState(false);

  const { setPendingRide,pendingRide, clearPendingRide } = useContext(RideContext);

  const navigate = useNavigate();

  const[error,setError]=useState(false)

  const {socket,sendMessage}=useContext(SocketContext)

  const isFormFilled =
    pickup.trim() &&
    drop.trim() &&
    phone.trim() &&
    name.trim();

  const vehicleData = {
    "2 Wheeler.": { img: TwoWheeler, weight: "18kg.", price: "140", name: "bike" },
    "Mini Auto.": { img: MiniAuto, weight: "45kg.", price: "180", name: "miniAuto" },
    "E Loader.": { img: Eloader, weight: "400kg.", price: "260", name: "ELoader" },
    "3 Wheeler.": { img: ThreeWheeler, weight: "550kg.", price: "350", name: "threeWheeler" },
    "Mini Truck.": { img: MiniTruck, weight: "720kg.", price: "520", name: "miniTruck" }
  };


  const tabs = Object.keys(vehicleData);
  const [activeTab, setActiveTab] = useState("2 Wheeler.");
  const selected = vehicleData[activeTab];
  const location = useLocation();

  useEffect(() => {
    // 🔹 Scroll page to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // 🔹 Auto select vehicle from Footer
    if (location.state?.vehicle) {
      const map = {
        "2-wheeler": "2 Wheeler.",
        "mini-auto": "Mini Auto.",
        "e-loader": "E Loader.",
        "3-wheeler": "3 Wheeler.",
        "mini-truck": "Mini Truck."
      };

      const tab = map[location.state.vehicle];
      if (tab) setActiveTab(tab);
    }
  }, [location.state]);

  useEffect(() => {
    let query = "";

    if (activeInput === "pickup") query = pickup;
    if (activeInput === "drop") query = drop;

    if (!query) return;

    axios.get('https://thetest-h9x3.onrender.com/maps/getSuggestion', {
      params: {
        input: query
      }
    })
      .then((response) => {
        console.log(response.data);
        setPredictions(response.data.results)
        console.log(predictions)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pickup, drop, activeInput]);

  //On Mouse Click Select The Predeiction

  const handleSelectPrediction = (item) => {
    if (activeInput === "pickup") {
      setPickup(item.formatted_address);
      setPickupPredictions([]);
    }

    if (activeInput === "drop") {
      setDrop(item.formatted_address);
      setDropPredictions([]);
    }

    setActiveInput(null);
  };

  const handleSubmit = async () => {

    const newPhone=phone.replace(/\D/g, "");
    if(newPhone.length!=10)
    {
        setError(true)
        return;
    }
     setShowSummary(true)
     setError(false)
     try{
         const response = await axios.get('https://thetest-h9x3.onrender.com/maps/get-fair-estimate', {
      params: {
        origin: pickup,
        destination: drop,
        vehicle: selected.name,
      }
    })

    
    if (response) {
      console.log(response.data)
      setFare(response.data.fare)

    }
     }catch(error)
     {
      alert(error.message)
     }
   




  }

  useEffect(() => {
  const userPhone = localStorage.getItem('phone');
  console.log(pendingRide)
  // Condition 1: Must have a user logged in
  // Condition 2: Must have a ride waiting in context
  if (userPhone && pendingRide) {
    
    // Logic to prevent double-calling
    const rideToBook = pendingRide;
    rideToBook.userPhone=userPhone;
    const finalizeRide = async () => {
      try {
        

      // Sending Request For Ride Registration

      const response = await axios.post(
        'https://thetest-h9x3.onrender.com/ride/createRide',
        rideToBook,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Tour Ride Registered Successfully')
        localStorage.setItem("ride", JSON.stringify(response.data.data))
        console.log(response.data.data)
        sendMessage("joinOrder",{orderId:response.data.data._id,userId:response.data.data.userId})
        // IMPORTANT: Clear context immediately after success 
        // to break the dependency loop
        clearPendingRide(); 
        navigate('/search/ride');
      }
        
      } catch (err) {
        console.error(err);
      }
    };

    finalizeRide();
  }
}, [pendingRide]); // This is the only dependency needed


  const handleRequestedRide = async () => {
    //Crete A From
    const userPhone = localStorage.getItem('phone')
    const newPhone=phone.replace(/\D/g, "");
    if(newPhone.length!=10)
    {
      alert('Enter 10 digit phone number')
      return;
    }
    if (!userPhone) {
      alert('Please Login')
      setPendingRide({
        name,
        phone,
        pickup,
        drop,
        fare,
        userPhone,
        vehcile: selected.name
      });
      navigate('/user-login')

      
    } else {

      const formdata = new FormData();
      formdata.append('name', name);
      formdata.append('phone', newPhone);
      formdata.append('pickup', pickup)
      formdata.append('drop', drop);
      formdata.append('userPhone', userPhone);
      formdata.append('fare', fare)
      formdata.append('vehcile', selected.name)


      for (const [key, value] of formdata.entries()) {
        console.log(key, value);
      }

      // Sending Request For Ride Registration

      const response = await axios.post(
        'https://thetest-h9x3.onrender.com/ride/createRide',
        formdata,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('New Ride Registered Successfully')
        localStorage.setItem("ride", JSON.stringify(response.data.data))
        console.log(response.data.data)
        sendMessage("joinOrder",{orderId:response.data.data._id,userId:response.data.data.userId})
        
        navigate('/search/ride')
      }
      else {
        console.log(response.error);
      }
    }

  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".fare-input-row")) {
        setActiveInput(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let query = "";
    let setter = null;

    if (activeInput === "pickup") {
      query = pickup;
      setter = setPickupPredictions;
    }

    if (activeInput === "drop") {
      query = drop;
      setter = setDropPredictions;
    }

    if (!query) return;

    axios
      .get("https://thetest-h9x3.onrender.com/maps/getSuggestion", {
        params: { input: query }
      })
      .then((res) => setter(res.data.results || []))
      .catch(console.error);
  }, [pickup, drop, activeInput]);

  return (
    <>
      <Navbar/>

{
  pendingRide&&<div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",width:"200vb",height:"100vh",background:"black",opacity:"50%",color:"white",fontWeight:"600",position:"absolute",top:0,left:0,zIndex:"1",textAlign:"center",verticalAlign:"middle"}}>
       <h1 style={{opacity:"100%"}}> Creating New Ride For You...</h1>
     </div>

}
     
      {/* Login PopUp */}

      {/* <div className="login-popup">
        <div>
          <img src={logo} alt="" style={{background:"blue",padding:"10px"}} width={200}/>
        </div>
        {login?
        <>
           <div style={{display:"flex",flexDirection:"column"}}>
          <label htmlFor="">
             Enter Your Phone Number
          </label>
          <input type="text" placeholder="Enter Your Phone Number" maxLength={10} />
        </div>
        <input type="submit" />
        <p>Don't have Account <span style={{color:"blue",cursor:"pointer"}} onClick={()=>setLogin(false)}>SignUp</span></p>
        </>
        
        :
        <>
         <div style={{display:"flex",flexDirection:"column"}}>
          <label htmlFor="">
             Enter Your Name
          </label>
          <input type="text" placeholder="Enter Your Name" />
        </div>
         <div style={{display:"flex",flexDirection:"column"}}>
          <label htmlFor="">
             Enter Your Phone
          </label>
          <input type="text" placeholder="Enter Your Phone" />
        </div>
        <input type="submit" />
        <p>Don't have Account <span style={{color:"blue",cursor:"pointer"}} onClick={()=>setLogin(true)}>LogIn</span></p>
        </>
        
        }
     
      </div> */}

      {/* End of Login PopUp */}


      <div className="fare-container">
     
        <div className="fare-body">

          {/* LEFT CARD */}
          <div className="fare-card" >

            <div className="fare-top">
              <img src={selected.img} alt="vehicle" />
            </div>

            {!showSummary && (
              <div className="fare-weight">
                <img src={Weight} alt="" />
                <p>{selected.weight}</p>
              </div>
            )}

            <div className="fare-detail">

              {showSummary && (
                <div className="address-box">
                  <p>Address Details</p>
                  <div className="address-item">
                    <span className="dot green"></span>
                    <div className="address-content">
                      <p className="label">Pickup Location</p>
                      <p className="value">{pickup}</p>
                    </div>
                  </div>

                  <div className="address-line"></div>

                  <div className="address-item">
                    <span className="dot red"></span>
                    <div className="address-content">
                      <p className="label">
                        Drop Location
                        <span className="name"> {name}</span>
                        <span className="mid-dot">•</span>
                        <span className="phone">{phone}</span>
                      </p>

                      <p className="value">{drop}</p>
                    </div>
                  </div>
                </div>

              )}

              <h3>{activeTab}</h3>

              {/* {!showSummary && <p>Starting from</p>} */}

              {/* <h4>{fare ? '₹' + fare + '/-' : '₹' + selected.price + '/-'}</h4> */}

              {showSummary && (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <p
                    id="price-edit"
                    onClick={() => {
                      setShowSummary(false);
                      setFare("");
                    }}
                  >
                    Edit.
                  </p>

                  <p
                    id="price-edit"
                    onClick={() => setShowViewDetail(true)}
                  >
                    View Detail.
                  </p>
                </div>
              )}


              {showViewDetail && (
                <div className="view-detail-overlay">
                  <div className="view-detail-modal">

                    {/* CLOSE */}
                    <span
                      className="view-detail-close"
                      onClick={() => setShowViewDetail(false)}
                    >
                      ✕
                    </span>


                    <div className="view-detail-body">

                      {/* LEFT */}
                      <div className="view-left">
                        <img src={selected.img} alt="vehicle" />
                        <h4>{activeTab}</h4>
                        <h2>₹{fare || selected.price}/-</h2>
                      </div>

                      <div className="view-divider"></div>

                      {/* RIGHT */}
                      <div className="view-right">
                        <h3>View Detail.</h3>
                        {/* Pickup */}
                        <div className="info-block">
                          <h5>Pickup Location</h5>
                          <p>
                            <img src={GreenCircle} alt="" />
                            <span className="text">{pickup}</span>
                          </p>
                        </div>

                        {/* Drop */}
                        <div className="info-block">
                          <h5>Drop Location</h5>
                          <p>
                            <img src={Drop} alt="" />
                            <span className="text">{drop}</span>
                          </p>
                        </div>

                        {/* Phone */}
                        <div className="info-block meta-row">
                          <p>
                            <img src={PhoneNumber} alt="" />
                            <span className="text">+91 {phone}</span>
                          </p>
                          <span className="meta-label receiver">Receiver</span>
                        </div>

                        {/* Name */}
                        <div className="info-block meta-row">
                          <p>
                            <img src={Username} alt="" />
                            <span className="text">{name}</span>
                          </p>
                          <span className="meta-label receiver">Receiver</span>
                        </div>

                        <button className="view-book-btn" onClick={handleRequestedRide}>
                          BOOK NOW
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="fare-divider"></div>

          {/* RIGHT SIDE */}
          <div className="fare-right">

            <div className="fare-tabs">
              {tabs.map((t, i) => (
                <p
                  key={i}
                  className={activeTab === t ? "active-tab" : ""}
                  onClick={() => setActiveTab(t)}
                >
                  {t.replace(".", "")}
                </p>
              ))}
            </div>

            {!showSummary ? (
              <>
                <div className="fare-input-row">
                  <img src={GreenCircle} alt="" />

                  <input
                    placeholder="Enter Pickup Location"
                    value={pickup}
                    onFocus={() => setActiveInput("pickup")}
                    onChange={(e) => setPickup(e.target.value)}
                  />

                  {activeInput === "pickup" && (
                    <div
                      className="prediction-box"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {pickupPredictions.map((item) => (
                        <div
                          key={item.place_id}
                          className="prediction"
                          onMouseDown={() => handleSelectPrediction(item)}
                        >
                          <p className="place">{item.name}</p>
                          <p className="address">{item.formatted_address}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DROP */}
                <div className="fare-input-row">
                  <img src={Drop} alt="" />

                  <input
                    placeholder="Enter Drop Location"
                    value={drop}
                    onFocus={() => setActiveInput("drop")}
                    onChange={(e) => setDrop(e.target.value)}
                  />

                  {activeInput === "drop" && (
                    <div
                      className="prediction-box"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {dropPredictions.map((item) => (
                        <div
                          key={item.place_id}
                          className="prediction"
                          onMouseDown={() => handleSelectPrediction(item)}
                        >
                          <p className="place">{item.name}</p>
                          <p className="address">{item.formatted_address}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                <div className="fare-input-extended" style={ error?{border:"1px solid red",color:'red'}:{}}>
                  <div className="fare-input-row no-bg">
                    <img src={PhoneNumber} alt="" />
                    <input
                      placeholder="Enter Receiver Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{width:"300px"}}
                    />
                  </div>
                  

                  {/* <div className="right-toggle">
                    <div
                      className={`radio ${phoneType === "receiver" ? "active" : ""}`}
                      onClick={() => setPhoneType("receiver")}
                    >
                      <span className="dot"></span> Receiver
                    </div>
                    <div
                      className={`radio ${phoneType === "sender" ? "active" : ""}`}
                      onClick={() => setPhoneType("sender")}
                    >
                      <span className="dot"></span> Sender
                    </div>
                  </div> */}

                </div>
                <span style={error?{fontSize:'12px',marginTop:'-10px',marginLeft:'20px',color:'red'}:{display:'none'}}>
                    Invalid Number
                  </span>

                <div className="fare-input-extended"  >
                  <div className="fare-input-row no-bg"   >
                    <img src={Username} alt="" />
                    <input
                      placeholder="Enter Receiver Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    
                    />
                  </div>

                  {/* <div className="right-toggle">
                    <div
                      className={`radio ${nameType === "receiver" ? "active" : ""}`}
                      onClick={() => setNameType("receiver")}
                    >
                      <span className="dot"></span> Receiver
                    </div>
                    <div
                      className={`radio ${nameType === "sender" ? "active" : ""}`}
                      onClick={() => setNameType("sender")}
                    >
                      <span className="dot"></span> Sender
                    </div>
                  </div> */}
                </div>

                <button
                  className={`fare-submit ${isFormFilled ? "active" : "inactive"}`}
                  disabled={!isFormFilled}
                  onClick={() => {handleSubmit() }}
                >
                  GET FARE ESTIMATE
                </button>
              </>
            ) : (
              /* ================= SUMMARY SCREEN ================= */
              <div className="fare-summary">

                <div className="summary-row">
                  <img src={GreenCircle} alt="" />
                  <input value={pickup} readOnly />
                </div>

                <div className="summary-row">
                  <img src={Drop} alt="" />
                  <input value={drop} readOnly />
                </div>

                <div className="summary-row split">
                  <div className="summary-left">
                    <img src={PhoneNumber} alt="" />
                    <input value={phone} readOnly />
                  </div>
                  <span className="tag">{phoneType}</span>
                </div>

                <div className="summary-row split">
                  <div className="summary-left">
                    <img src={Username} alt="" />
                    <input value={name} readOnly />
                  </div>
                  <span className="tag">{nameType}</span>
                </div>

                <button
                  className="fare-submit active"
                  onClick={() => handleRequestedRide()}
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div >

      <Footer />
    </>
  );
};

export default FareLink;
