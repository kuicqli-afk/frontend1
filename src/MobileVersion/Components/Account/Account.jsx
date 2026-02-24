import React, { useContext, useState } from 'react'
import './Account.css'
import bell from '../../../assets/Bell.png'
import coin from '../../../assets/coin.png'
import logo from "../../../assets/Logo.png";
import { RideContext } from '../../../context/RideContext';
import Footer from '../Footer/Footer';
import profile from '../../../assets/username.png'
function Account() {
    const {coins}=useContext(RideContext)
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
                      <p style={{ fontSize: '7px', fontWeight: '300', paddingTop: '1px' }}>Earn 11 More Coins To Use</p>
                    </div>
        
                  </div>
                  <div><img src={bell} width={26} /></div>
                </div>
              </header>

              <div className='account-container'>
                    <div className="profile-container">
                        <div className="profile-div">
                            <div>
                                <img src={profile} alt="" />
                            </div>
                            <div>
                                <div style={{fontSize:'24px',fontWeight:'600'}}>Full Name</div>
                                <div style={{fontSize:'14px'}}><strong>Total Rides</strong>- 22</div>
                                <div style={{fontSize:'14px'}}><strong>Total Coins</strong>- 10</div>
                            </div>
                        </div>
                    </div>
              </div>

              <Footer/>
    </div>
  )
}

export default Account