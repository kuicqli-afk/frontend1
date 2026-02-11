import React, { useContext, useEffect, useRef, useState } from "react";
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

import MiniAuto from "../../../assets/blue-miniAuto.png";
import Eloader from "../../../assets/blue-eloader.png";
import ThreeWheeler from "../../../assets/3wheeler.png";
import MiniTruck from "../../../assets/blue-minitruck.png";
import coin from '../../../assets/coin.png';
import bell from '../../../assets/Bell.png'
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { RideContext } from "../../../context/RideContext.jsx";
import driverRegistration2 from '../../../assets/driverRegistration2.png'
import driverRegistration from '../../../assets/driverRegistration.png'
import drop2 from '../../../assets/drop2.png';
import dropHome from '../../../assets/receiver-red.png'
import redProfile from '../../../assets/red-profile.png'
import dropPhone from '../../../assets/mobile-red.png'
import location from '../../../assets/Location.png'
import sender from '../../../assets/sender.png'
import weight2 from '../../../assets/weight2.png'
import TwoWheeler from '../../../assets/blue-scooter.png'
import { DirectionsRenderer } from "@react-google-maps/api";
import location2 from '../../../assets/location2.png'



export default function DeliveryLocation(){
    const { isLoaded } = useGoogleMaps();
    const [ride,setRide]=useState([])
    const [pickup, setPickup] = useState({
      name:'',
      address:'',
      coords:''
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
    const {previousRides}=useContext(RideContext);
    const [finalDetail,setFinalDetail]=useState(false)
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);
    const [directions, setDirections] = useState(null);

    
    // const [show,setShow]=useState()
    
    const [dropDetail,setDropDetail]=useState({
      landmark:'',
      receiver_name:'',
      receiver_phone:'',
      productType:''
    })
  
    
const pickupInputRef = useRef(null);
const dropInputRef = useRef(null);

useEffect(() => {
  if (!pickup?.address) return;

  axios
    .get("https://thetest-h9x3.onrender.com/maps/getLocation", {
      params: { address: pickup.address }
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
      params: { address: drop.address }
    })
    .then((res) => {
      setDropCoords(res.data.message);
    })
    .catch(console.error);

}, [drop.address]);


  
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
        setDirections(result);
      } else {
        console.error("Directions error:", status);
      }
    }
  );
}, [pickupCoords, dropCoords]);

 

  const handleRide=async()=>{
    
     const formData= new FormData()
     formData.append('name',name);
     formData.append('phone',phone);
     formData.append('pickup',pickup.address)
     formData.append('drop',drop.address)
     formData.append('userPhone',phone)
     formData.append('receiver_name',dropDetail.receiver_name)
     formData.append('receiver_phone',dropDetail.receiver_phone)
     formData.append('landmark',dropDetail.landmark)
     formData.append('productType',dropDetail.productType)
     formData.append('fare',active.fare)
     formData.append('vehcile',active.vehicleType)

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

const handleChange = (state) => {
  setGetEstimate(false);

  if (state === 'pickup') {
    setPickup(prev => ({ ...prev, name: '', address: '' }));
    setActiveInput('pickup');   // ✅ focus pickup input
  } else if (state === 'drop') {
    setDrop(prev => ({ ...prev, name: '', address: '' }));
    setActiveInput('drop'); 
 
        // ✅ focus drop input
  }

  navigate('/ride');
};

    useEffect(() => {
      if (activeInput === 'pickup') {
        pickupInputRef.current?.focus();
      }
      if (activeInput === 'drop') {
        dropInputRef.current?.focus();
      }
    }, [activeInput]);
    
  const handleCheckfare=()=>{

     if(!dropDetail.landmark||!dropDetail.receiver_name||!dropDetail.receiver_phone)
     {
         alert('All Field are Required');
         return;
     }
     setGetEstimate(true)

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

                                {
                                  finalDetail?
                                  <div style={{height:'44%',display:'flex',flexDirection:'column',alignItems:'end', justifyContent:'end'}}>
                                    <div className="check-fare-btn" onClick={handleRide}>
                                      Book Ride
                                    </div>
                                  </div>
                                  :
                                  <>
                                     <div className="container">

                                <div className="map-container2" style={{height:'280px'}}>

                                <div className="map-container-fixed" style={{height:'100%'}}>
                                        <GoogleMap
                                          mapContainerStyle={{ width: "100%", height: "100%" }}
                                          center={pickupCoords}
                                          zoom={14}
                                          options={{ disableDefaultUI: true }}
                                        >
                                          {pickupCoords && <Marker position={pickupCoords} icon={{
                                            url: location2,
                                            scaledSize: new window.google.maps.Size(30, 40),
                                            
                                          }}/>}
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

                    </div>
                        
                  </div>

                  <div className="info-container3">
                     <div className="div-info-container">
                          <div className="location-icon-container">
                                <img src={location} alt="" width={16}/>
                                <div style={{height:'32px',width:'0px',border:'none',marginLeft:'7px',borderRight:'1px dashed black'}}></div>
                                <img src={drop2} alt="" width={15} height={20} style={{marginTop:'5px'}}/>
                          </div>
                          <div className="location-name-container">
                                  <div className="pick-up-div">
                                       <div style={{color:'green',fontSize:'14px',fontWeight:'600'}}>Pick Up Location</div>
                                       <div style={{fontSize:'12px',fontWeight:'600'}}>{name}.{phone}</div>
                                       <div style={{fontSize:'10px',color:'gray'}}> {pickup.address.length > 35 ? pickup.address.slice(0, 35) + "..." : pickup.address}</div>
                                  </div>
                                   <div className="pick-up-div">
                                       <div style={{color:'red',fontSize:'14px',fontWeight:'600'}}>Drop Location</div>
                                       <div style={{fontSize:'12px',fontWeight:'600'}}>{drop.address.length > 15 ? drop.address.slice(0, 15) + "..." : drop.address}</div>
                                       <div style={{fontSize:'10px',color:'gray'}}> {drop.address.length > 35 ? drop.address.slice(0, 35) + "..." : drop.address}</div>
                                  </div>
                          </div>
                     </div>
                      <div className="btn-container3">


                            <div><button onClick={()=>handleChange('pickup')}>Change</button></div>
                            <div>
                                <button
                                  onClick={() => handleChange('drop')}
                                >
                                  Change
                                </button>
                              </div>
                           
                           
                      </div>
                     
                  </div>

                  <div className="fare-container2">
                    {
                      fare.map((item)=>(
                        <div className="vehicle" onClick={()=>{setActive({vehicleType:item.vehicleType,fare:item.fare});console.log(active)}} style={item.vehicleType===active?.vehicleType?{border:'2px solid red'}:{}}>
                        <div style={{display:'flex',flexDirection:'row',gap:'15px'}}>
                              <div style={{background:'blue',borderRadius:'0px 0px 20px 20px',padding:'10px',marginTop:'-10px',height:'70px'}}>
                                <p style={{color:'white',fontSize:'10px'}}>40KG</p>
                                <img src={weight2} alt="" width={30}/>
                              </div>
                              <div>
                                  <img src={vehicleImages[item.vehicleType].img} alt="" width={item.vehicleType==='miniTruck'?65:60}/> 
                              </div>
                              <div style={{display:'flex',flexDirection:'column',color:'gray',justifyContent:'center'}}>
                                  <img src="" alt="" />
                                  <div style={{fontWeight:'600',fontSize:'14px'}}>{vehicleImages[item.vehicleType].name}</div>
                                  <div>1 mins</div>
                              </div>
                        </div>
                        <div style={{display:'flex',flexDirection:'column',fontWeight:'600',color:'gray',justifyContent:'center',alignItems:'center',lineHeight:'22px'}}>
                          <div style={{fontSize:'14px'}}>Book Fare</div>
                          <div style={{fontSize:'30px'}}>₹{item.fare}</div>
                        </div>
                          
                       </div>

                      ))
                    }
                       
                               
                  </div>
                  <div className="check-fare-btn" style={{fontWeight:'600'}} onClick={()=>setFinalDetail(true)}>
                        
                          Click to find the Kuicqli heroes
                        
                       </div>

                  </div>
                                  </>
                                }
                             
              </>

        :
        ( pickup.name && drop.name ?
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
          
             <div className="container" >
               <div className="map-container2" style={{height:'200px'}}>

                  <div className="map-container-fixed" style={{height:'100%'}}>
                            <GoogleMap
                              mapContainerStyle={{ width: "100%", height: "100%" }}
                              center={dropCoords}
                              zoom={15}
                              options={{ disableDefaultUI: true }}
                            >
                              {dropCoords && <Marker position={dropCoords} />}
                            </GoogleMap>
                            <button className="back-btn-overlay" onClick={() => setDrop('')}>
                              <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                    </div>
                        
               </div>
               <div className="info-container2">
                    <div className="drop-div">
                      <div style={{display:'flex',flexDirection:'row', justifyContent: "flex-start",  alignItems: "", gap:'10px',
                      }}>
                            <img src={drop2} alt=""className="drop-image" />
                            <div className="drop-div-info">
                                <div className="drop-div-info-1">Drop Location</div>
                                <div style={{fontWeight:'700',fontSize:'13px'}}>
                                 {drop.name}

                                </div>
                                <div style={{fontSize:'12px', paddingRight: "20px" }}>
                                    {drop.address.length > 55 ? drop.address.slice(0, 55) + "..." : drop.address}
                                </div>
                            </div>
                      </div>
                      <div className="change-btn-conatiner">
                        <button onClick={()=>setDrop('')}>
                          Change
                        </button>
                      </div>
                         
                  </div>
                  <div className="input-div">
                        <img src={dropHome} alt="" width={18} style={{margin:'8px 15px'}}/>
                        <input type="text" placeholder="Enter House / Appartment / Landmark" onChange={(e)=>setDropDetail({...dropDetail,landmark:e.target.value})} value={dropDetail.landmark}/>
                  </div>
                   <div className="input-div">
                        <img src={redProfile} alt="" width={18} style={{margin:'8px 15px',}}/>
                        <input type="text" placeholder="Enter Receiver's Name" onChange={(e)=>setDropDetail({...dropDetail,receiver_name:e.target.value})} value={dropDetail.receiver_name}/>
                  </div>
                   <div className="input-div">
                        <img src={dropPhone} alt="" width={18} style={{margin:'8px 15px'}}/>
                        <input type="text" placeholder="Enter Receiver's Mobile Number" onChange={(e)=>setDropDetail({...dropDetail,receiver_phone:e.target.value})} value={dropDetail.receiver_phone}/>
                  </div>
                   <div className="input-div">
                        <img src={sender} alt="" width={18} style={{margin:'8px 15px'}}/>
                        <input type="text" placeholder="Sender's Mobile Number " value={phone +" ( Sender's Phone Number )"} style={{color:'#cbcbcb'}} readOnly='true'/>
                  </div>
                  <div className="input-div">
                     <select name="" id="" style={{width:'100%',padding:'10px', color: "#939393",}} onChange={(e)=>setDropDetail({...prev,productType:e.target.value})}>
                      <option value="" disabled="true">Select Product Type</option>
                      <option value="wood">Wood</option>
                      <option value="metal">Metal</option>
                      <option value="paper">Paper</option>
                      <option value="plastic">Plastic</option>
                     </select>
                  </div>
               </div>
                <div className="check-fare-btn" onClick={handleCheckfare}>
                   Check-Fare
                </div>
             </div>
           
          </>
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
                  pickup.name ? <div className="pickup-display"><div className="info"><strong> {pickup.name.length > 30
                      ? pickup.name.slice(0, 30) + "..."
                      : pickup.name}</strong>
                     <p>
                    {pickup.address.length > 50
                      ? pickup.address.slice(0, 50) + "..."
                      : pickup.address}
                  </p></div><FontAwesomeIcon icon={faChevronRight} onClick={()=>setPickup({name:'',address:''})} className="arrow-small"/>
                  </div>:<input type="text" placeholder="Enter Your Pick Up Location" className="drop-input" onChange={(e)=>setPickupQuery(e.target.value)} value={pickupQuery} onFocus={()=>{setActiveInput('pickup');console.log(previousRides)}}/>
                  
                }
               
            
              
                {
                   drop.name ? <div className="pickup-display"><div className="info"><strong>{drop.name.length > 30
                      ? drop.name.slice(0, 30) + "..."
                      : drop.name}</strong>
                        <p>
                    {drop.address.length > 50
                      ? drop.address.slice(0, 50) + "..."
                      : drop.address}
                  </p>
                   </div><FontAwesomeIcon icon={faChevronRight} onClick={()=>setDrop({name:'',address:''})} className="arrow-small"/>
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
        {/* <div className="tab active">
          <FontAwesomeIcon icon={faLocationCrosshairs} /> Select on map
        </div> */}
        {/* <div className="tab-divider"></div> */}
        <div className="tab2" style={{padding:'10px'}}>
          <FontAwesomeIcon icon={faHeart} /> Saved Addresses
        </div>
      </div>  

      {/* History List */}
      <div className="history-list" >
       
        {
          activeInput&&activeInput==='pickup'&&(pickupPredictions.length>0?pickupPredictions.map((item, index) => (
          <div key={index} className="history-item" style={{zIndex:'2'}} onClick={()=>{setPickup({name:item.name,address:item.formatted_address});setPickupLocation(item.geometry.location)}}>
            <FontAwesomeIcon icon={faLocationDot} className="time-icon" />
            <div className="item-details">
              <div className="item-header">
                <span className="location-name">{item.name}</span>
                <div className="user-tag" >
                 <div><FontAwesomeIcon icon={faUser} size="xs" /></div> <div>{item.user}</div> 
                </div>
              </div>
              <p className="location-address">{item.formatted_address}</p>
            </div>
            <div className="save-action">
              <FontAwesomeIcon icon={faBookmark} className="heart-icon" />
              <span>SAVE</span>
            </div>
          </div>
          
        )).slice(0,7):previousRides.map((item,index)=>(
          <div key={index} className="history-item"  onClick={() => {
                setPickup({
                  name:item.pickUp,
                  address: item.pickUp
                });
                setDropPredictions([]);
              }}>
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
          .slice(0, 8)
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
          ))
  )
}

       
      </div>

             
</>
        )
       
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