import React, { useEffect, useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import Slider from './Components/Slider/Slider'
import VehicleLoader from './Components/VehicleLoader/VehicleLoader'
import { Route, Routes, useLocation } from 'react-router-dom';
import SignUp from './Components/SignUp/SignUp';
import Footer from './Components/Footer/Footer';
import Section from './Components/Section/Section';
import Service from './Components/Service/Service';
import { ScrollToTopButton } from './Components/ScrollToTopButton/ScrollToTopButton';
import Faq from './Components/FAQ/Faq';
import FareLink from './Components/FareLink/FareLink';
import RiderPartner from './Components/RiderPartner/RiderPartner';
import Dashboard from './Components/DashboardUser/DashboardUser';
import RiderDashboard from './Components/RiderDashboard/RiderDashboard';
import Support from './Components/Support/Support';
import Ride from './Components/Ride/Ride.jsx'
import RideOnWay from './Components/RideOnWay/RideOnWay.jsx'
import RideStarted from './Components/RideStarted/RideStarted.jsx';
import DiverApplication from './Components/DriverApplication/DiverApplication.jsx';
import logo from './assets/Logo.png'
import './App.css'
import MobileAuth from './MobileVersion/Pages/MobileAuth.jsx';
import Home from './MobileVersion/Pages/Home/Home.jsx';
import DeliveryLocation from './MobileVersion/Pages/DilivaryLocation/DilivaryLocation.jsx';
import MobileRide from './MobileVersion/Pages/MobileRide/MobileRide.jsx';
import MobileRideOnWay from './MobileVersion/Pages/MobileRideOnWay/MobileRideOnWay.jsx';
import MobileRideStarted from './MobileVersion/Pages/MobileRideStarted/MobileRideStarted.jsx';
import TempSlider from './Components/TempSlider/TempSlider.jsx';
import ProtectedRoute from './MobileVersion/Components/ProtectedRoute/ProtectedRoute.jsx';
import Orders from './MobileVersion/Pages/Orders/Orders.jsx';
import Coins from './MobileVersion/Pages/Coins/Coins.jsx';
import Account from './MobileVersion/Components/Account/Account.jsx';
function App() {

  const location = useLocation();
  const [showLogo,setShowLogo]=useState(true)

  useEffect(()=>{
    const timer=setTimeout(()=>{
         setShowLogo(false)
    },1500)
  },[])

  const blankPageRoutes = [
    "/user-login",
    "/fare-link",
    "/ride-partner",
    "/support",
    "/search/ride",
    "/ride/confirmed",
    "/ride/started"
  ];

  


  const isBlankPage = blankPageRoutes.includes(location.pathname.toLowerCase());

  const isUser=localStorage.getItem("name");
  return (
    <>
      {/* Layout for homepage and default view */}
      <div className='not-responsive'>
           {!isBlankPage && (
        <>
          <Navbar />
          <TempSlider/>
          <VehicleLoader />
          <Section />
          <Service />
          <ScrollToTopButton />
          <Faq />
          <Footer />
        </>
      )}

      

      <Routes>
        <Route path="/user-login" element={isUser?<Dashboard/>:<SignUp />} />
        <Route path="/fare-link" element={<FareLink />} />
        <Route path="/support" element={<Support />} />
        <Route path="/ride-partner" element={<RiderPartner />} />
        <Route path="/search/ride" element={<Ride/>}/>
        <Route path="/ride/confirmed" element={<RideOnWay/>}/>
        <Route path="/ride/started" element={<RideStarted/>}/>
      </Routes>
      </div>
    

      <div className={`responsive ${showLogo&&'bg-blue'}`} >
          { showLogo?
            <div>
            <img src={logo} alt="" width={250}/>
            </div>
          :
          <div style={{width:"100%"}}>
              <Routes>
                <Route  path='/auth' element={<MobileAuth/>}/>
                  <Route path='/' element={<ProtectedRoute/>}>
                        
                         <Route index element={<Home/>} />
                        <Route  path='fare-link' element={<Home/>}/>
                        <Route  path='ride' element={<DeliveryLocation/>}/>
                        <Route  path='search/ride' element={<MobileRide/>}/>
                        <Route path="ride/confirmed" element={<MobileRideOnWay/>}/>
                        <Route path="ride/started" element={<MobileRideStarted/>}/>
                        <Route path="/orders" element={<Orders/>}/>
                        <Route path="/coins" element={<Coins/>}/>
                        <Route path='/account' element={<Account/>}/>
                  </Route>
                      
   
           
              </Routes>
          </div>
           }
           
      </div>
    </>
  )
}

export default App
