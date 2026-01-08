import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import { SocketContext } from '../../context/Socketcontext'
function RideStarted() {
    const {socket}=useContext(SocketContext);
    const [data,setData]=useState('')
    const ride =JSON.parse(localStorage.getItem("ride"))
// 🔌 Socket listener
  useEffect(() => {
    if (!socket) return

    const handleRideCompleted = (newRide) => {
      alert('Ride Completed')
      console.log(newRide)
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
  return (<>
  <Navbar/>
    <div style={{
padding:"20px"
    }}>
        <h1>Ride Started</h1>
        <div style={{width:"full",height:"500px",border:"2px solid black",marginTop:"10px"}}>
           
        </div>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>
          <div style={{padding:"10px"}}>
            <p><strong>Driver Name :</strong> {ride.driverId.name}</p>
            <p><strong>Driver Phone :</strong>{ride.driverId.phone}</p>
          </div>
          <div style={{padding:"10px"}}>
            <h3>Ride Confimation Otp- <span style={{color:"blue"}}>{data.rideConfirmOtp}</span></h3>
            <h5>Driver Patner Will There in -</h5>
          </div>
        </div>
        
    </div>
    
</>
  )
}

export default RideStarted