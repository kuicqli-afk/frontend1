import React from 'react'
import './Footer.css'

import { FaHome, FaBox, FaCoins, FaUser } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation();
  return (
    <nav className="bottom-nav2" style={{ marginTop: "40px", zIndex: "10" }}>
      
      <NavLink 
        to="/fare-link"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <FaHome size="20px"/>
        <span>{t('home')}</span>
      </NavLink>

      <NavLink 
        to="/orders"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <FaBox size="20px"/>
        <span>{t('order')}</span>
      </NavLink>

      <NavLink 
        to="/coins"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <FaCoins size="20px"/>
        <span>{t('coins')}</span>
      </NavLink>

      <NavLink 
        to="/account"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <FaUser size="20px"/>
        <span>{t('account')}</span>
      </NavLink>

    </nav>
  )
}

export default Footer