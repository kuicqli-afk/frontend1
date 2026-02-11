import React, { useEffect, useState } from "react";
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
import bell from '../../../assets/Bell.png'
import coin from '../../../assets/coin.png'
// import coupon from '../../../assets/Coupon.png'
import blueArrow from '../../../assets/bluearrow.png'
import couponText from '../../../assets/Coupon text.png'
import chiken from '../../../assets/chicken.png'
import groc from '../../../assets/grocwery.png'
import furniture from '../../../assets/furniture.png'
import sharwma from '../../../assets/sharwma.png'
import pizza from '../../../assets/pizza.png'
import bhatura from '../../../assets/Bhatura.png'
import driverRegistration from '../../../assets/driverRegistration.png'
import whitearrow from '../../../assets/whitearrow.png'
import burger from '../../../assets/burger.png'
import cookie from '../../../assets/cookies.png'
import driverRegistration2 from '../../../assets/driverRegistration2.png'
import sweet from '../../../assets/sweet.png'
import {
  faBell,
  faHouse,
  faUser,
  faRoute,
  faRightFromBracket,
  faTruck,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Home() {
  const img = [chiken, sharwma, pizza, bhatura, burger, cookie, sweet];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % img.length);
    }, 800); // ⏱ 2 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header2">
        <img src={logo} alt="" width={120} />
        <div className="header-right">

          <div className="coin-badge">
            <div style={{ marginLeft: '-10px' }}><img src={coin} alt="" width={22} /></div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>12 Coins Available </span>
              <p style={{ fontSize: '7px', fontWeight: '300', paddingTop: '1px' }}>Earn 11 More Coins To Use</p>
            </div>

          </div>
          <div><img src={bell} width={26} /></div>
        </div>
      </header>

      {/* Location Picker */}
      <div className="location-card">
        <div className="loc-left">
          <div className="loc-pin"><img src={Location} alt="" width={25} /></div>
          <Link to='/ride'>
            <div className="loc-text">
              <label>Pick Up from</label>
              <p>wazirganj Lucknow, Uttar Pradesh 226018...</p>
            </div>
          </Link>

        </div>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>

      {/* Vehicle List */}
      <div className="vehicle-scroll">
        {[
          { name: "2 Wheeler", weight: "20kg", icon: "🏍️", img: bike },
          { name: "Mini Auto", weight: "45kg", icon: "🛺", img: auto },
          { name: "E Loader", weight: "400kg", icon: "🚚", img: ELoader },
          { name: "3 Wheeler", weight: "550kg", icon: "🚚", img: ELoader },
          { name: "Mini Truck", weight: "720kg", icon: "🚚", img: truck },
        ].map((v, i) => (
          <Link to='/ride'>
            <div className="v-card" key={i}>
              <div className="v-badge"><div style={{ fontSize: '8px', marginTop: '10px', marginBottom: '3px' }}>{v.weight}</div><img src={weight2} width={25} /></div>
              <div className="v-img"><img src={v.img} alt="" width={80} height={45} /></div>
              <h3>{v.name}</h3>
              <p style={{ fontSize: '10px', color: '#0000E6', textDecoration: 'none' }}>Click to Check Deliver Fare. »</p>
            </div></Link>

        ))}
      </div>

      {/* Coupon */}
      <div className="coupon-div">
        <div style={{ padding: '7px 10px 0px 0px', width: '40%' }}>
          <img src={couponText} alt="" width={120} />
        </div>
        <div style={{
          borderRight: '1px dashed #0000E6', height: '80%', marginRight: '10px', marginTop
            : '5px'
        }}></div>
        <div style={{ width: '80%' }}>
          <div style={{ color: '#0000E6', fontSize: '17px', fontWeight: '700', }}>40 Coupons Available!</div>
          <p style={{ color: 'gary' }}>This coupon can be applied to our other
            products to unlock attractive benefits</p>
        </div>
      </div>

      {/* Hero Text */}
      <div className="hero-section">
        <div className="hero-main">
          <h2>DELIVER</h2>
          <p className="hero-sub"><i>KUCH BHI KAHIN BHI.</i></p>
        </div>
        {/* <div style={{borderBottom:'1px solid white',height:'110px',width:'100%',height:'5px'}}></div> */}
        <div style={{
          color: 'white', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ minWidth: '150px', padding: '10px', fontSize: '15px', fontWeight: '800', marginTop: "-10px"}}>
            EXPLORE OUR MORE ONLINE PRODUCTS
          </div>
          <div style={{ fontSize: '13px', fontWeight: '300', letterSpacing: '1px', paddingLeft: '10px', marginRight: '15px', marginTop: "-10px" }}>
            <span style={{ fontWeight: '700' }}> <i>SHOP NOW </i> </span>& Enjoy a better Experince
          </div>
        </div>
      </div>

      <div className="design">
        <div className="product">
          <div className="product-image-slider">
            <img src={img[current]} alt="" className="product-img" />
          </div>

          <div className="product-logo-wrapper">
            <img src={logo} alt="" className="product-logo" />
          </div>

          <p className="product-text">
            for restaurants & cloud kitchens.
          </p>

          <img src={whitearrow} alt="" className="product-arrow" />
        </div>

        <div className="product bg-green">
          <div className="product-image-slider">
            <img src={img[current]} alt="" className="product-img" />
          </div>

          <div className="product-logo-wrapper">
            <img src={logo} alt="" className="product-logo" />
          </div>

          <p className="product-text">
            for grocery & daily-needs
          </p>

          <img src={whitearrow} alt="" className="product-arrow" />
        </div>

        <div className="product bg-yello">
          <div className="product-image-slider">
            <img src={img[current]} alt="" className="product-img" />
          </div>

          <div className="product-logo-wrapper">
            <img src={logo} alt="" className="product-logo" />
          </div>

          <p className="product-text">
             for restaurants & cloud kitchens.
          </p>

          <img src={whitearrow} alt="" className="product-arrow" />
        </div>
      </div>

      <div className="driver-registration">

        <img src={driverRegistration} alt="" style={{ width: '100%', marginTop: '5px'}} />
        <img src={driverRegistration2} alt="" style={{ width: '100%', marginTop: '10px' }} />


      </div>
      {/* Footer Nav */}
      <nav className="bottom-nav2">
        <div className="nav-item active">🏠<span>Home</span></div>
        <div className="nav-item">📋<span>Orders</span></div>
        <div className="nav-item">🪙<span>Coins</span></div>
        <div className="nav-item">👤<span>Account</span></div>
      </nav>
    </div>
  );
}

export default Home;
