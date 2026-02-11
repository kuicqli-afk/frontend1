import React, { useState } from "react";
import "./Navbar.css";

import Logo from "../../assets/Logo.png";
import Address from "../../assets/Address.png";
import Marchentpartner from "../../assets/Marchentpartner.png";

import support from "../../assets/support.png";
import signup from "../../assets/signup.png";
import Rupee from "../../assets/rupee.png";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = localStorage.getItem('name')
  const driver=localStorage.getItem('driver')

  const location = useLocation();

  const doLogout=()=>{
    localStorage.removeItem("name")
    localStorage.removeItem("phone")
    localStorage.removeItem("token")
    if(driver)
    {
      localStorage.removeItem("driver")
    }
  }

  return (
    <>
      <nav className="navbar-container">

        {/* LEFT LOGO */}
        <div className="navbar-left">
          <Link to="/">
            {/* <img src={Logo} alt="Logo" className="navbar-logo" /> */}
            <span style={{fontSize:'52px',color:'white',fontWeight:'700'}}>DELIVER</span>
          </Link>
          <ul>
            <li>
              <img src={Address} alt="" />
              <p>Lucknow City.</p>
            </li>
          </ul>
        </div>

        {/* HAMBURGER BUTTON - MOBILE/TABLET */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* RIGHT MENU */}
        
        <div className={`navbar-right ${menuOpen ? "show-menu" : ""}`}>
          <ul>
          
          <>
           <Link className={`nav-link ${location.pathname === "/fare-link" ? "active" : ""}`} to="/fare-link">
              <li>
                <img src={Rupee} alt="" />
                <p>Fare Link.</p>
              </li>
            </Link>
             {/* <Link className={`nav-link ${location.pathname === "/#" ? "active" : ""}`} to="/#">
              <li>
                <img src={Marchentpartner} alt="" />
                <p>Merchant Partner.</p>
              </li>
            </Link> */}
          
            </>

        
           

           

            

            <Link className={`nav-link ${location.pathname === "/user-login" ? "active" : ""}`} to="/user-login">
              <li>
                <img src={signup} alt="" />
                {
                  name ? <div style={{ display: "flex", flexDirection: "row", color: "white", alignItems: "center", gap: "5px" }}>
                    <div>{name} </div>
                    <div>|</div>
                    <div onClick={doLogout}>
                      Logout
                    </div>
                  </div>
                    : <div style={{color:'white' ,width:"60px",fontWeight:"600"}}>Log In</div>
                }

              </li>
            </Link>

            <Link className="nav-link" to="/support">
              <li>
                <img src={support} alt="" />
                <p>Support.</p>
              </li>
            </Link>

          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
