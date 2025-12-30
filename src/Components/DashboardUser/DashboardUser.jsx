import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Navbar2 from '../Navbar2/Navbar2';
import axios from 'axios';
import logo from '../../assets/Logo.png'
import './DashboardUser.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleUser,faMotorcycle,faGear,faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import {SocketContext} from '../../context/Socketcontext.jsx';
import useSound from 'use-sound';



function DashboardUser() {
   
    const name=localStorage.getItem("name");
    const phone=localStorage.getItem("phone");
    const [driver,setDriver]=React.useState({});
    const [isOpen,setIsOpen]=useState(false)
    const {sendMessage,socket}=useContext(SocketContext)
    const [ride,setRide]=useState();
    const [play] = useSound('/sounds/notification.mp3');
 

    //UseRef Hook 

    //In useState Hook chainging state can rerender the dom but in useRef chainging ref variable donot re-render the dom

  
    useEffect(()=>{
 
       
        axios.post(
          "https://thetest-h9x3.onrender.com/caption/getCaption",
          { phone: phone },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

          .then((res)=>{
            console.log(res.data);
            setDriver(res.data.data);
            localStorage.setItem("driver",JSON.stringify(res.data.data));
            console.log(res.data.data)
            sendMessage("join",{userId:res.data.data._id,userType:"driver"})
          })
          .catch((err)=>{
            console.log(err);
          })
            
          
      
        
    },[])

useEffect(() => {
  if (!driver?._id) return; // 🚨 wait until driver is loaded
  console.log(driver._id)
  const updateLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude,position.coords.longitude)
      sendMessage("update-location-caption", {
        userId: driver._id,
        location: {
          ltd: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });
    });
  };

  updateLocation(); // initial call
  const interval = setInterval(updateLocation, 10000);

  return () => clearInterval(interval);
}, [driver]);
    
socket.on('new-ride',(data)=>{
  console.log(data)
  // alert('New Ride')
  setRide(data)
  setIsOpen(true)
   play();
})


  
  const closePopup = () => setIsOpen(false)
  return (
    <>
    {/* <Navbar2/> */}


    <div className='dashboard-sidebar-container'>
      <div className='dashboard-sidebar'>
        <Link to="/">
          <div style={{padding:"10px"}}>
          <img src={logo} alt="" width={200}/>
        </div></Link>
      
        <ul>
          <li>  <FontAwesomeIcon icon={faCircleUser} style={{width:"40px"}} size="lg"/>Profile</li>
          <li>  <FontAwesomeIcon icon={faMotorcycle } style={{width:"40px"}} size="lg"/>Rides</li>
          <li>  <FontAwesomeIcon icon={faGear} style={{width:"40px"}} size="lg"/>Settings</li>
          <li>  <FontAwesomeIcon icon={faBell} style={{width:"40px"}} size="lg"/>Notifications</li>
          <li>  <FontAwesomeIcon icon={faRightFromBracket} style={{width:"40px"}} size="lg"/>Logout</li>
        </ul>
      </div>
      <div className='dashboard-content'>
        <div className='dashboard-navbar'>
          <h1>Dashboard</h1>
          <div className='sub-navbar'>
           {/* <img src={`http://localhost:4000/${driver.documents.profile_photo}`} alt=""  width={50} style={{borderRadius:"50%"}}/> */}
            <span style={{padding:"20px",fontWeight:"600"}}>{name}</span>
         

          </div>
        </div>
        <div style={{padding:"20px"}}>
          <h2 onClick={()=>{play();console.log('play')}}>Welcome To <span style={{color:"blue"}}> Dashboard</span></h2>
                    {isOpen&&
                      <div className="popup-overlay">
                        <div className="popup-content">
                          <h2>New Ride Request</h2>
                          <div style={{padding:"20px"}}>
                            <p><strong>Name:</strong>{ride?.userId.name}</p>
                            <p><strong>Phone:</strong>{ride?.userId.phone}</p>
                            <p><strong>Price:</strong>{ride?.fare}</p>
                            <p><strong>Pick Up Location:</strong>{ride?.pickUp}</p>
                          </div>
                          <div style={{display:'flex',flexDirection:'row',padding:'10px',justifyContent:"space-evenly"}}>
                              <button onClick={closePopup} style={{padding:"10px",background:"blue",color:"white",fontWeight:"500",border:"none",borderRadius:"5px"}}>Accept</button>
                              <button onClick={closePopup} style={{padding:"10px",background:"gray",color:"white",fontWeight:"500",borderRadius:"5px",border:"none"
                              }}>Close</button>
                          </div>
                         
                        </div>
                      </div>
                       }
                    

                 <div className='user-details' style={{padding:"20px",width:"100%"}}>
                        
          {
               driver ?
               
               ( driver.status==="Registered"?
                <>
              
             
                <div>
                  <img src={`https://thetest-h9x3.onrender.com/${driver.documents.profile_photo}`} alt="" width={150} height={150}style={{borderRadius:"50%"}}/>
                 
                </div>
                <div style={{marginLeft:"20px",padding:"5px"}}>  Profile Photo </div>
               
                <div className='info-div'>
                  <div className='personal-info'>
                    <h2>Personal Information</h2>
                      <p style={{display:"flex",flexDirection:"row",gap:"20px"}}><div><strong>Name:</strong></div><div>{driver.name}</div></p>
                      <p><strong>Phone:</strong> {phone}</p>
                      <p><strong>Vehicle:</strong> {driver.vehcile}</p>
                      <p><strong>Status:</strong> {driver.status}</p>
                  </div>
                  <div className='documents-info'>
                    <h2>Documents</h2>
                    <p><strong>Driving License:</strong></p>
                    <img src={`https://thetest-h9x3.onrender.com/${driver.documents.dl}`} alt="" width={150} height={100} />
                    <p><strong>Vehicle Registration:</strong></p>
                    <img src={`https://thetest-h9x3.onrender.com/${driver.documents.rc}`} alt="" width={150} height={100} />
                    
                    <p><strong>Aadhaar:</strong></p>
                    <img src={`https://thetest-h9x3.onrender.com/${driver.documents.aadhar_photo}`} alt="" width={150} height={100} />
                    <p><strong></strong></p>
                  </div>
                </div>
               
                
                </>
                :

                <div>
                    <h2>Your Application as A Driver is Submitted We Are Working On Your Application</h2>
                </div>
                
               )
              
                
                : 
              <>
                <h2>User Details</h2>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Phone:</strong> {phone}</p>
              </>
          }
            
          
         </div>
        </div>
        
      </div>
    </div>
     
   
        
      
 
    </>
  )
}

export default DashboardUser
