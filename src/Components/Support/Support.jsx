import React from 'react'
import './Support.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { ScrollToTopButton } from '../ScrollToTopButton/ScrollToTopButton'

import Bluehome from "../../assets/Bluehome.png";
import Bluebike from "../../assets/Bluebike.png";
import UserBlue from "../../assets/userblue.png";
import arrow from "../../assets/arrow.png";

const Support = () => {
    return (
        <>
            <Navbar />

            <div className="support-container">
                <div className="support-card">

                    {/* LEFT BLUE ARROW */}
                    <div className="support-left">
                        <img src={arrow} alt="arrow" />
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="support-right">
                        <div className="support-content">
                            <div className="support-text">
                                <h2>Our Support</h2>
                                <p>Need help? We're here for you! Just connect with us through the options below.</p>
                            </div>
                            <div className="support-row">
                                <div className="left">
                                    <img src={Bluehome} className="icon" alt="marchent" />
                                    <h2>Marchent <br /> Support.</h2>
                                </div>

                                <div className="divider"></div>

                                <div className="right">
                                    <p>
                                        By continuing, you agree to kuicqli’s
                                        <span className="link"> Terms of use </span>
                                        and
                                        <span className="link"> Privacy Policy.</span>
                                    </p>
                                </div>
                            </div>

                            {/* Ride Support */}
                            <div className="support-row">
                                <div className="left">
                                    <img src={Bluebike} className="icon" alt="rider" />
                                    <h2>Ride <br /> Support.</h2>
                                </div>

                                <div className="divider"></div>

                                <div className="right">
                                    <p>
                                        By continuing, you agree to kuicqli’s
                                        <span className="link"> Terms of use </span>
                                        and
                                        <span className="link"> Privacy Policy.</span>
                                    </p>
                                </div>
                            </div>

                            {/* User Support */}
                            <div className="support-row">
                                <div className="left">
                                    <img src={UserBlue} className="icon" alt="user" />
                                    <h2>User <br /> Support.</h2>
                                </div>

                                <div className="divider"></div>

                                <div className="right">
                                    <p>
                                        For any booking support or queries, email us at
                                        <span className="link"> support@kuicqli.com </span>
                                        or call 9278000316.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <div className="office-section">
                <h2 className="office-title">OUR <br /> OFFICE.</h2>
                <div className="office-list">
                    <p>
                        <span className="office-bold">Head Office</span> - 185/20, Golaganj, Wazeerganj, Lucknow -226018.
                    </p>
                    <p>
                        <span className="office-bold">Branch Office</span> - 2nd Floor, Prince Complex, Nawal Kishore Road, Hazratganj - 226001.
                    </p>
                    <p>
                        <span className="office-bold">Branch Office</span> - Levana, Cyber Heights, 2nd Floor, Vibhuti Khand, Gomtinagar - 226010.
                    </p>
                    <p>
                        <span className="office-bold">Branch Office</span> - Kalyanpur, Cyber Heights, 2nd Floor, Vibhuti Khand, Gomtinagar - 226010.
                    </p>
                </div>
            </div>


            <Footer />
            <ScrollToTopButton />
        </>
    )
}

export default Support
