import React from 'react'
import './Ride.css'
import Navbar from '../Navbar/Navbar'
import Navbar2 from '../Navbar2/Navbar2'
function Ride() {
  return (
    <div>
        
        <Navbar2/>
        <div style={{display:'flex',flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            <div style={{padding:"10px"}}>
                <h2>Ride Details</h2>
            </div>
            <div>
                We Are Searching For Your Ride
               <div class="progress-container">
                    <div class="progress-bar"></div>
                    </div>
                    <p>Searching for nearby drivers...</p>
            </div>
        </div>


    </div>
  )
}

export default Ride