import React, { useContext, useState } from 'react'
import logo from '../../../assets/Logo.png'
import coin from '../../../assets/coin.png'
import bell from '../../../assets/Bell.png'
import './Order.css'
import Footer from '../../Components/Footer/Footer.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { RideContext } from '../../../context/RideContext.jsx'
import MiniAuto from "../../../assets/blue-miniAuto.png";
import Eloader from "../../../assets/blue-eloader.png";
import ThreeWheeler from "../../../assets/3wheeler.png";
import MiniTruck from "../../../assets/blue-minitruck.png";
import TwoWheeler from "../../../assets/blue-scooter.png";
import drop2 from "../../../assets/drop2.png";
import location from "../../../assets/Location.png"
import profile from "../../../assets/driver2.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import StarRating from '../../Components/StarRating/StarRating.jsx'
function Orders() {
    const {previousRides}=useContext(RideContext)
    const navigate=useNavigate()
      const vehicleImages = {
        bike: { img: TwoWheeler, name: "2 Wheeler" },
        miniAuto: { img: MiniAuto, name: "Mini Auto" },
        ELoader: { img: Eloader, name: "E Loader" },
        miniTruck: { img: MiniTruck, name: "Mini Truck" },
      };
      const [breakup,setBreakup]=useState(null);
      const name=localStorage.getItem('name')
      const phone=localStorage.getItem('phone')
      const handleBreakUp=(id)=>{
          setBreakup(prevId => prevId === id ? null : id)
      }
      const handleBookAgain=(pickupName,pickupAddress,dropName,dropAddress,receiver_name,receiver_phone,productType,landMark,vehcile)=>{
        navigate('/ride',{
            state:{
                pickUp:{
                    name:pickupName,
                    address:pickupAddress
                },
                drop:{
                    name:dropName,
                    address:dropAddress
                },
                receiver_name:receiver_name,
                receiver_phone:receiver_phone,
                productType:productType,
                landmark:landMark,
                vehcile:vehcile
            }
        })
      }
  return (
    <div className='app-container' style={{overflowY:'hidden'}}>

          {/* Header */}
               <header className="header2">
                <Link to="/fare-link"> <img src={logo} alt="" width={120} /></Link> 
                 <div className="header-right">
         
                   <div className="coin-badge">
                     <div style={{ marginLeft: '-10px' }}><img src={coin} alt="" width={22} /></div>
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <span>12 Coins Available </span>
                       <p style={{ fontSize: '7px', fontWeight: '300', paddingTop: '1px' }}>Earn 11 More Coins To Use</p>
                     </div>
         
                   </div>
                   <div><img src={bell} width={26} /></div>
                 </div>
               </header>

          {/* End Of Header */}

          <div className='order-container'>
           <h2 style={{padding:"10px 10px"}}>Orders</h2>
         
                        <div className='past-ride-container' >
                          {
                          previousRides.map((item)=>(
                              <div className="past-ride-div">
                       <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'end'}}>

                        <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'5px'}}>
                              <img src={vehicleImages[item.vehcile].img} alt="" width={50} />
                              <div>
                                  <div style={{fontWeight:'600',alignItems:'center'}}>2 Wheeler  <span style={{color:'green',fontWeight:'600',fontSize:'14px'}}> - ( {item.status} )</span></div>
                                  
                                  <div style={{color:'gray',fontSize:'12px'}}>23 Jan 2026 , 03:53PM ( Order time ) </div>
                                  <div  style={{color:'gray',fontSize:'12px'}}>4.2km (<span> Product type - {item.productType}</span> )</div>
                                  <div  style={{color:'gray',fontSize:'12px'}}></div>
                             </div>
                          
                        </div>
                       
                       
                     </div>
                      {/* Product Type Div Start */}

                                {/* <div className="input-div" style={{padding:'10px 2px'}}>
                                <div className="select-container-div">
                                    <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                       
                                    }}
                                    >
                                    Product type  -&nbsp;{" "}
                                    </div>
                                    <div style={{ fontWeight: "500", fontSize: "13px" }}>
                                    {item.productType}
                                    </div>
                                </div>
                                </div> */}
                                {/* End OF Product Typr Div */}

                                                        {/* Time Container Div End */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            background: "white",
            justifyContent: "space-between",
            zIndex: "5",
            gap: "10px",
            alignItems: "center",
            borderRadius: "10px",
            // boxShadow: "2px 2px 5px gray",
            padding: "10px 0px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img src={profile} alt="" width={45} />

            <div>
              <div style={{ fontWeight: "600" }}>
                Driver Name
              </div>
              <div style={{ fontSize: "12px", color: "gray" }}>UP32 AK 3254</div>
            </div>
          </div>

            
          <div>
              <StarRating rating={3}/>
          </div>
          
          
        </div>



          
                     <div

                    
                              className="info-container3"
                              style={{ zIndex: "7",padding:'0px 10px' }}
                            >
                              <div className="div-info-container" style={{gap:'23px'}}>
                                <div className="location-icon-container">
                                  <img src={location} alt="" width={16} />
                                  <div
                                    style={{
                                      height: "42px",
                                      width: "0px",
                                      border: "none",
                                      marginLeft: "7px",
                                      borderRight: "1px dashed black",
                                    }}
                                  ></div>
                                  <img
                                    src={drop2}
                                    alt=""
                                    width={15}
                                    height={20}
                                    style={{ marginTop: "5px" }}
                                  />
                                </div>
                                <div className="location-name-container">
                                  <div className="pick-up-div">
                                    <div
                                      style={{
                                        color: "green",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Pick Up Location
                                    </div>
                                    <div style={{ fontSize: "12px", fontWeight: "600" }}>
                                      {name}.{phone}
                                    </div>
                                    <div style={{ fontSize: "10px", color: "gray" }}>
                                      {" "}
                                      {item.pickUp.address}
                                    </div>
                                  </div>
                                  <div className="pick-up-div">
                                    <div
                                      style={{ color: "red", fontSize: "14px", fontWeight: "600" }}
                                    >
                                      Drop Location
                                    </div>
                                    <div style={{ fontSize: "12px", fontWeight: "600" }}>
                                      {item.receiver_name}. {item.receiver_phone}
                                    </div>
                                    <div style={{ fontSize: "10px", color: "gray" }}>
                                      {" "}
                                      {item.drop.address}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
      
                          
                            <div style={{padding:'10px 5px',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                <div style={{display:'flex',flexDirection:'column'}}>
                                       <div style={{fontWeight:'600',fontSize:'24px'}}>
                                            ₹{item.fare} 
                                        </div>
                                        <span style={{fontSize:'12px',color:'blue',fontWeight:'300'}} onClick={()=>handleBreakUp(item._id)}> {breakup==item._id?'Hide':'View'} Breakup </span>
                                </div>
                               
                                 
                                   <div style={{background:'blue',color:'white',fontWeight:'400',padding:'8px 15px',borderRadius:'5px',fontSize:'14px'}} onClick={()=>handleBookAgain(item.pickUp.name,item.pickUp.address,item.drop.name,item.drop.address,item.receiver_name,item.receiver_phone,item.productType,item.landmark,item.vehcile)}>Book Again</div>
                            </div>
                            {
                              breakup==item._id?<div style={{
                                width: '100%',
                                // background: '#f5f5f5',
                                borderRadius: '10px',
                                padding: '0px 5px',
                                marginTop: '10px',
                                overflow: 'hidden',
                                animation: 'slideDown 0.4 ease-out',
                                // height:'200px'
                              }}>
                                    <h4>Fare Details</h4>
                                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',fontSize:'13px',fontWeight:'400',padding:'10px 0px',borderBottom:'0.2px solid gray'}}>
                                      <div>Trip Fare</div>
                                      <div>₹148.99</div>
                                    </div>
                                     <div style={{display:'flex',flexDirection:'column',fontSize:'13px',fontWeight:'400',padding:'10px 0px 5px 0px',borderBottom:'0.2px solid gray'}}>
                                      
                                      <div style={{padding:'0px 0px 5px 0px',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                             <div>Fare Without Tax</div>
                                             <div>₹148.00</div>
                                          </div>
                                          <div style={{padding:'0px 0px 5px 0px',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                             <div>CGST Tax</div>
                                             <div>₹0.0</div>
                                          </div>
                                          <div style={{padding:'0px 0px 5px 0px',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                             <div>CGST Tax</div>
                                             <div>₹0.0</div>
                                          </div>
                                    </div>
                                     <div style={{display:'flex',flexDirection:'column',fontSize:'13px',fontWeight:'400',padding:'10px 0px',borderBottom:'0.2px solid gray'}}>
                                      
                                      <div style={{padding:'0px 0px 5px 0px',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                             <div>Rounding</div>
                                             <div>₹0.18</div>
                                          </div>
                                          <div style={{padding:'0px 0px 5px 0px',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                             <div>Total Order Fare</div>
                                             <div>₹149.0</div>
                                          </div>
                                          
                                    </div>
                                    <div style={{fontSize:'13px',fontWeight:'500',padding:'10px 0px',color:'gray'}}>
                                       Payment Details
                                    </div>
                                    <div style={{fontSize:'13px',display:'flex',flexDirection:'row',justifyContent:'space-between',fontWeight:'500'}}>
                                          <div>Cash</div>
                                          <div>₹149.0</div>
                                    </div>
                                 </div>:
                                 ''
                            }
                            
                 </div>
                                  ))
                            }                       
                
                
                 
                 
           </div>
          
      
              
          </div>
         <Footer/>
    </div>
  )
}

export default Orders