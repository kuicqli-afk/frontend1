import React, { useState } from "react";

import logo from "../../assets/Logo.png";
import './MobileAuth.css'
import MobileLogin from "../Components/MobileLogin/MobileLogin";
import MobileSignUp from "../Components/MobileSignUp/MobileSignUp";
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const MobileAuth = () => {
    const [login ,setLogin]=useState(true)
    const [popUp,setPopUp]=useState()
    
  return (

    <div className="login-wrapper">

        <ToastContainer />
        { popUp &&
              
                <div className='model-overlay' style={{width:'100%',height:"100%",position:'absolute',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',background:'#000000b3',zIndex:'1'}}>
                
                   <div style={{display:'flex',flexDirection:'column',padding:'10px',background:'white',boxShadow:'2px 2px 5px gray',filter:'none',borderRadius:'10px',alignItems:'end'}}>
                   <div style={{color:'blue',border:'1px solid blue',padding:'5px',borderRadius:'20px',cursor:'pointer'}}>
                       <FontAwesomeIcon icon={faXmark}  onClick={()=>setPopUp(false)}/>
                   </div>
                   
                       
                      <div style={{ textAlign:'justify',marginLeft:'20px'}}dangerouslySetInnerHTML={{ __html: popUp }}>
               
                      </div>
                  
                      
                    
                   </div>
            </div>
             } 
      <div className="login-card">
        <img src={logo} alt="SwiftDrop" className="logo" />

        <div className="tabs">
          <button className={`tab ${login?'active':''}`} onClick={()=>setLogin(true)}>Login</button>
          <button className={`tab ${login?'':'active'}`}  onClick={()=>setLogin(false)}>SignUp</button>
        </div>

         

        
         {login?<MobileLogin setPopUp={setPopUp}/> : <MobileSignUp setPopUp={setPopUp}/>}

          
        </div>
        <span style={{marginBottom:'10px',color:'white',position:'fixed',bottom:'0',padding:'10px',fontSize:'12px'}}>
          © 2026 Kuicqli.com, All Rights Reserved
        </span>
      </div>
    
  );
};

export default MobileAuth;
