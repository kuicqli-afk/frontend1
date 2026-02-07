import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Navbar2 from '../Navbar2/Navbar2';
import axios from 'axios';
import logo from '../../assets/Logo.png'
import './DashboardUser.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleUser,faMotorcycle,faGear,faRightFromBracket,faHouse, faTemperatureDown  } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {SocketContext} from '../../context/Socketcontext.jsx';
import useSound from 'use-sound';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import RideCard from '../RideCard/RideCard.jsx';

function DashboardUser() {
   
    const name=localStorage.getItem("name");
    const phone=localStorage.getItem("phone");
    const [driver,setDriver]=React.useState({});
    const [isOpen,setIsOpen]=useState(false)
    const {sendMessage,socket}=useContext(SocketContext)
    const [ride,setRide]=useState();
    const [play] = useSound('/sounds/notification.mp3');
    const [order,setOrder]=useState(false);  
    const [previousRide,setPreiviousRide]=useState([])
 

    //UseRef Hook 

    //In useState Hook chainging state can rerender the dom but in useRef chainging ref variable donot re-render the dom

 const navigate=useNavigate();
 
  
  const doLogout=()=>{
    localStorage.removeItem("name")
    localStorage.removeItem("phone")
    localStorage.removeItem("token")
    navigate('/')
    
  }
 


    useEffect(()=>{
       axios.post('https://thetest-h9x3.onrender.com/ride/get-ride/userId',{phone:phone})
       .then((response)=>{
        console.log(response.data)
        setPreiviousRide(response.data.data)
       }).catch((error)=>{
        console.log(error)
       })

    },[])


  
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
          <Link style={{textDecoration:'none',color:'white'}} to='/'><li><FontAwesomeIcon icon={faHouse} style={{width:"40px"}} size="lg"/>Home</li></Link>
          <li onClick={()=>setOrder(false)} >  <FontAwesomeIcon icon={faCircleUser} style={{width:"40px"}} size="lg" />Profile</li>
           {/* <li>  <FontAwesomeIcon icon={faMotorcycle } style={{width:"40px"}} size="lg" onClick={checkDriver}/>Driver</li> */}
           <li onClick={()=>setOrder(true)}>  <FontAwesomeIcon icon={faClipboardList} style={{width:"40px"}} size="lg" />Orders</li>
          {/* <li>  <FontAwesomeIcon icon={faGear} style={{width:"40px"}} size="lg"/>Settings</li> */}
          {/* <li>  <FontAwesomeIcon icon={faBell} style={{width:"40px"}} size="lg"/>Notifications</li> */}
          <li>  <FontAwesomeIcon icon={faRightFromBracket} style={{width:"40px"}} size="lg" onClick={doLogout}/>Logout</li>
        </ul>
      </div>
      <div className='dashboard-content'>
      {
        order?
        <>
        <div className='dashboard-navbar'>
          <h1>Order</h1>
          <div className='sub-navbar'>
           {/* <img src={`http://localhost:4000/${driver.documents.profile_photo}`} alt=""  width={50} style={{borderRadius:"50%"}}/> */}
            <span style={{padding:"20px",fontWeight:"600"}}>{name}</span>
         

          </div>
        </div>
        <div style={{padding:"20px"}}>
         {previousRide.map((ride) => (
          <RideCard key={ride._id} ride={ride} />
        ))}

        </div>
        </>
        :
        <>
        <div className='dashboard-navbar'>
          <h1>Dashboard</h1>
          <div className='sub-navbar'>
           {/* <img src={`http://localhost:4000/${driver.documents.profile_photo}`} alt=""  width={50} style={{borderRadius:"50%"}}/> */}
            <span style={{padding:"20px",fontWeight:"600"}}>{name}</span>
         

          </div>
        </div>
        <div style={{padding:"20px"}}>
       
                    

                 <div className='user-details' style={{padding:"20px",width:"100%"}}>
                        
          
             
              
                <h2>User Details</h2>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Phone:</strong> {phone}</p>
              
          
            
          
         </div>
        </div>
        
      </>
      }
      </div>
      
     
    </div>
     <div className="bottom-sidebar">
  {/* Wrap the content inside the Link, and style the Link as the flex item */}
  <Link className="nav-item" to="/" style={{ textDecoration: 'none' }}>
    <FontAwesomeIcon icon={faHouse} size="lg" />
    <span>Home</span>
  </Link>

  <li className="nav-item" onClick={()=>setOrder(false)}>
    <FontAwesomeIcon icon={faCircleUser} size="lg" />
    <span>Profile</span>
  </li>

  <li className="nav-item" onClick={()=>setOrder(true)} >
    <FontAwesomeIcon icon={faClipboardList} size="lg" />
    <span>Orders</span>
  </li>

  <li className="nav-item" onClick={doLogout}>
    <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
    <span>Logout</span>
  </li>
</div>
   
        
      
 
    </>
  )
}

export default DashboardUser
