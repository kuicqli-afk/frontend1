import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import logo from "../../../assets/Logo.png";
import Location from '../../../assets/Location.png'
import slider from "../../../assets/SLIDER.png";
import bike from "../../../assets/2 wheeler-dark.png";
import dilivary from '../../../assets/dilivary.jpg'
import weight2 from '../../../assets/weight2.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import auto from '../../../assets/mini-auto2.png';
import truck from '../../../assets/Mini Truck-dark.png'
import eloader from '../../../assets/3 wheeler-dark.png';
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
import grocery1 from '../../../assets/Grocery 1.png'
import grocery2 from '../../../assets/Grocery 2.png'
import grocery3 from '../../../assets/Grocery 3.png'
import grocery4 from '../../../assets/Grocery 4.png'
import grocery5 from '../../../assets/Grocery 5.png'
import Es1 from '../../../assets/E1.png'
import Es2 from '../../../assets/E2.png'
import Es3 from '../../../assets/E3.png'
import Es4 from '../../../assets/E4.png'
import Es5 from '../../../assets/E5.png'
import Es6 from '../../../assets/E6.png'
import Es7 from '../../../assets/E7.png'
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
import { RideContext } from "../../../context/RideContext";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";

function Home() {
  const img = [chiken, sharwma, pizza, bhatura, burger, cookie, sweet];
  const grock =[ grocery1,grocery2,grocery3,grocery4,grocery5,grocery1,grocery2]
  const E =[Es1,Es2,Es3,Es4,Es7,Es2,Es3];
  const [current, setCurrent] = useState(0);
  const [current2, setCurrent2] = useState(0);
  const [current3, setCurrent3] = useState(0);
  const {setVehicle}=useContext(RideContext);
  const {previousRides}=useContext(RideContext)
  const [lastRide,setLastRide]=useState()
  const phone=localStorage.getItem('phone')
  const {coins}=useContext(RideContext);
  //Getting Details About Last Ride
 useEffect(() => {
  if (!previousRides || previousRides.length === 0) return;
  // console.log(previousRide);
  const lr = previousRides.at(-1);
  setLastRide(lr)
}, [previousRides]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % img.length);
    }, 1000); // ⏱ 2 seconds
     const interval2 = setInterval(() => {
      setCurrent2((prev) => (prev + 1) % img.length);
    }, 1200); // ⏱ 2 seconds
     const interval3 = setInterval(() => {
      setCurrent3((prev) => (prev + 1) % img.length);
    }, 1500);


    return () => clearInterval(interval,interval2,interval3); // cleanup
  }, []);

 useEffect(()=>{

 },[])

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header2">
        <img src={logo} alt="" width={120} />
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
              <p>{lastRide?lastRide.pickUp.address:'Enter Pick Up Location'}</p>
            </div>
          </Link>

        </div>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>

      {/* Vehicle List */}
      <div className="vehicle-scroll">
        {[
          { name: "2 Wheeler", weight: "20kg", icon: "🏍️", img: bike ,name2:'bike'},
          { name: "Mini Auto", weight: "45kg", icon: "🛺", img: auto ,name2:'miniAuto'},
          { name: "E Loader", weight: "400kg", icon: "🚚", img: ELoader,name2:'Eloader' },
          { name: "3 Wheeler", weight: "550kg", icon: "🚚", img: eloader, name2:'Wheeler'},
          { name: "Mini Truck", weight: "720kg", icon: "🚚", img: truck ,name2:'miniTruck'},
        ].map((v, i) => (
          <Link to='/ride' onClick={()=>{
            setVehicle(v.name2)
          }} key={i}>
            <div className="v-card">
              <div className="v-badge"><div style={{ fontSize: '8px', marginTop: '10px', marginBottom: '3px' }}>{v.weight}</div><img src={weight2} width={25} /></div>
              <div className="v-img"><img src={v.img} alt="" width={95} height={50} /></div>
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
             restaurants & cloud kitchens.
          </p>

          <img src={whitearrow} alt="" className="product-arrow" />
        </div>

        <div className="product bg-green">
          <div className="product-image-slider">
            <img src={grock[current2]} alt="" className="product-img" />
          </div>

          <div className="product-logo-wrapper">
            <img src={logo} alt="" className="product-logo" />
          </div>

          <p className="product-text">
             grocery & daily-needs
          </p>

          <img src={whitearrow} alt="" className="product-arrow" />
        </div>

        <div className="product bg-yello">
          <div className="product-image-slider">
            <img src={E[current3]} alt="" className="product-img" />
          </div>

          <div className="product-logo-wrapper">
            <img src={logo} alt="" className="product-logo" />
          </div>

          <p className="product-text">
              restaurants & cloud kitchens.
          </p>

          <img src={whitearrow} alt="" className="product-arrow" />
        </div>
      </div>

      <div className="driver-registration">

        <img src={driverRegistration} alt="" style={{ width: '100%', marginTop: '5px'}} />
        <img src={driverRegistration2} alt="" style={{ width: '100%', marginTop: '10px' }} />


      </div>
      {/* Footer Nav */}
     <Footer/>
    </div>
  );
}

export default Home;
