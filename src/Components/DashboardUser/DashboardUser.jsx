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


    const checkDriver=async()=>{
      
    }
  
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
          <li>  <FontAwesomeIcon icon={faMotorcycle } style={{width:"40px"}} size="lg" onClick={checkDriver}/>Driver</li>
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
       
                    

                 <div className='user-details' style={{padding:"20px",width:"100%"}}>
                        
          {
               driver ?
               
               ( driver.status==="Registered"?
                <>
              
             


              You Already Registered With Us As A Driver 
              Log In on 
            
               
                
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
