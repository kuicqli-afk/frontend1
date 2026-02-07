import React, { useContext, useEffect, useRef, useState } from 'react'
import './MobileRideStarted.css'
import { data, Link } from 'react-router-dom'
import logo from "../../../assets/Logo.png";
import coin from '../../../assets/coin.png'
import bell from '../../../assets/Bell.png'
import { SocketContext } from "../../../context/Socketcontext";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from 'axios'
import location from '../../../assets/Location.png'
import drop2 from '../../../assets/drop2.png';
import profile from '../../../assets/driver2.jpg'
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function MobileRideStarted() {
         const [driverLocation,setDriverLocation]=useState()
         const { isLoaded } = useGoogleMaps();
         const [directionResponse, setDirectionResponse] = useState(null);
         const [data,setData]=useState()
         const phone=localStorage.getItem('phone')
         const name=localStorage.getItem('name')
         const {socket}=useContext(SocketContext);  const mapRef = useRef(null);
           const markerRef = useRef(null);
           const animationRef = useRef(null);
           const targetLocationRef = useRef(driverLocation);
         
           

             useEffect(() => {
               if (!socket) return
           
               const handleRideCompleted = (newRide) => {
                 alert('Ride Completed')
                 socket.leave(`order_${orderId}`);
                 console.log(newRide)
                 navigate('/fare-link')
               }
           
               socket.on('ride-completed', handleRideCompleted)
           
               // 🧹 Cleanup
               return () => {
                 socket.off('ride-completed', handleRideCompleted)
               }
             }, [socket])
          useEffect(()=>{
            axios.post('https://thetest-h9x3.onrender.com/ride/get-ride-detail',{
                rideId:ride._id,
            }).then((response)=>{
                console.log(response);
                setData(response.data.data)
            }).catch((error)=>{
                console.log(error)
            })
            },[])

        const ride =JSON.parse(localStorage.getItem("ride"))
        const calculateRoute = async () => {
        if (!window.google || !ride?.pickUp || !ride?.drop) return;
    
        const directionsService = new window.google.maps.DirectionsService();
    
        try {
          const result = await directionsService.route({
            origin:{
                lat:ride.driverId.location.coordinates[1],
                lng:ride.driverId.location.coordinates[0],
            },
            destination: ride.pickUp,
            travelMode: window.google.maps.TravelMode.DRIVING,
          });
           setDistance( result.routes[0].legs[0].distance.text )  // "12.4 km"
           setTravelTime( result.routes[0].legs[0].duration.text)
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
  return (
    <div className='mobile-ride-started-div'>
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

                                <div style={{padding:'10px',display:'flex',flexDirection:'column',gap:'10px'}}>
                                    <div className="map-container3" style={{height:'400px'}}>
                                          <GoogleMap
                                                    mapContainerStyle={{ width: "100%", height: "400px" ,borderRadius:"0px"}}
                                                    center={{
                                                        lat: ride.driverId.location.coordinates[1],
                                                        lng: ride.driverId.location.coordinates[0],
                                                    }}
                                                    zoom={10}
                                                    //    options={{ styles: darkMapStyle }}
                                                        options={{   mapTypeControl: false,    
                                                                    streetViewControl: false,  
                                                                    fullscreenControl: false,  }}
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

                                    <div style={{background:'white',padding:'15px 25px',display:'flex',flexDirection:'row',alignItems:'center',borderRadius:'10px',fontSize:'16px',fontWeight:'600'}}>
                                       Ride Confirmation Otp - {data?data.rideConfirmOtp:'234234'.split('').map((char,index)=>(
                                        <div key={index}  style={{
                                                width: '32px',
                                                height: '40px',
                                                border: '1px solid #ccc',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                borderRadius: '6px',
                                                }}>
                                            {char===' '?'\u00A0':char}
                                        </div>
                                       ))}
                                    </div>

                                     <div className="info-container3">
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
                                    <div style={{display:'flex',flexDirection:'row',background:'white',justifyContent:'space-between',zIndex:'5',gap:'10px',alignItems:'center',borderRadius:'10px',boxShadow:'2px 2px 5px gray',padding:'10px'}}>
                                        
                                        <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'10px'}}>
                                            <img src={profile} alt="" width={50}/>

                                            <div>
                                                <div style={{fontSize:'16px',fontWeight:'700'}}>Driver Name</div>
                                                <div style={{fontSize:'12px',color:'gray'}}>3244323423</div>
                                            </div>
                                        </div>
                                        

                                        <div>
                                              <FontAwesomeIcon icon={faPhone} style={{ color:'#0000E6' }} />
                                        </div>
                                              
                                    </div>

                                </div>

                                

                              

                                 <div className="design" style={{position:'absolute',bottom:'0px',height:'180px',width:'100%'}}></div>
    </div>
  )
}

export default MobileRideStarted