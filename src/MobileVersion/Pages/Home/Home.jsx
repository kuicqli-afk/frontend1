import React from "react";
import "./Home.css";
import logo from "../../../assets/Logo.png";
import slider from "../../../assets/SLIDER.png";
import bike from "../../../assets/2wheeler.png";
import dilivary from '../../../assets/dilivary.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import auto from '../../../assets/3wheeler.png';
import truck from '../../../assets/Minitruck.png'
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
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <img src={logo} alt="Logo" className="header-logo" />
        <div className="notification-icon">
          <FontAwesomeIcon icon={faBell} />
          <span className="notif-dot"></span>
        </div>
      </header>

      {/* Hero */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${dilivary})` }}
      >
        <div className="hero-overlay">
          <h2>Fast & Reliable Rides</h2>
          <p>Book your ride in seconds</p>
        </div>
      </section>

      {/* Services */}
      <section className="services-grid">
        <Link to="/ride">
        <div className="service-card">
          <img src={bike} alt="Bike" />
          <span>Bike</span>
        </div>
        </Link>
        

          <Link to="/ride">
          <div className="service-card">
                   <img src={auto} alt="" height={40}/>
                    <span>Auto</span>
                  </div>
          </Link>
        

        <Link to="/ride">
        
        <div className="service-card">
          <img src={truck} alt=""  height={40}/>
          <span>Truck</span>
        </div>
        </Link>

      </section>

      {/* Info Section */}
      <section className="info-section">
        <span className="badge">NEW SERVICE</span>
        <h3>Kuiqli Enterprise</h3>
        <p>Manage business logistics with ease.</p>
        <button className="cta-button">Get an Estimate →</button>
      </section>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-item active">
          <FontAwesomeIcon icon={faHouse} />
          <span>Home</span>
        </div>

        <div className="nav-item">
          <FontAwesomeIcon icon={faUser} />
          <span>Profile</span>
        </div>

        <div className="nav-item">
          <FontAwesomeIcon icon={faRoute} />
          <span>Rides</span>
        </div>

        <div className="nav-item">
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Logout</span>
        </div>
      </nav>
    </div>
  );
}

export default Home;
