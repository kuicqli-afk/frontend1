import React, { useState,useEffect } from 'react'
import axios from 'axios';
import logo from '../../assets/Logo.png'
import Navbar from '../Navbar/Navbar';
import './DriverApplication.css'
function DiverApplication() {
    const driver=JSON.parse(localStorage.getItem('driver'));
    
    

   
      useEffect(() => {
     axios.post(
          "https://thetest-h9x3.onrender.com/caption/getCaption",
          { phone: driver.phone },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res)=>{
            console.log(res.data);
            localStorage.setItem('driver','')
            localStorage.setItem('driver',JSON.stringify(res.data.data))
        
          })
          .catch((err)=>{
            console.log(err);
          })
  }, []);
  return (
    
   <div className="status-container">
      <Navbar/>

      <div className="card-wrapper">
        { driver.status==='pending' ? (
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
              <span className="badge">PENDING</span>
              <h1>We’re reviewing your application!</h1>
              <p>
                Our team is currently verifying your documents. This usually takes 24–48 hours. 
                We’ll notify you via email once you're cleared to hit the road.
              </p>

              <div className="progress-stepper">
                <div className="step active">Submitted</div>
                <div className="step current">Reviewing</div>
                <div className="step">Approved</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div className="action-links">
                {/* <button className="secondary-btn">View Submitted Documents</button> */}
                <button className="text-link">Contact Support</button>
              </div>
            </div>
          </div>
        ) : (
          /* APPROVED STATE */
          <div className="status-card approved-state">
            <div className="illustration-area success-icon">
              {/* <div style={{background:"blue",padding:'10px',marginBottom:"20px",width:"50%"}}>
                <img src={logo} alt=""  width={200}/>
              </div>  */}
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" >
                <circle cx="12" cy="12" r="11" fill="#1d52ff" />
                <path d="M7 13l3 3 7-7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="content-area text-center">
              <h1>You’re all ready Registerred With Us {driver.name}!</h1>
              <p>Your application was approved , You can now access your dashboard to start accepting rides.</p>
              
              <a href="/dashboard" className="primary-btn">Go to Dashboard</a>
            </div>
          </div>
        )}
      </div>
      
     
    </div>
  )
}

export default DiverApplication