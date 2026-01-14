import React, { useState,useEffect } from 'react'
import axios from 'axios';
function DiverApplication() {
    const phone=localStorage.getItem('phone');
    const [ride,setRide]=useState({})
      useEffect(() => {
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
            setRide(res.data.data)
        
          })
          .catch((err)=>{
            console.log(err);
          })
  }, []);
  return (
    
    <div>
        
       <h2> DiverApplication</h2>
        
        <div>
        {
            ride.status==='pending'?
            
            <h4>We are woring on your Application</h4>
            
            : <h4>Visit Driver Dashboard</h4>
        }
        </div>
       
        </div>
  )
}

export default DiverApplication