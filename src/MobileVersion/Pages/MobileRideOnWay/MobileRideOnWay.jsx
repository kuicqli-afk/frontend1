import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import './MobileRideOnWay.css'
import { GoogleMap, Marker ,
  DirectionsRenderer, } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";
import { SocketContext } from "../../../context/Socketcontext";
import bike from '../../../assets/bike-2.png'
import Driver from '../../../assets/driver2.jpg'
import { useNavigate,Link } from "react-router-dom";
import logo from "../../../assets/Logo.png";
import coin from '../../../assets/coin.png'
import bell from '../../../assets/Bell.png'
import { MdWatchLater } from "react-icons/md";
import drop2 from '../../../assets/drop2.png';
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import location from '../../../assets/Location.png'
import profile from '../../../assets/driver2.jpg'
import TwoWheeler from '../../../assets/blue-scooter.png'
import StarRating from "../../Components/StarRating/StarRating.jsx";
import cash from '../../../assets/cash.jpg'

function MobileRideOnWay() {

  const [search, setSearch] = useState(true);
  const phone=localStorage.getItem('phone')
  const name=localStorage.getItem('name')
  const { isLoaded } = useGoogleMaps();
  const { socket } = useContext(SocketContext);
  const ride = JSON.parse(localStorage.getItem("ride"));
  const [distance, setDistance] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [directionResponse, setDirectionResponse] = useState(null);
  const [driverLocation, setDriverLocation] = useState(
     ride?.driverId?.location
       ? {
           lat: ride.driverId.location.coordinates[1],
           lng: ride.driverId.location.coordinates[0],
         }
       : null
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
       []
     );
  
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
  const x = Math.cos(lat1) * Math.sin(lat2) -
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
        console.log(newLocation)
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
    if (!isLoaded || !driverLocation || !ride?.pickUp || directionResponse) return;

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
          setTravelTime(result.routes[0].legs[0].duration.value);
          console.log(travelTime)
        }
      }
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

                              <div className="container" style={{zIndex:'5'}}>
                                  <div className="map-container3">
                                             <GoogleMap
                                                mapContainerStyle={{ width: "100%",height:'100%',borderRadius:'10px'}}
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

                                  <div className="trip-container">
                                    <div><h4>Trip Id - {ride._id.slice(0,15)}</h4></div>
                                    <div style={{display:'flex',flexDirection:'row',gap:'10px'}}>
                                      <div>Info</div>
                                      <div>Share</div>
                                    </div>
                                  </div>

                                  <div className="time-container">

                               
                                      <MdWatchLater size={22} style={{color:'green'}}/>
                                      <h6>Kuicqli heros on the way to pick Up ...</h6>
                                      <div style={{display:'flex',flexDirection:'row',gap:'5px'}}>
                                             <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0px'}}>
                                               <h3>{String(hr).padStart(2, '0')}</h3>
                                              <p style={{color:'gray'}}>HR</p>
                                             </div>
                                             <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0px'}}>
                                             <h3>{String(min).padStart(2, '0')}</h3>
                                              <p style={{color:'gray'}}>MIN</p>
                                             </div>
                                             <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0px'}}>
                                            <h3>{String(sec).padStart(2, '0')}</h3>
                                              <p style={{color:'gray'}}>SEC</p>
                                             </div>
                                      </div>
                                  </div>
                                  <div className="searchbar-conatiner">
                                     <div></div>
                                     <div></div>
                                     <div></div>
                                  </div>
                               
                               <div className="driver-info-div">
                                <div style={{display:'flex',flexDirection:'row',gap:'5px',alignItems:'center'}}>
                                    <img src={profile} alt="" width={40}/>
                                     <img src={TwoWheeler} alt="" width={50}/>
                                     <div className="driver-info-2">
                                         <div style={{fontSize:'14px',fontWeight:'700'}}>UP32 AK 2343</div>
                                         <div style={{fontSize:'12px',color:'gray'}}>Driver Name</div>
                                         <div style={{fontSize:'10px'}}><StarRating rating={3}/></div>
                                     </div>
                                </div>

                                     <div className="otp-div">
                                         OTP - {ride.otp}
                                     </div>
                                     
                                     <div style={{border:'2px solid blue',padding:'5px',borderRadius:'90px'}}>
                                       <FontAwesomeIcon icon={faPhone} size="1" style={{color:'#0000E6'}}/>
                                     </div>
                               </div>
                            <div className="info-container3" style={{boxShadow:'2px 2px 5px gray'}}>
                                            <div className="div-info-container">
                                                 <div className="location-icon-container">
                                                       <img src={location} alt="" width={16}/>
                                                       <div style={{height:'42px',width:'0px',border:'none',marginLeft:'7px',borderRight:'1px dashed black'}}></div>
                                                       <img src={drop2} alt="" width={15} height={20} style={{marginTop:'5px'}}/>
                                                 </div>
                                                 <div className="location-name-container">
                                                         <div className="pick-up-div">
                                                              <div style={{color:'green',fontSize:'14px',fontWeight:'600'}}>Pick Up Location</div>
                                                              <div style={{fontSize:'12px',fontWeight:'600'}}>{name}.{phone}</div>
                                                              <div style={{fontSize:'10px',color:'gray'}}> {ride.pickUp}</div>
                                                         </div>
                                                          <div className="pick-up-div">
                                                              <div style={{color:'red',fontSize:'14px',fontWeight:'600'}}>Drop Location</div>
                                                              <div style={{fontSize:'12px',fontWeight:'600'}}>{ride.receiver_name}.{ride.receiver_phone}</div>
                                                              <div style={{fontSize:'10px',color:'gray'}}> {ride.drop}</div>
                                                         </div>
                                                 </div>
                                                 
                                            </div>
                                            
                                            
                                            
                                         </div>

                                         <div className="cash-container">
                                               <div className="cash-container-1">
                                                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                                   <div style={{margin:"5px",border:'1px solid gary',borderRadius:'10px'}}>
                                                    <img src={cash} alt="" width={40} style={{borderRadius:'10px'}}/>
                                                  </div>
                                                  <div style={{display:'flex',flexDirection:'column'}}>
                                                    <div style={{fontWeight:'600'}}>Cash</div>
                                                    <div style={{fontSize:'10px',color:'gray'}}>Payment Method</div>
                                                  </div>
                                                </div>
                                                  
                                                  <div style={{display:'flex',flexDirection:'column',justifyContent:'start'}}>
                                                      <div style={{fontWeight:'600',textAlign:'right'}}>₹160</div>
                                                      <div style={{color:'blue',fontSize:'12px',padding:'1px 0px'}}>View Breakup</div>
                                                  </div>
                                               </div>
                                               <div style={{display:'flex',flexDirection:'row',background:'rgb(255, 220, 220)',padding:'10px',borderRadius:'5px',fontSize:'12px'}}>
                                                   You will receive 2 coins on this order
                                               </div>
                                         </div>
                                         
                                     
                              </div>
                              <div className="design" style={{position:'absolute',bottom:'0px',height:'180px',width:'100%'}}></div>
    </div>
