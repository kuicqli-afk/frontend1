import React, { useContext, useEffect, useRef, useState } from "react";
import "./MobileRide.css";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../providers/GoogleMapsProvider.jsx";
import { SocketContext } from "../../../context/Socketcontext";
import bikeIcon from "../../../assets/bike-2.png";
import Popup from "../../Components/Popup/Popup.jsx";
import SuccessPopUp from "../../Components/SuccessPopUp/SuccessPopUp.jsx";
import Driver from '../../../assets/driver2.jpg'
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/Logo.png";
import coin from '../../../assets/coin.png'
import bell from '../../../assets/Bell.png'
import drop2 from '../../../assets/drop2.png';
import { MdWatchLater } from "react-icons/md";
import location from '../../../assets/Location.png'
function MobileRide() {
  const [search, setSearch] = useState(true);
  const { isLoaded } = useGoogleMaps();
  const { socket } = useContext(SocketContext);
  const ride = JSON.parse(localStorage.getItem("ride"));
  const nearByDrivers = ride?.nearbyDrivers || [];


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

    const phone=localStorage.getItem('phone')
    const name=localStorage.getItem('name')
    console.log(ride)
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

                                  </div>

                                  <div className="trip-container">
                                    <div><h4>Trip Id - {ride._id.slice(0,15)}</h4></div>
                                    <div style={{display:'flex',flexDirection:'row',gap:'10px'}}>
                                      <div>Info</div>
                                      <div>Share</div>
                                    </div>
                                  </div>

                                  <div className="time-container">

                                    <h6>Searching for Kuicqli heroes near by....</h6>
                                      {/* <MdWatchLater size={22} style={{color:'green'}}/>
                                      <h6>Kuicqli heros on the way to pick Up ...</h6>
                                      <div style={{display:'flex',flexDirection:'row',gap:'5px'}}>
                                             <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0px'}}>
                                              <h3>00</h3>
                                              <p style={{color:'gray'}}>HR</p>
                                             </div>
                                             <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0px'}}>
                                              <h3>00</h3>
                                              <p style={{color:'gray'}}>HR</p>
                                             </div>
                                             <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0px'}}>
                                              <h3>00</h3>
                                              <p style={{color:'gray'}}>HR</p>
                                             </div>
                                      </div> */}
                                  </div>
                                  <div className="searchbar-conatiner">
                                     <div></div>
                                     <div></div>
                                     <div></div>
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
                                     
                              </div>
                              <div className="design" style={{position:'absolute',bottom:'0px',height:'180px',width:'100%'}}></div>
    </div>
  )
}

export default MobileRide;
