import React from "react";
import "./Home.css";
import logo from "../../../assets/Logo.png";
import Location from '../../../assets/Location.png'
import slider from "../../../assets/SLIDER.png";
import bike from "../../../assets/2 wheeler-dark.png";
import dilivary from '../../../assets/dilivary.jpg'
import weight2 from '../../../assets/weight2.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import auto from '../../../assets/3 wheeler-dark.png';
import truck from '../../../assets/Mini Truck-dark.png'
import ELoader from '../../../assets/E Loader-dark.png';
import bell from '../../../assets/bell.png'
import coin from '../../../assets/coin.png'
import coupon from '../../../assets/coupon.png'
import blueArrow from '../../../assets/bluearrow.png'
import couponText from '../../../assets/Coupon text.png'
import chiken from '../../../assets/chicken.png'
import groc from '../../../assets/grocwery.png'
import furniture from '../../../assets/furniture.png'
import {
  faBell,
  faHouse,
  faUser,
  faRoute,
  faRightFromBracket,
  faTruck,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { Link} from "react-router-dom";

function Home() {
  return (
   <div className="app-container">
      {/* Header */}
      <header className="header2">
        <img src={logo} alt="" width={120} />
        <div className="header-right">
          
          <div className="coin-badge">
           <div style={{marginLeft:'-10px'}}><img src={coin} alt="" width={22}/></div>
           <div style={{display:'flex',flexDirection:'column'}}>
                <span>12 Coins Available </span>
            <p style={{fontSize:'7px',fontWeight:'300',paddingTop:'1px'}}>Earn 11 More Coins To Use</p>
           </div>
           
          </div>
          <div><img src={bell} width={26}/></div>
        </div>
      </header>

      {/* Location Picker */}
      <div className="location-card">
        <div className="loc-left">
          <div className="loc-pin"><img src={Location} alt="" width={25} /></div>
          <div className="loc-text">
            <label>Pick Up from</label>
            <p>wazirganj Lucknow, Uttar Pradesh 226018...</p>
          </div>
        </div>
       <FontAwesomeIcon icon={faChevronDown} />
      </div>

      {/* Vehicle List */}
      <div className="vehicle-scroll">
        {[
          { name: "2 Wheeler", weight: "40kg", icon: "🏍️",img:bike },
          { name: "Mini Auto", weight: "45kg", icon: "🛺",img:auto },
          { name: "Mini Truck", weight: "48kg", icon: "🚚",img:truck},
           { name: "E Loader", weight: "48kg", icon: "🚚",img:ELoader}
        ].map((v, i) => (
          <div className="v-card" key={i}>
            <div className="v-badge"><div style={{fontSize:'8px',marginTop:'10px',marginBottom:'3px'}}>{v.weight}</div><img src={weight2} width={25} /></div>
            <div className="v-img"><img src={v.img} alt="" width={80} height={50}/></div>
            <h3>{v.name}</h3>
            <p style={{fontSize:'10px',color:'#0000E6',textDecoration:'none'}}>Click to Check Deliver Fare. »</p>
          </div>
        ))}
      </div>

      {/* Coupon */}
         <div className="coupon-div">
            <div style={{padding:'22px 10px 0px 0px',width:'40%'}}>
              <img src={couponText} alt="" width={120}/>
            </div>
            <div style={{borderRight:'1px dashed #0000E6',height:'80%',marginRight:'10px',marginTop
              :'5px'
            }}></div>
            <div style={{width:'80%'}}>
                <div style={{color:'#0000E6',fontSize:'17px',fontWeight:'700',paddingTop:'18px'}}>40 Coupons Available!</div>
                <p style={{color:'gary'}}>This coupon can be applied to our other 
                  products to unlock attractive benefits</p>
            </div>
         </div>

      {/* Hero Text */}
      <div className="hero-section">
        <div className="hero-main">
          <h2>DELIVER</h2>
          <p className="hero-sub">KUCH BHI - KAHIN BHI</p>
        </div>
        <div style={{borderRight:'1px solid white',height:'110px'}}></div>
        <div style={{color:'white'}}>
          <div style={{minWidth:'150px',padding:'10px',fontSize:'19px',fontWeight:'600',paddingTop:'0px',paddingBottom:'5px'}}>
             EXPLORE OUR MORE ONLINE PRODUCTS
          </div>
           <div style={{fontSize:'14px',fontWeight:'300',letterSpacing:'1px',paddingLeft:'10px'}}>
            Shopnow & Enjoy a better Experince
           </div>
        </div>
      </div>
       <div className="design">
           <div className="product">
                <img src={chiken} alt="" />
                <div style={{paddingLeft:'10px'}}>
                    <img src={logo} alt="" width={70}/>
                </div>
                 <p style={{color:'white',fontSize:'7px',paddingLeft:'10px'}}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, dicta?
                 </p>
           </div>
           <div className="product bg-green">
                 <img src={groc} alt="" width={100} style={{marginLeft:'10px'}}/>
           </div>
           <div className="product bg-yello">
                  <img src={furniture} alt="" />
           </div>
       </div>
      {/* Footer Nav */}
      <nav className="bottom-nav">
        <div className="nav-item active">🏠<span>Home</span></div>
        <div className="nav-item">📋<span>Orders</span></div>
        <div className="nav-item">🪙<span>Coins</span></div>
        <div className="nav-item">👤<span>Account</span></div>
      </nav>
    </div>
  );
}

export default Home;
