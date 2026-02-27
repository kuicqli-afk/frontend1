import React from 'react'
import bell from '../../../assets/Bell.png'
import coin from '../../../assets/coin.png'
import logo from "../../../assets/Logo.png";
import { useContext } from 'react';
import { RideContext } from '../../../context/RideContext';
import {Link } from 'react-router-dom'
 import './CoinHistory.css'
function CoinHistory() {
  const {coins}=useContext(RideContext)
  return (
    <div className="app-container">
      
       <header className="header2">
                   <Link to="/fare-link"><img src={logo} alt="" width={120} /></Link>
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


                 <div className='coin-history-container'>
                  

                  
                      <div className="history-container">
                        <h4>Coin Transaction History</h4>
                         <div style={{display:'flex',flexDirection:'row',background:'white',borderRadius:'10px',marginTop:'10px'}}>
                         <div className='coin-history-div'>
                          <div style={{fontSize:'26px',fontWeight:'600',color:'#0000E6'}}>99</div>
                          <div style={{fontSize:'12px',color:'gray'}}>Coin Earned</div>
                         </div>
                         <div className='coin-history-div'>
                          <div style={{fontSize:'26px',fontWeight:'600',color:'#0000E6'}}>₹0</div>
                          <div style={{fontSize:'12px',color:'gray'}}>Used</div>
                         </div>
                      </div>
                      </div>
                     
                 </div>
    </div>
   
  )
}

export default CoinHistory