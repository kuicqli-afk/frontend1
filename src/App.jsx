import React, { useEffect } from 'react'
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
function App() {

  const location = useLocation();

  const blankPageRoutes = [
    "/user-login",
    "/fare-link",
    "/ride-partner",
    "/support",
    "/search/ride",
    "/ride/confirmed",
    "/ride/started"
  ];

    const isDriver=localStorage.getItem("driver");

  useEffect(() => {
    window.scrollTo(0, 0);
  },[isDriver])

  const isBlankPage = blankPageRoutes.includes(location.pathname.toLowerCase());

  const isUser=localStorage.getItem("name");
  return (
    <>
      {/* Layout for homepage and default view */}
      {!isBlankPage && (
        <>
          <Navbar />
          <Slider />
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
        <Route path="/ride-partner" element={isDriver?<Dashboard/>:<RiderPartner />} />
        <Route path="/search/ride" element={<Ride/>}/>
        <Route path="/ride/confirmed" element={<RideOnWay/>}/>
        <Route path="/ride/started" element={<RideStarted/>}/>
      </Routes>
    </>
  )
}

export default App