//      <div className="searching-page">
//           {/* MAP */}
//            {/* <SuccessPopUp heading={'Driver Accepted Your Order'} para={'Your Order is Accepted by Driver He is on the way to reach Pickup Location'} btn={'OK'}/> */}
//           <div className="map-container2">
//                <GoogleMap
//                 mapContainerStyle={{ width: "100%", height: "400px" }}
//                 center={driverLocation}
//                 zoom={14}
//                 options={mapOptions}
//                 onLoad={(map) => (mapRef.current = map)}
//               >
//                 {/* DRIVER MARKER */}
//                 {driverLocation && (
//                   <Marker
//                     position={driverLocation}
//                     ref={markerRef}
//                     icon={{
//                     url: bike,
//                     scaledSize: new window.google.maps.Size(40, 40),
//                     anchor: new window.google.maps.Point(25, 25),
//                     rotation: rotation,

//                     }}
//                   />
//                 )}

//                 {/* ROUTE */}
//                 {directionResponse && (
//                   <DirectionsRenderer
//                     directions={directionResponse}
//                     options={{ suppressMarkers: true }}
            
//                   />
//                 )}
//               </GoogleMap>
//           </div>

//           {/* BOTTOM CARD */}
//      {/* DRIVER ASSIGNED CARD */}
// <div className="search-card assigned">

//   {/* STATUS */}
//   <div className="assigned-header">
//     <div className="status-icon">✓</div>
//     <div>
//       <h3>Driver assigned</h3>
//       <p>Driver is on the way</p>
//     </div>
//   </div>

//             {/* DRIVER INFO */}
//             <div className="driver-info">
//                 <img
//                 src={Driver}
//                 alt="Driver"
//                 className="driver-avatar"
//                 />

//                 <div className="driver-meta">
//                 <div className="driver-name">
//                     {ride.driverId.name}
//                     <span className="rating">★ {ride.driverId.rating||'3.5'}</span>
//                 </div>
//                 <div className="vehicle-info">
//                     {ride.driverId.vehicle} · {ride.driverId.vehicleNumber}
//                 </div>
//                 </div>
//                 <div style={{display:'flex',flexDirection:'row',fontSize:'14px',padding:'5px',background:'#004cff1f',borderRadius:'5px'}}>
//                    OTP - {ride.otp}
//                 </div>

//                 <div className="eta">
//                 {/* {ride.eta}  */}
//                 32min
//                 </div>
//             </div>

//             {/* LOCATION */}
//             <div className="ride-details">
//                 <div className="location-row">
//                 <span className="dot pickup"></span>
//                 <span>{ride.pickUp}</span>
//                 </div>

//                 <div className="location-row">
//                 <span className="dot drop"></span>
//                 <span>{ride.drop}</span>
//                 </div>
//             </div>

//             {/* ACTIONS */}
//             <div className="action-buttons">
//                 <button className="call-btn">Call</button>
//                 {/* <button className="chat-btn">Chat</button> */}
//             </div>

//             {/* FOOTER */}
//             <div className="info-text">
//                 Share OTP only after verifying the driver.
//             </div>
//             </div>

//         </div>
  )
}

export default MobileRideOnWay