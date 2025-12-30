import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

function RiderDashboard() {
  return (
    <div>
      <Navbar/>
      <div style={{width:"100vb",height:"100vh",padding:"40px"}}>
         <h1>Welcome To <span style={{color:"blue"}}>Rider Dashboard</span></h1>
      </div>
      
      <Footer/>
    </div>
  )
}

export default RiderDashboard
