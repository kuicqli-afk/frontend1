import React, { useContext, useState } from 'react'
import './Account.css'
import bell from '../../../assets/Bell.png'
import coin from '../../../assets/coin.png'
import logo from "../../../assets/Logo.png";
import { RideContext } from '../../../context/RideContext';
import Footer from '../Footer/Footer';
import profile from '../../../assets/username.png'
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdSupportAgent } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import { BsGiftFill } from "react-icons/bs";
import { IoLanguage } from "react-icons/io5";
import { MdStickyNote2 } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';


function Account() {
    const {coins}=useContext(RideContext)
  
    const navigate=useNavigate();

    const handleLogout=()=>{
        localStorage.removeItem('name');
        localStorage.removeItem('phone');
        localStorage.removeItem('token');
        navigate('/fare-link')

    }
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
                       <div className='view-container'>
                               View details<MdKeyboardArrowRight />
                       </div>
                       <div className='profile-name-container'>
                               <div style={{fontWeight:'500',fontSize:'26px'}}>Full Name</div>
                               <div style={{color:'gray',fontSize:'12px'}}>abcemail@gmail.com</div>
                       </div>

                     
                    </div>
                   
                       


                      <div className='col-container'>
                        <Link to='/coins' style={{color:'black'}}>
                        <div className='row-div-container'>
                             <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'10px'}}>
                              <div style={{background:'#e5e5e5',padding:'5px',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:'5px'}}><GiTwoCoins  size={'25'}/></div>
                              <div>Coins</div>
                             </div>
                          <MdKeyboardArrowRight size={'25'}/>
                       </div>
                        </Link>
                         
                         <div className='row-div-container'>
                             <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'10px'}}>
                              <div style={{background:'#e5e5e5',padding:'5px',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:'5px'}}><BsGiftFill size={'25'}/></div>
                              <div>Refer & Earn</div>
                             </div>
                          <MdKeyboardArrowRight size={'20'}/>
                       </div>
                    </div>


                    <div className="col-container">
                       

                        <div className='row-div-container'>
                             <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'10px'}}>
                              <div style={{background:'#e5e5e5',padding:'5px',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:'5px'}}><MdSupportAgent size={'25'}/></div>
                              <div>Help & Support</div>
                             </div>
                          <MdKeyboardArrowRight size={'25'}/>
                       </div>

                          <div className='row-div-container'>
                             <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'10px'}}>
                              <div style={{background:'#e5e5e5',padding:'5px',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:'5px'}}><IoLanguage  size={'25'}/></div>
                              <div>Change Language</div>
                             </div>
                          <MdKeyboardArrowRight size={'25'}/>
                       </div>


                          <div className='row-div-container'>
                             <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'10px'}}>
                              <div style={{background:'#e5e5e5',padding:'5px',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:'5px'}}><MdStickyNote2  size={'25'}/></div>
                              <div>Terms & Condition</div>
                             </div>
                          <MdKeyboardArrowRight size={'25'}/>
                          <div>
                              
                          </div>
                       </div>


                          <div className='row-div-container' onClick={handleLogout}>
                             <div style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'10px'}}>
                              <div style={{background:'#e5e5e5',padding:'5px',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:'5px'}}><IoIosLogOut  size={'25'}/></div>
                              <div>Logout</div>
                             </div>
                          <MdKeyboardArrowRight size={'25'}/>
                       </div>


                    </div>
                      
              </div>

              <Footer/>
    </div>
  )
}

export default Account