import React, { useContext } from 'react'
import './Coins.css'
import Footer from '../../Components/Footer/Footer'
import bell from '../../../assets/Bell.png'
import coin from '../../../assets/coin.png'
import logo from "../../../assets/Logo.png";
import coin2 from '../../../assets/coin2.png'
import { RideContext } from '../../../context/RideContext'
function Coins() {
  const name=localStorage.getItem('name')
  const {coins}=useContext(RideContext);
  return (
    <>
    <div className="app-container">
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

              <div className="coins-container">
                    <div className="coin-card">
                        
                        <div className="coin-header">
                        <h2>Hello, {name} </h2>
                        {/* <span className="reward-badge">+2 Coins Today</span> */}
                        </div>

                        <div className="coin-body">
                        <div className="coin-info">
                            <p className="label" style={{color:'white'}}>Total Coins</p>
                            <h1 className="coin-amount">{coins}</h1>
                            <p className="sub-text">Keep delivering to earn more rewards</p>
                        </div>

                        <div className="coin-image">
                            <img src={coin2} alt="Coins" />
                        </div>
                        </div>  

                    </div>
                    <div  className='heading'>Use Coins</div>
                    <div style={{display:'flex',flexDirection:'row',background:'white',borderRadius:'10px'}}>
                      
                          
                    </div>
                    
                    </div>
    </div>
    <Footer/>
    </>
  )
}

export default Coins