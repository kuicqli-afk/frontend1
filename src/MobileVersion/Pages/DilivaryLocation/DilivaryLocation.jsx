import React, { useContext, useEffect, useState } from "react";
import "./DilivaryLocation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/Logo.png";
import { 
  faArrowLeft, faMicrophone, faPlus, faLocationCrosshairs, 
  faHeart, faClockRotateLeft, faUser, faChevronRight ,faBell
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { faLocationDot ,faBookmark, } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "../../../context/Socketcontext.jsx";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";
import { GoogleMap, Marker } from "@react-google-maps/api";
import TwoWheeler from "../../../assets/2wheeler.png";
import MiniAuto from "../../../assets/MiniAuto.png";
import Eloader from "../../../assets/Eloader.png";
import ThreeWheeler from "../../../assets/3wheeler.png";
import MiniTruck from "../../../assets/Minitruck.png";
    import coin from '../../../assets/coin.png';
import bell from '../../../assets/Bell.png'
import { faClock } from "@fortawesome/free-solid-svg-icons";




export default function DeliveryLocation(){
    const { isLoaded } = useGoogleMaps();
    const [ride,setRide]=useState([])
    const [pickup, setPickup] = useState({
      name:'',
      address:''
    });
    const [pickupQuery,setPickupQuery]=useState()
    const [drop, setDrop] = useState("");
    const [dropQuery,setDropQuery]=useState()
    const [activeInput, setActiveInput] = useState(null);
    const [pickupPredictions, setPickupPredictions] = useState([]);
    const [dropPredictions, setDropPredictions] = useState([]);
    const [getEstimate,setGetEstimate]=useState(false)
    const [pickupLocation,setPickupLocation]=useState([])
    const [fare,setFare]=useState([])
    const [active,setActive]=useState()
    const {socket,sendMessage}=useContext(SocketContext)
    const [previousRides,setPreviousRides]=useState();


  
  const name=localStorage.getItem('name')
  const phone=localStorage.getItem('phone')
  const navigate =useNavigate()


  // ✅ DEFINE IT HERE (IMPORTANT)
  const vehicleImages = {
    bike: {img:TwoWheeler,name:'Bike'},
    miniAuto: {img:MiniAuto,name:'Mini Auto'},
    ELoader: {img:Eloader,name:'E Loader'},
    miniTruck: {img :MiniTruck,name:'Mini Truck'},
  };


//Fetching Previous Rides

 useEffect(()=>{
  axios.post('https://thetest-h9x3.onrender.com/ride/get-ride/userId/',{
    phone:phone
  }).then((response)=>{
    console.log(response.data.data)
    setPreviousRides(response.data.data)

  }).catch((error)=>console.log(error))
 },[])
  //Creating New Ride 

  const handleRide=async()=>{
    
     const formData= new FormData()
     formData.append('name',name);
     formData.append('phone',phone);
     formData.append('pickup',pickup.address)
     formData.append('drop',drop.address)
     formData.append('userPhone',phone)
     formData.append('fare',fare[active].fare)
     formData.append('vehcile',fare[active].vehicleType)

     for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
       const response = await axios.post(
        'https://thetest-h9x3.onrender.com/ride/createRide',
        formData,
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

    
useEffect(() => {
  if (!getEstimate) return;
  if (!pickup?.address || !drop?.address) return;

  console.log("Pickup:", pickup.address);
  console.log("Drop:", drop.address);

  axios.get(
    "https://thetest-h9x3.onrender.com/maps/get-fare-estimate-all",
    {
      params: {
        pickup: pickup.address,
        drop: drop.address
      }
    }
  )
  .then((response) => {
    console.log("Fare estimate:", response.data);
    setFare(response.data.data)
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
        params: { input: query }
      })
      .then((res) => { setter(res.data.results || []);console.log(res.data.results)})
      .catch(console.error);
      
  }, [pickupQuery,dropQuery, activeInput]);
    
 if (!isLoaded) {
          return <div>Loading Map...</div>;
        }
  return (
    <div className="delivery-screen">
      {/* Header with Back Button */}

       {
            getEstimate       
        ?
       
       <div className="ride-selection-screen">
    {/* Full Screen Map */}
    <div className="map-container-fixed">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={pickupLocation}
        zoom={15}
        options={{ disableDefaultUI: true }}
      >
        {pickupLocation && <Marker position={pickupLocation} />}
      </GoogleMap>
      <button className="back-btn-overlay" onClick={() => setGetEstimate(false)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
    </div>

    {/* Bottom Sheet UI */}
    <div className="booking-bottom-sheet">
      <div className="location-summary-row">
        <div className="dot-indicator">
          <div className="dot blue-dot"></div>
          <div className="dot red-dot"></div>
        </div>
        <div className="address-display-stack">
          <div className="addr-text">{pickup.name || "Pickup Location"}</div>
          <div className="addr-text secondary">
            <span className="stop-badge">1 stop to</span> {drop.name || "Destination"}
          </div>
        </div>
        <div className="time-now-box">
          <FontAwesomeIcon icon={faClockRotateLeft} />
          <span>Now</span>
        </div>
      </div>

     

     <div className="ride-options-list">
  {fare.map((item, index) => (
    <div
      key={index}
      className={`ride-card ${active === index ? "selected" : ""}`}
      onClick={() => setActive(index)}
    >
      <div className="ride-img-box">
        <img
          src={vehicleImages[item.vehicleType].img}
          alt={item.vehicleType}
          width={50}
        />
        <span className="eta-tag">3 min</span>
      </div>

      <div className="ride-info">
        <div className="ride-name-line">
          <strong>{vehicleImages[item.vehicleType].name}</strong>
        </div>
        <p className="ride-sub">
            
        </p>
      </div>

      <div className="ride-price-col">₹{item.fare}</div>
    </div>
  ))}
</div>


      {/* Payment and Options Row */}
      {/* <div className="payment-options-row">
        <div className="opt-item"><FontAwesomeIcon icon={faLocationDot} /> Cash</div>
        <div className="opt-item"><FontAwesomeIcon icon={faBookmark} /> Coupon</div>
        <div className="opt-item"><FontAwesomeIcon icon={faUser} /> Myself</div>
      </div> */}

      <button className="confirm-booking-btn" onClick={handleRide}>Confirm Ride</button>
    </div>
  </div>


        :
        <>
              <header className="header2" style={{background:'#0000E6'}}>
                <Link to='/fare-link'>
                 <img src={logo} alt="" width={120} style={{marginTop:'4px'}}/>
                </Link>
                    
                     <div className="header-right">
                       
                       <div className="coin-badge">
                        <div style={{marginLeft:'-10px'}}><img src={coin} alt="" width={22}/></div>
                        <div style={{display:'flex',flexDirection:'column'}}>
                             <span>12 Coins Available </span>
                         <p style={{fontSize:'7px',fontWeight:'300',paddingTop:'1px'}}>Earn 11 More Coins To Use</p>
                        </div>
                        
                       </div>
                       <div><img src={bell} width={26}/></div>
                     </div>
                   </header>
            
     
     

      {/* Floating Input Card */}
      <div className="input-card" style={{marginTop:'-40px',borderRadius:'12px'}}>
        <div className="location-flow">
          <div className="dots-container">
            <div className="dot green"></div>
            <div className="dashed-line"></div>
            <div className="dot red"></div>
          </div>
          
          <div className="inputs-container">
           
            
                {
                  pickup.name ? <div className="pickup-display"><div className="info"><strong>{pickup.name}</strong>
                  <p>{pickup.address}</p></div><FontAwesomeIcon icon={faChevronRight} onClick={()=>setPickup({name:'',address:''})} className="arrow-small"/>
                  </div>:<input type="text" placeholder="Enter Your Pick Up Location" className="drop-input" onChange={(e)=>setPickupQuery(e.target.value)} value={pickupQuery} onFocus={()=>{setActiveInput('pickup');console.log(previousRides)}}/>
                  
                }
               
            
              
                {
                   drop.name ? <div className="pickup-display"><div className="info"><strong>{drop.name}</strong>
                  <p>{drop.address}</p></div><FontAwesomeIcon icon={faChevronRight} onClick={()=>setDrop({name:'',address:''})} className="arrow-small"/>
                  </div>:<div className="drop-input-wrapper">
                  <input type="text" placeholder="Where is your Drop?" className="drop-input" onFocus={()=>setActiveInput('drop')} onChange={(e)=>setDropQuery(e.target.value)}/>
                  {/* <FontAwesomeIcon icon={faMicrophone} className="mic-icon" /> */}
                  </div>
                }
                  
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="tabs2" style={{borderRadius:'10px'}}>
        <div className="tab active">
          <FontAwesomeIcon icon={faLocationCrosshairs} /> Select on map
        </div>
        <div className="tab-divider"></div>
        <div className="tab2">
          <FontAwesomeIcon icon={faHeart} /> Saved Addresses
        </div>
      </div>

      {/* History List */}
      <div className="history-list">

        {
          activeInput&&activeInput==='pickup'&&(pickupPredictions.length>0?pickupPredictions.map((item, index) => (
          <div key={index} className="history-item" onClick={()=>{setPickup({name:item.name,address:item.formatted_address});setPickupPredictions(null);setPickupLocation(item.geometry.location)}}>
            <FontAwesomeIcon icon={faLocationDot} className="time-icon" />
            <div className="item-details">
              <div className="item-header">
                <span className="location-name">{item.name}</span>
                <span className="user-tag">
                  <FontAwesomeIcon icon={faUser} size="xs" /> {item.user}
                </span>
              </div>
              <p className="location-address">{item.formatted_address}</p>
            </div>
            <div className="save-action">
              <FontAwesomeIcon icon={faBookmark} className="heart-icon" />
              <span>SAVE</span>
            </div>
          </div>
          
        )).slice(0,7):previousRides.map((item,index)=>(
          <div key={index} className="history-item" onClick={()=>{setPickup({name:item.name,address:item.formatted_address});setPickupPredictions(null);setPickupLocation(item.geometry.location)}}>
           <FontAwesomeIcon icon={faClock} style={{color:'gray',padding:'8px'}} size='xl'/>
          <div className="item-details">
              <div className="item-header">
                <span className="location-name">{item.pickUp}</span>
                <span className="user-tag">
                  <FontAwesomeIcon icon={faUser} size="xs" /> {item.receiver_name}
                </span>
              </div>
              <p className="location-address">{item.drop}</p>
            </div>
            <div className="save-action">
              <FontAwesomeIcon icon={faBookmark} className="heart-icon" />
              <span>SAVE</span>
            </div>
          </div>
        ))).slice(0,4)
      }
     {
  activeInput === "drop" &&
  (
    dropPredictions.length > 0
      ? dropPredictions
          .slice(0, 7)
          .map((item, index) => (
            <div
              key={index}
              className="history-item"
              onClick={() => {
                setDrop({
                  name: item.name,
                  address: item.formatted_address
                });
                setDropPredictions([]); // ✅ NEVER null
              }}
              style={{alignItems:'center'}}
            >
              <FontAwesomeIcon icon={faLocationDot} className="time-icon" />
              <div className="item-details">
                <div className="item-header">
                  <span className="location-name">{item.name}</span>
                </div>
                <p className="location-address">
                  {item.formatted_address}
                </p>
              </div>
              <div className="save-action">
                <FontAwesomeIcon icon={faBookmark} className="heart-icon" />
                <span>SAVE</span>
              </div>
            </div>
          ))
      : previousRides
          .slice(0, 4)
          .map((item, index) => (
            <div
              key={index}
              className="history-item"
              onClick={() => {
                setDrop({
                  name: item.drop,
                  address: item.drop
                });
                setDropPredictions([]);
              }}
            >
             <FontAwesomeIcon icon={faClock} style={{color:'gray',padding:'8px'}} size='xl'/>
              <div className="item-details">
                <div className="item-header">
                  <span className="location-name">{item.drop}</span>
                </div>
              </div>
              <div className="save-action">
                <FontAwesomeIcon icon={faBookmark} className="heart-icon" />
                <span>SAVE</span>
              </div>
            </div>
          ))
  )
}

       
      </div>

              {pickup&&drop&&
                <div style={{padding:'15px',color:'white',fontWeight:'500',textAlign:'center',borderRadius:'5px',margin:'10px',position:'fixed', bottom:0,width:'94%'}} className="btn" onClick={()=>setGetEstimate(true)}>
                  Get Estimate   
              </div>
}
                </>
       }
     <nav className="bottom-nav2">
        <div className="nav-item active">🏠<span>Home</span></div>
        <div className="nav-item">📋<span>Orders</span></div>
        <div className="nav-item">🪙<span>Coins</span></div>
        <div className="nav-item">👤<span>Account</span></div>
      </nav>
    </div>
  
  );
}