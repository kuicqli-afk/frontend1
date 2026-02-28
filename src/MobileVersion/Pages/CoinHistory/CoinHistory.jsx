import React, { useContext } from 'react'
import './CoinHistory.css'
import bell from '../../../assets/Bell.png'
import coin from '../../../assets/coin.png'
import logo from "../../../assets/Logo.png";
import bike from '../../../assets/blue-scooter.png'
import coin2 from '../../../assets/coin2.png'
import { RideContext } from '../../../context/RideContext';
import Footer from '../../Components/Footer/Footer';
import { Link } from 'react-router-dom';

function CoinHistory() {
  const {coins,previousRides}=useContext(RideContext);
  return (
    <div className="zpp-container">
             <header className="header2">
                     <Link to="/fare-link"><img src={logo} alt="" width={120} /></Link>
                     <div className="header-right">
             
                       <div className="coin-badge">
                         <div style={{ marginLeft: '-10px' }}><img src={coin} alt="" width={22} /></div>
                         <div style={{ display: 'flex', flexDirection: 'column' }}>
                           <span>{coins} Coins Available </span>
                         <p style={{ fontSize: '7px', fontWeight: '300', paddingTop: '1px' }}>
                                                 {coins >= 25
                                                   ? `You can use Coin!`
                                                   : `Collect ${25 - coins} more coins to use`}
                                     </p>
                         </div>
             
                       </div>
                       <div><img src={bell} width={26} /></div>
                     </div>
                   </header>



                         <div className='coins-history-container'>
                                 <div className='coin-history-div'>
                                    <div style={{fontSize:'24px',fontWeight:'600'}}>Coins Transactions History</div>  
                                    
                                  <div className='display-row' style={{padding:'20px'}}>
                                      <div style={{display:'flex',flexDirection:'column',justifyContent:'center',width:'100%',alignItems:'center',padding:'20px'}}>
                                        <div style={{fontSize:'24px',color:'#0000E6',fontWeight:'600'}}>{coins}</div>
                                        <div style={{color:'gray'}}>Coins Earned</div>
                                      </div>
                                       <div style={{display:'flex',flexDirection:'column',justifyContent:'center',width:'100%',alignItems:'center',padding:'20px'}}>
                                        <div style={{fontSize:'24px',color:'#0000E6',fontWeight:'600'}}>₹0</div>
                                        <div style={{color:'gray'}}>Used</div>
                                      </div>
                                      
                                 </div> 

                                 <div style={{display:'flex',flexDirection:'column',padding:'10px',overflow:'scroll'}}>



                                  {
                                    previousRides.map((item)=>(
                                         <div style={{display:'flex',flexDirection:'column',paddingBottom:'20px',marginTop:'20px',borderBottom:'1px solid gray'}}>
                                       <div className="display-row"style={{justifyContent:'space-between',alignItems:'center'}}>
                                       <div className='display-row' style={{gap:'10px'}}>
                                           <img src={bike} alt="" width={50}/>
                                           <div style={{display:'flex',flexDirection:'column'}}>
                                               <div style={{fontWeight:'500'}}>{item.time.split(',')[0]} &middot; {item.time.split(',')[1]} &middot; ₹{item.fare}</div>
                                               <div style={{color:'gray'}}>2 wheeler</div>
                                           </div>

                                       </div>

                                       <div className="display-row">
                                        <img src={coin} alt="" width={25}/>
                                        <div style={{color:'green',fontSize:'20px',fontWeight:'500'}}>
                                          +{item.coinEarn}
                                        </div>
                                       </div>
                                  </div>
                                  <div style={{display:'flex',flexDirection:'column',padding:'10px',background:'#ededed',borderRadius:'5px'}}>
                                           <div style={{fontSize:'12px',fontWeight:'500',color:'gray'}}>PICKUP FROM</div>
                                           <div style={{fontWeight:'500',fontSize:'14px'}}>{item.pickUp.address.length>50?item.pickUp.address.slice(0,50)+'....':item.pickUp.address}</div>
                                  </div>
                                  </div>
                                    ))
                                  }

                                 
                                  
                                 </div>
                                 

                                 </div>

                                 
                              
                                 

                
    </div>
   
       <Footer/>
    </div>
      
  )
}

export default CoinHistory