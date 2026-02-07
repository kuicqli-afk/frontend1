import React from 'react'
import './Footer.css'

import logo from '../../assets/Logo.png'
import { Link } from 'react-router-dom'
import Rider from "../../assets/RIDER.png";

const Footer = () => {
    return (
        <>
            <div className="footer-container">
                <div className="footer-left">
                    {/* <img src={logo} alt="" /> */}
                    <div style={{fontSize:'52px',fontWeight:'700'}}>DELIVER</div>
                    <h3>LUCKNOW’S FIRST ONLINE DELIVERY SERVICE.</h3>
                    <h4>KUCH BHI -KAHIN BHI.</h4>
                    <p>OUR SERVICE JUST AVAILABLE AT LUCKNOW</p>
                </div>

                <div className="footer-middle">
                    <div className="middle-top">
                        <h2>Company</h2>
                        <ul>
                            <li>About Us</li>
                            <li>Careers</li>
                        </ul>
                    </div>
                    <div className="middle-bottom">
                        <h2>Check Fare</h2>
                        <ul className="check-fare-links">
                            <li>
                                <Link to="/fare-link" state={{ vehicle: "2-wheeler" }}>
                                    2 Wheeler
                                </Link>
                            </li>
                            <li>
                                <Link to="/fare-link" state={{ vehicle: "mini-auto" }}>
                                    Mini Auto
                                </Link>
                            </li>
                            <li>
                                <Link to="/fare-link" state={{ vehicle: "e-loader" }}>
                                    E Loader
                                </Link>
                            </li>
                            <li>
                                <Link to="/fare-link" state={{ vehicle: "3-wheeler" }}>
                                    3 Wheeler
                                </Link>
                            </li>
                            <li>
                                <Link to="/fare-link" state={{ vehicle: "mini-truck" }}>
                                    Mini Truck
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-center">
                    <h2>Support</h2>
                    <ul>
                        <li>Contact Us</li>
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                        <li>Terms of Service - SSI</li>
                        <li>Insurance FAQs</li>
                        <li>Driver Partner Terms & Conditions</li>
                        <li>Zero Tolerance Policy</li>
                    </ul>
                </div>

                <div className="footer-right">
                    <div className="right-top">
                        <Link
                            to="/ride-partner"
                            style={{
                                display: "flex",
                                alignItems: "start",
                                gap: "10px",
                                fontSize: "14px",
                                flexDirection:'column',
                                textDecoration: "none",
                                transition: "color 0.2s ease",
                            }}
                     
                            >
                          <div className='rider' >
                                <img
                                src={Rider}
                                alt="Ride Partner"
                                width={60}
                                style={{ opacity: 0.85 }}
                                className='bounce'
                            />
                            <div style={{fontWeight:"600"}}>Become a <br />Ride Partner</div>
                          </div>
                           
                            </Link>

                        <h2>City</h2>
                        <ul>
                            <li>Lucknow</li>
                        </ul>
                    </div>
                    <div className="right-bottom">
                        <h2>Follow Us</h2>
                        <div className="social-icons">
                            <a href="https://www.instagram.com/kuicqli/" target='_blank'><i className="fa-brands fa-instagram"></i></a>
                            <a href="#"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#"><i className="fa-brands fa-pinterest"></i></a>
                            <a href="#"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-divider"></div>
            <div className="footer-bottom">
                <div className="bottom-top">
                    <p>
                        Registerd Office : <br />
                        © 2025 Deliver <br />
                        Zafar Manzil, 185/20, Near Lucknow Christian College, Wazirganj, <br />
                        Golaganj, Lucknow, Uttar Pradesh, India - 226018
                    </p>
                </div>
                <div className="bottom-bottom">
                    <p>
                        GST : U74999MH2014PTC306120 <br />
                        Email : help@deliver.com <br />
                        Phone : 9278000316</p>
                </div>
            </div>
        </>
    )
}

export default Footer
