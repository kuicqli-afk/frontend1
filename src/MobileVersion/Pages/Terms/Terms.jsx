import React, { useContext, useState } from 'react'
import './Terms.css'
import bell from '../../../assets/Bell.png'
import coin from '../../../assets/coin.png'
import logo from "../../../assets/Logo.png";
import { RideContext } from '../../../context/RideContext';
import { FaChevronRight } from "react-icons/fa";
import Footer from '../../Components/Footer/Footer.jsx';
import { Link } from 'react-router-dom';
function Terms() {
  const {coins}=useContext(RideContext)
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) => {
  setOpenSection(openSection === section ? null : section);
};
  return (
       <div className="app-container">
           <header className="header2">
                    <Link to='/fare-link'>
                         <img src={logo} alt="" width={120} />
                    </Link>
                       
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

                      <div className="account-container">
                        <div className="profile-container">
                          <div style={{display:'flex',flexDirection:'column'}}  onClick={() => toggleSection("privacy")}>
                                   <div style={{padding:'10px',fontSize:'14px',fontWeight:'600',background:'#dfdfdf',borderRadius:'5px',marginTop:'10px',display:'flex',flexDirection:'row',justifyContent:'space-between'}}><div>Privacy Policy</div>
                                   <div> <FaChevronRight  style={{
                                        transform: openSection === "privacy" ? "rotate(90deg)" : "rotate(0deg)",
                                        transition: "0.2s"
                                      }} /></div></div>

                                   {
                                    openSection==='privacy'&&<div style={{padding:'10px',fontSize:'14px'}}>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, veniam. Adipisci voluptatibus quis ratione soluta rem neque, modi atque aperiam obcaecati minima assumenda repellendus sint animi, porro at harum iusto tempora id minus quo necessitatibus? Odio, magni molestias. Earum dolorum quae ducimus eos possimus neque magni id rem ut placeat.
                                   </div>
                                   }
                                   
                          </div>
                            <div style={{display:'flex',flexDirection:'column'}} onClick={()=>toggleSection('terms')}>
                                   <div style={{padding:'10px',fontSize:'14px',fontWeight:'600',background:'#dfdfdf',borderRadius:'5px',marginTop:'10px',display:'flex',flexDirection:'row',justifyContent:'space-between'}}><div>Terms & Conditions</div>
                                   <div> <FaChevronRight  style={{
                                      transform: openSection === "terms" ? "rotate(90deg)" : "rotate(0deg)",
                                      transition: "0.2s"
                                    }} /></div></div>
                                   {
                                    openSection==='terms'&&   <div style={{padding:'10px',fontSize:'14px'}}>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, veniam. Adipisci voluptatibus quis ratione soluta rem neque, modi atque aperiam obcaecati minima assumenda repellendus sint animi, porro at harum iusto tempora id minus quo necessitatibus? Odio, magni molestias. Earum dolorum quae ducimus eos possimus neque magni id rem ut placeat.
                                   </div>
                                   }
                                
                          </div>
                           
                        </div>
                      </div>


                      <Footer/>
       </div>
  )
}

export default Terms