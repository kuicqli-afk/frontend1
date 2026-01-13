import React, { useState } from 'react';
import './SignUp.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import arrow from '../../assets/arrow.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
    const [data, setData] = useState({name:'', phone: '', otp: '' });
    const [showOtp, setShowOtp] = useState(false);
    const [login,setLogin]=useState(false)

    const navigate = useNavigate();
    const name=localStorage.getItem("name");


    //Login

    const handleSubmitLogin= async (e)=>{
      e.preventDefault();

      if(!data.phone)
      {
        toast.error("Please Enter Your Phone Number");
        return;
      }

      try {
        const response = await axios.post(
        'http://localhost:4000/user/login/send-otp',
        {
            phone: data.phone
        },
        {
            headers: {
            'Content-Type': 'application/json'
            }
        }
        );
        if(response.data.success)
        {
            setShowOtp(true)
            toast.success(response.data.message)
        }else{
            toast.error(response.data.message)
        }
      } catch (error) {
        toast.error('Server error. Please try again.', {
                toastStyle: { border: '2px solid blue', borderRadius: '8px' }
            });
      }
    }
    // Send OTP
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.phone) {
            toast.error('Please enter your phone number');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/user/register/send-otp', {
                phone: data.phone
            });

            if (response.data.success) {
                setShowOtp(true);
                console.log(response)
                toast.success(response.data.message, {
                    toastStyle: { border: '2px solid blue', borderRadius: '8px' }
                });
            } else {
                toast.error(response.data.message, {
                    toastStyle: { border: '2px solid blue', borderRadius: '8px' }
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('Server error. Please try again.', {
                toastStyle: { border: '2px solid blue', borderRadius: '8px' }
            });
        }
    };

    // Verify OTP
    const handleSubmit2 = async (e) => {
        e.preventDefault();

        if (!data.otp) {
            toast.error('Please enter OTP');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/user/verify-otp', {
                phone: data.phone,
                otp: data.otp,
                name:data.name,
            });

            if (response.data.success) {
                toast.success(response.data.message, {
                    toastStyle: { border: '2px solid blue', borderRadius: '8px' }
                });
                console.log(response.data)
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('name',response.data.user.name);
                localStorage.setItem('phone',response.data.user.phone);
                 navigate('/');
            } else {
                toast.error(response.data.message, {
                    toastStyle: { border: '2px solid blue', borderRadius: '8px' }
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Server error. Please try again.', {
                toastStyle: { border: '2px solid blue', borderRadius: '8px' }
            });
        }
    };

    return (
        <>
            <ToastContainer />
            <Navbar />
            <div className="sign-container">
                <div className="sign-box">
                    <div className="sign-left">
                        <img src={arrow} alt="" />
                    </div>
                      {name?
                       <div style={{padding:"20px",margin:"20px"}}>
                        <h2>Hello User</h2>
                           {name}
                       </div>
                      :
                      <form>
                        <div className="sign-right">
                            {showOtp ? (
                                <>
                                    <h2>Enter OTP</h2>
                                    <div className="phone-row">
                                        <input
                                            type="text"
                                            className="mobile-input"
                                            placeholder="Enter mobile OTP"
                                            maxLength={6}
                                            onChange={(e) =>
                                                setData({ ...data, otp: e.target.value })
                                            }
                                            value={data.otp}
                                        />
                                    </div>
                                    <button
                                        className="otp-btn"
                                        type="submit"
                                        onClick={handleSubmit2}
                                    >
                                        Verify & Register
                                    </button>
                                </>
                            ) : (

                                (
                                    login
                                    ?
                                    <div>
                                        <h3>Enter mobile number</h3>
                                    <div className="phone-row">
                                        <span className="country-code">+91</span>
                                        <input
                                            type="text"
                                            className="mobile-input"
                                            placeholder="Enter mobile number"
                                            onChange={(e) =>
                                                setData({ ...data, phone: e.target.value })
                                            }
                                            value={data.phone}
                                        />
                                    </div>

                                    <p className="agree-text">
                                        By continuing, you agree to kuicqli’s
                                        <a href="#"> Terms of use </a> and
                                        <a href="#"> Privacy Policy</a>.
                                    </p>

                                    <button
                                        className="otp-btn"
                                        type="submit"
                                        onClick={handleSubmitLogin}
                                    >
                                        Request OTP
                                    </button>
                                    </div>
                                    
                                    :

                                    <>
                                 <h3>Enter your name</h3>
                                    <div className="phone-row">
                                      
                                        <input
                                            type="text"
                                            className="mobile-input"
                                            placeholder="Enter Name"
                                            onChange={(e) =>
                                                setData({ ...data,name: e.target.value })
                                            }
                                            value={data.name}
                                        />
                                    </div>
                                    <h3>Enter mobile number</h3>
                                    <div className="phone-row">
                                        <span className="country-code">+91</span>
                                        <input
                                            type="text"
                                            className="mobile-input"
                                            placeholder="Enter mobile number"
                                            onChange={(e) =>
                                                setData({ ...data, phone: e.target.value })
                                            }
                                            value={data.phone}
                                        />
                                    </div>

                                    <p className="agree-text">
                                        By continuing, you agree to kuicqli’s
                                        <a href="#"> Terms of use </a> and
                                        <a href="#"> Privacy Policy</a>.
                                    </p>

                                    <button
                                        className="otp-btn"
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        Request OTP
                                    </button>
                                </>
                                )
                                
                            )}

                            <p className="bottom-text">
                                {
                                    login
                                    ?
                                    <> New to kuicqii? <a href="#">Create New Account <span onClick={()=>{setLogin(false)}}>SignUp</span></a></>

                                    :
                                     <> New to kuicqii? <a href="#">Already have an Account <span onClick={()=>{setLogin(true)}}>Login</span></a></>
                                }
                               
                            </p>
                        </div>
                    </form>}
                    
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SignUp;
