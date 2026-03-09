import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import bell from '../../../assets/Bell.png'
import coin from '../../../assets/coin.png'
import logo from "../../../assets/Logo.png";
import { RideContext } from '../../../context/RideContext';
import { FaArrowLeft } from "react-icons/fa";
import './ProfileDetails.css'
import axios from 'axios'
import Footer from '../Footer/Footer.jsx'
import { useTranslation } from "react-i18next";
function ProfileDetails() {
    const {coins}=useContext(RideContext)
        const { t } = useTranslation();
    const name=localStorage.getItem('name')
const phone=localStorage.getItem('phone')
const email=localStorage.getItem('email')
    const [edit,setEdit]=useState(false)
    const [profileData,setProfileData] = useState({
        firstName: name,
        lastName: "",
        email: email
        })

const handleChange = (e) => {
  const {name,value} = e.target

  setProfileData(prev => ({
    ...prev,
    [name]: value
  }))
}

const saveProfile = async () => {
  try{

    const res = await axios.post("https://thetest-h9x3.onrender.com/user/change-name",{
      name:profileData.firstName,
      email: profileData.email,
      phone:phone
    })

    console.log(res.data)
    console.log(res.data.data.name)
    localStorage.setItem('name',res.data.data.name)
    localStorage.setItem('email',res.data.data.email)

    setEdit(false)

  }catch(error){
    console.error("Profile update failed",error)
  }
}

  return (
        <div className="app-container">
             {/* Header */}
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

                            <div className="profile-header">
                                <Link to="/account" className="back-btn">
                                <FaArrowLeft />
                                </Link>
                                <span>Profile Details</span>
                            </div>

                            <div className="profile-card">

                                <div className="profile-card-header">
                                <div className="profile-card-title">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Circle-icons-profile.svg" alt="" className="profile-icon"/>
                                    <span>Personal Details</span>
                                </div>

                                <button className="edit-btn" onClick={()=>setEdit(true)}>
                                    Edit
                                </button>
                                </div>

                                <div className="profile-card-body">

                                <div className="profile-info">
                                    <span className="profile-label">{name}</span>
                                    <span className="profile-email">{localStorage.getItem('email')||'Email is not define'}</span>
                                </div>

                                <div className="profile-phone">
                                  {phone}
                                </div>

                                </div>

                            </div>

                            </div>
                                            
                  </div>

                  {
                    edit&&
                    <div className="profile-overlay">

                    <div className="profile-modal">

                        <div className="profile-close" onClick={()=>setEdit(false)}>✕</div>

                        <div className="profile-title">Edit Profile</div>

                        <div className="profile-row2">

                        <div className="profile-input-group">
                            <label className="profile-label">Full Name </label>
                           <input
                                    className="profile-input"
                                    type="text"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleChange}
                                    />
                        </div>

                        {/* <div className="profile-input-group">
                            <label className="profile-label">Last Name</label>
                           <input
                                className="profile-input"
                                type="text"
                                name="lastName"
                                value={profileData.lastName}
                                onChange={handleChange}
                                />
                        </div> */}

                        </div>

                        <div className="profile-input-group">
                        <label className="profile-label">Mobile number</label>
                        <input className="profile-input profile-input-disabled" type="text" value="8177000316" disabled/>
                        <div className="profile-note">Cannot be changed.</div>
                        </div>

                        <div className="profile-input-group">
                        <label className="profile-label">Email Address</label>
                        <input
                            className="profile-input"
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            />
                        </div>

                        <button className="profile-confirm-btn" onClick={saveProfile}>
                        Confirm
                        </button>

                    </div>

                    </div>
                  }
                   
                   <Footer/>
                  </div>
    
  )
}

export default ProfileDetails