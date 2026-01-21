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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSleigh, faXmark } from "@fortawesome/free-solid-svg-icons";

const vehcileImages = {
  "Bike": TwoWheeler,
  "Mini Auto": MiniAuto,
  "E-Loader": Eloader,
  "3-Wheeler": ThreeWheeler,
  "Mini Truck": MiniTruck,
};

const RiderPartner = () => {


  const navigate = useNavigate();
  
  // const driver = JSON.parse(localStorage.getItem("driver") || "null");
  const phone = localStorage.getItem("phone") || "";
  const name = localStorage.getItem("name") || "";

  const [data, setData] = useState({ phone: phone, otp: "" });
  const [showOtp, setShowOtp] = useState(false);
  const [showFinalForm, setShowFinalForm] = useState(false);
  const [final,setFinal]=useState(false)
  const [application,setApplication]=useState('')
  const [driver,setDriver]=useState()
  const [loading,setLoading]=useState(false);
  const [popUp,setPopUp]=useState('')
  

  const [finalData, setFinalData] = useState({
    name: driver?.name || name || "",
    email: "",
    phone: data.phone,
    vehcile: "",
    numberPlate:""
  });


useEffect(() => {
  window.scrollTo(0, 0);
}, []);

   // FINAL FORM SUBMIT
  const handleFinalSubmit = async (e) => {
    setLoading(true)
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
        setApplication('pending')
        setShowFinalForm(false);
      } else {
        toast.error(response.data.message || "Submission failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setFinal(true)
    setLoading(false)
  };

  // Initialize the correct step


  // SEND OTP
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    if (!data.phone) {
      toast.error("Please enter your phone number");
      setLoading(false)
      return;
    }
    try {
      const response = await axios.post("https://thetest-h9x3.onrender.com/caption/send-otp", { phone: data.phone });
      if (response.data.success) {
      
          toast.success(response.data.message);
          if(response.data.application)
          {
            setApplication(response.data.application)
            setDriver(response.data.data)
            console.log(application)
            
          }else{
           
            setShowOtp(true)
          }
       
      } else {
         setPopUp(response.data.message)
        // toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
    setLoading(false)

  };

  // VERIFY OTP
  const handleSubmit2 = async (e) => {
    setLoading(true)
    e.preventDefault();
    if (!data.otp) {
      toast.error("Please enter OTP");
      setLoading(false)
      return;
    }
   
      const response = await axios.post("https://thetest-h9x3.onrender.com/caption/caption/varify-otp", { phone: data.phone, otp: data.otp });
      console.log(response);
      if (response) {
        console.log(response.data);
        if(response.data.driver){
          //  localStorage.setItem("driver",JSON.stringify(response.data.driver));
           toast.success("OTP Verified Successfully!");

          
           setShowOtp(false);
           setShowFinalForm(true);
        }else{
       
          toast.error('No Driver Registeration Found By This Number')
        }
      
      } else {
        toast.error(response.data.message);
      }
     setLoading(false)
  };

 

  return (
    <>
      <ToastContainer />
       {popUp&&
                    
                      <div className='model-overlay' style={{width:'100%',height:"100vh",position:'absolute',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',background:'#000000b3',zIndex:'1'}}>
                      
                         <div style={{display:'flex',flexDirection:'column',padding:'30px',background:'white',boxShadow:'2px 2px 5px gray',filter:'none',borderRadius:'10px',alignItems:'end'}}>
                         <div style={{color:'blue',border:'1px solid blue',padding:'10px',borderRadius:'20px',cursor:'pointer'}}>
                             <FontAwesomeIcon icon={faXmark}  onClick={()=>setPopUp(false)}/>
                         </div>
                         <div style={{display:'flex',flexDirection:'row',padding:'60px',background:'white',alignItems:'center',borderRadius:'5px',width:'800px',justifyContent:'center',alignItems:'center',paddingTop:'20px'}}>
                              <div style={{color:'blue',fontSize:'30px',border:'1px solid blue',borderRadius:'30px',padding:'5px',width:'45px',height:"45px",textAlign:'center', fontWeight:'500'}}>
                               i 
                            </div>
                            <div style={{marginLeft:'10px', textAlign:'justify',marginLeft:'20px'}}dangerouslySetInnerHTML={{ __html: popUp }}>
                     
                            </div>
                         </div>
                            
                          
                         </div>
                  </div>
                  }
      {application && (
  <div className="modal-overlay">
    {application === 'pending' ? (
      /* PENDING STATE */
      <div className="status-card pending-state">
        
        <div className="illustration-area">
          
           <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:"20px"}}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
                <path d="M20.2 7.8c.4 1.2.6 2.5.6 3.9 0 5.5-4.5 10-10 10S1.4 17.2 1.4 11.7 5.9 1.7 11.4 1.7c1.4 0 2.7.3 3.9.8" strokeDasharray="2 2"/>
                <rect x="15" y="2" width="7" height="9" rx="1" fill="#eff6ff" />
                <line x1="17" y1="5" x2="20" y2="5" />
                <line x1="17" y1="7" x2="20" y2="7" />
              </svg>
        </div>

        <div className="content-area">
          <div style={{display:"flex",flexDirection:'row',justifyContent:'end',padding:"10px"}}>
             
          
           <button  style={{padding:"5px",borderRadius:"20px",background:'white',color:'blue', border:'1px solid blue',cursor:'pointer'}} onClick={()=>{setApplication('');navigate('/')}}><FontAwesomeIcon icon={faXmark}/></button>
          </div>
         <span className="badge">PENDING</span>
          <h1>We’re reviewing your application!</h1>
          <p>
            Our team is currently verifying your documents. This usually takes
            24–48 hours.
          </p>

          <div className="progress-stepper">
            <div className="step active">Submitted</div>
            <div className="step current">Reviewing</div>
            <div className="step">Approved</div>
            {/* <div className="progress-bar">
              <div className="progress-fill" style={{ width: "50%" }} />
            </div> */}
          </div>

          <button className="text-link">Contact Support</button>
        </div>
      </div>
    ) : (
      /* APPROVED STATE */
      <div className="status-card approved-state">
        <div className="illustration-area success-icon">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" >
                <circle cx="12" cy="12" r="11" fill="#1d52ff" />
                <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
        </div>

        <div className="content-area text-center">
          <h1>You’re all ready Registered With Us {driver?.name}!</h1>
          <p>
            Your application was approved. You can now access your dashboard.
          </p>
          <div className="btn-container">
            <a href="https://driver-n7zj.onrender.com" className="primary-btn">
            Go to Dashboard
          </a>
          <button className="close-btn" onClick={()=>{setApplication('');navigate('/')}}>Close</button>
          </div>
          
        </div>
      </div>
    )}
  </div>
)}

    


 
      <Navbar/>





      
      <div className="rider-top"style={application ? { filter:"blur(5px)" } : {}}
>
        <div className="rider-card">
          <div className="rider-left">
            <img src={arrow} alt="" />
          </div>
          <form>
            <div className="rider-right">
              {/* FINAL FORM */}
              {showFinalForm ? (
                <>
               
                 
                  <div className="input-row">
                    <img src={Profile} className="input-icon" alt="" />
                    <input
                      type="text"
                      value={finalData.name}
                      onChange={(e) => setFinalData({ ...finalData, name: e.target.value })}
                 
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
                      placeholder="Enter your Email ID*(Optional)"
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
                    
                   
                  <button className="otp-btn" type="button" onClick={handleFinalSubmit}>
                    {loading?'Submitting..':'Submit'}
                  </button>
              
                 
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
                    {loading?'Varifying OTP':'Verify OTP'}
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
                    {loading?'Requesting...':
                    'Request OTP'}

                  </button>

                 
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
