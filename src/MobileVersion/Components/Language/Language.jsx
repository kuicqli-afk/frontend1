import React, { useContext, useState } from 'react'
import logo from '../../../assets/Logo.png'
import coin from '../../../assets/coin.png'
import bell from '../../../assets/Bell.png'
import { RideContext } from '../../../context/RideContext'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import Footer from '../Footer/Footer'
import i18n from "i18next";
function Language() {
    const {coins}=useContext(RideContext)

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);        // switch language
    // localStorage.setItem("lang", lang); // save preference
    setlang(lang)
  }
    const [lang,setlang]=useState('en')
  return (
    <div className="app-container">
             <header className="header2">
                <Link to="/fare-link"> <img src={logo} alt="" width={120} /></Link> 
                 <div className="header-right">
         
                   <div className="coin-badge">
                     <div style={{ marginLeft: '-10px' }}><img src={coin} alt="" width={22} /></div>
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <span>{coins} Coins Available </span>
                         <p style={{ fontSize: '7px', fontWeight: '300', paddingTop: '1px' }}>
                          {coins > 25
                            ? `You can use Coin!`
                            : `Collect ${25 - coins} more coins to use`}
                          </p>
                     </div>
         
                   </div>
                   <div><img src={bell} width={26}/></div>
                 </div>
               </header>

              <div className="account-container">
                
               <div
  style={{
    padding: "15px",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  }}
>
  {/* Header */}
  <div
    style={{fontSize: "17px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderBottom: "1px solid #eee",
      paddingBottom: "10px",
      cursor: "pointer"}}


  >
    <FaArrowLeft size={16} />
    <span>Change Language</span>
  </div>

  {/* Language Options */}
  <div
    style={{
      marginTop: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }}
  >
    <div
      style={lang==='hi'?{
        
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #0000E6",
        cursor: "pointer",
        transition: "0.2s",
        fontSize: "14px",
        fontWeight: "600",
        color:'#0000E6'
      
      }:{
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #eee",
        cursor: "pointer",
        transition: "0.2s",
        fontSize: "14px",
        fontWeight: "600"
      }}

          onClick={()=>changeLanguage('hi')}
    >
      हिंदी
    </div>

    <div
      style={lang=='en'?{
        padding: "10px",
        borderRadius: "6px",
          border: "1px solid #0000E6",
          color:'#0000E6',
        cursor: "pointer",
        transition: "0.2s",
        fontSize: "14px",
        fontWeight: "500"

      }:{ padding: "10px",
        borderRadius: "6px",
                border: "1px solid #eee",
           
        cursor: "pointer",
        transition: "0.2s",
        fontSize: "14px",
        fontWeight: "500"}}

        onClick={()=>changeLanguage('en')}
    >
      English
    </div>
  </div>
</div>
                  
              
              </div>

              <Footer/>
    </div>
  )
}

export default Language