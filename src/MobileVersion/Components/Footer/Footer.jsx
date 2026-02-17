import React from 'react'
import './Footer.css'

import { FaHome } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
function Footer() {
  return (
     <nav className="bottom-nav2" style={{ marginTop: "40px", zIndex: "10" }}>
        <Link to='/fare-link'>
        <div className="nav-item active">
          <FaHome size="20px"/><span>Home</span>
        </div>
        </Link>
        
        <Link to="/orders">
          <div className="nav-item">
            <FaBox size="20px"/><span>Orders</span>
          </div>
        </Link>
        <div className="nav-item">
          <FaCoins size="20px"/><span>Coins</span>
        </div>
        <div className="nav-item">
          <FaUser size="20px"/><span>Account</span>
        </div>
      </nav>
  )
}

export default Footer