import React, { useState, useEffect } from 'react';
import './RiderPartner.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { ScrollToTopButton } from '../ScrollToTopButton/ScrollToTopButton';
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import RiderBg from "../../assets/riderbg.png";
import Daala from "../../assets/daala.png";
import man from "../../assets/man.png";
import arrow from "../../assets/arrow.png";

import TwoWheeler from "../../assets/2wheelernew.png";
import MiniAuto from "../../assets/miniautonew.png";
import Eloader from "../../assets/Eloadernew.png";
import ThreeWheeler from "../../assets/3wheelernew.png";
import MiniTruck from "../../assets/Minitrucknew.png";

import Profile from '../../assets/greencircle.png';
import Number from '../../assets/Drop.png';
import Phone from '../../assets/phonenumber.png';
import Mail from '../../assets/username.png';
import Vehicle from '../../assets/username.png';
import RiderSection from '../RiderPage/RiderSection';

const vehcileImages = {
  "Bike": TwoWheeler,
  "Mini Auto": MiniAuto,
  "E-Loader": Eloader,
  "3-Wheeler": ThreeWheeler,
  "Mini Truck": MiniTruck,
};

const RiderPartner = () => {


  const navigate = useNavigate();
  
  const driver = JSON.parse(localStorage.getItem("driver") || "null");
  const phone = localStorage.getItem("phone") || "";
  const name = localStorage.getItem("name") || "";

  const [data, setData] = useState({ phone: phone, otp: "" });
  const [showOtp, setShowOtp] = useState(false);
  const [showFinalForm, setShowFinalForm] = useState(false);
  const [final,setFinal]=useState(false)

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
            navigate('/ride-partner')    
        
          })
          .catch((err)=>{
            console.log(err);
          })
  }, []);

  const [finalData, setFinalData] = useState({
    name: driver?.name || name || "",
    email: "",
    phone: data.phone,
    vehcile: "",
    numberPlate:""
  });

   // FINAL FORM SUBMIT
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const submitData = { ...finalData, phone: data.phone };
    console.log(submitData);

    try {
      const response = await axios.post(
        'https://thetest-h9x3.onrender.com/caption/register',
        submitData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        toast.success("Form submitted successfully!");
        console.log(response.data)
        localStorage.setItem("driver",JSON.stringify(response.data.data));
        localStorage.setItem("name", response.data.data.name)
      } else {
        toast.error(response.data.message || "Submission failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setFinal(true)
  };

  // Initialize the correct step
  useEffect(() => {
    if (driver) {
      setShowFinalForm(true);
    } else if (phone) {
      setShowFinalForm(true);
    }
  }, [driver, phone,final,name]);

  // SEND OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.phone) {
      toast.error("Please enter your phone number");
      return;
    }
    try {
      const response = await axios.post("https://thetest-h9x3.onrender.com/caption/send-otp", { phone: data.phone });
      if (response.data.success) {
        setShowOtp(true);
        toast.success(response.data.message);
       
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

  // VERIFY OTP
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (!data.otp) {
      toast.error("Please enter OTP");
      return;
    }
    try {
      const response = await axios.post("https://thetest-h9x3.onrender.com/caption/caption/varify-otp", { phone: data.phone, otp: data.otp });
      console.log(response);
      if (response.data) {
        console.log(response.data);
        if(response.data.driver){
           localStorage.setItem("driver",JSON.stringify(response.data.driver));
           localStorage.setItem("name", response.data.driver.name)
           localStorage.setItem("phone", response.data.driver.phone)
        }
        localStorage.setItem("name", response.data.user.name)
        localStorage.setItem("phone", response.data.user.phone)
        toast.success("OTP Verified Successfully!");
        navigate("/ride-partner");
        setShowOtp(false);
        setShowFinalForm(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

 

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="rider-top">
        <div className="rider-card">
          <div className="rider-left">
            <img src={arrow} alt="" />
          </div>
          <form>
            <div className="rider-right">
              {/* FINAL FORM */}
              {showFinalForm ? (
                <>
                {
                  driver?<h2>Welcome To Your Profile</h2>: <h2>Attach Vehicle Now</h2>
                }
                 
                  <div className="input-row">
                    <img src={Profile} className="input-icon" alt="" />
                    <input
                      type="text"
                      value={finalData.name}
                      onChange={(e) => setFinalData({ ...finalData, name: e.target.value })}
                      readOnly={!!driver?.name || !name}
                      placeholder="Enter your Name*"
                    />
                  </div>

                     <div className="input-row">
                  <img src={Phone} className="input-icon" alt="" />
                    <input type="text" value={data.phone} disabled />
                  </div>
                  
                      <div className="input-row">
                    <img src={Mail} className="input-icon" alt="" />
                    <input
                      type="email"
                      placeholder="Enter your Email ID*"
                      value={driver?driver.email:finalData.email}
                      onChange={(e) => setFinalData({ ...finalData, email: e.target.value })}
                    />
                  </div>
                  

                  <div className="double-row">
                    <div className="input-row small">
                      <img src={Number} className="input-icon" alt="" />
                      <select value="Lucknow" disabled>
                        <option value="Lucknow">LUCKNOW CITY</option>
                      </select>
                    </div>


                    

                    <div className="input-row small vehicle-select-row">
                      <img
                        src={finalData.vehcile ? vehcileImages[finalData.vehcile]: ( driver ?vehcileImages[driver.vehcile]  :"")}
                        alt={finalData.vehcile || "Vehicle"}
                        className="vehicle-dropdown-image"
                      />
                      <select
                        value={finalData.vehcile}
                        onChange={(e) => setFinalData({ ...finalData, vehcile: e.target.value })}
                      >
                        <option value={driver?driver.vehcileType:""}>{driver?driver.vehcile:"Select Vehcile"}</option>
                        <option value="Bike">Bike</option>
                        <option value="Mini Auto">Mini Auto</option>
                        <option value="E-Loader">E-Loader</option>
                        <option value="3-Wheeler">3-Wheeler</option>
                        <option value="Mini Truck">Mini Truck</option>
                      </select>
                    </div>
                  </div>
                   <div className="input-row">
                    {/* <img src={Phone} className="input-icon" alt="" /> */}
                    <input type="text"  placeholder='Number Plate'  value={driver?driver.numberPlate:finalData.numberPlate} onChange={(e)=>setFinalData({...finalData,numberPlate:e.target.value})}/>
                  </div>
                

                  <p className="agree-text">
                    By continuing, you agree to kuicqli’s
                    <a href="#"> Terms of use </a> and
                    <a href="#"> Privacy Policy</a>.
                  </p>
                    
                    {
                      driver
                      ?
                  <div style={{display:"flex" ,flexDirection:"row", gap:"10px"}}>
                  <button className="otp-btn" type="button">
                    Edit
                  </button>
                  <button className="otp-btn" type="button" >
                    Delete
                  </button>
                   </div>
                      :
                  <button className="otp-btn" type="button" onClick={handleFinalSubmit}>
                    Submit
                  </button>
                    }
                 
                </>
              ) : showOtp ? (
                // OTP FORM
                <>
                  <h2>Enter OTP</h2>
                  <div className="phone-row">
                    <input
                      type="text"
                      className="mobile-input"
                      placeholder="Enter OTP"
                      maxLength={6}
                      value={data.otp}
                      onChange={(e) => setData({ ...data, otp: e.target.value })}
                    />
                  </div>
                  <button className="otp-btn" type="button" onClick={handleSubmit2}>
                    Verify OTP
                  </button>
                </>
              ) : (
                // PHONE FORM
                <>
                  <div className="rider-text">
                    <h3>RIDE PARTNER.</h3>
                    <h4>
                      Have a Mini Auto, E-Loader, 3-Wheeler, Mini Truck, or Bike?
                    </h4>
                    <p>
                      Join our delivery network and start earning today. Deliver goods,
                      couriers, and packages — choose part-time or full-time and get
                      daily job opportunities.
                    </p>
                  </div>

                  <h2>Enter mobile number</h2>
                  <div className="phone-row">
                    <span className="country-code">+91</span>
                    <input
                      type="text"
                      className="mobile-input"
                      placeholder="Enter mobile number"
                      value={data.phone}
                      onChange={(e) => setData({ ...data, phone: e.target.value })}
                    />
                    
                  </div>

                  <p className="agree-text">
                    By continuing, you agree to kuicqli’s
                    <a href="#"> Terms of use </a> and
                    <a href="#"> Privacy Policy</a>.
                  </p>

                  <button className="otp-btn" type="button" onClick={handleSubmit}>
                    Request OTP
                  </button>

                  <p className="bottom-text-rider">
                    New to kuicqii? <a href="#">Create an account</a>
                  </p>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
      <RiderSection/>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default RiderPartner;
