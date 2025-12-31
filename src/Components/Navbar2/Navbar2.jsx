import React, { useState } from "react";


import Logo from "../../assets/Logo.png";
import Address from "../../assets/Address.png";
import Marchentpartner from "../../assets/Marchentpartner.png";
import Rider from "../../assets/RIDER.png";
import support from "../../assets/support.png";
import signup from "../../assets/signup.png";
import Rupee from "../../assets/rupee.png";
import { Link, useLocation } from "react-router-dom";

const Navbar2 = () => {
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
            <img src={Logo} alt="Logo" className="navbar-logo" style={{width: "22vh"}} />
          </Link>
         
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
                    : <p> Sign <span>in</span></p>
                }

              </li>
            </Link>

            <Link className="nav-link" to="/#">
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

export default Navbar2;
