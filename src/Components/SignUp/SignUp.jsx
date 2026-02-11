import React, { useState,useContext } from 'react';
import './SignUp.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import arrow from '../../assets/arrow.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { RideContext } from '../../context/RideContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


const SignUp = () => {
    const [data, setData] = useState({name:'', phone: '', otp: '' });
    const [showOtp, setShowOtp] = useState(false);
    const [login,setLogin]=useState(false)
    const {pendingRide}=useContext(RideContext);
    const navigate = useNavigate();
    const name=localStorage.getItem("name");
    const [popUp,setPopUp]=useState('')


    //Login

    const handleSubmitLogin= async (e)=>{
      e.preventDefault();
      
      if(!data.phone)
      {
        toast.error("Please Enter Your Phone Number");
        return;
      }
      const newPhone=data.phone.replace(/\D/g, "");
      if(newPhone.length!=10)
        {
            toast.error('Please Enter Valid Phone Number');
            return;
        }

      try {
        const response = await axios.post(
        'https://thetest-h9x3.onrender.com/user/login/send-otp',
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
           
             setPopUp(response.data.message)
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
        const newPhone=data.phone.replace(/\D/g, "");
        if (!data.phone) {
            toast.error('Please enter your phone number');
            return;
        }

        if(newPhone.length!=10)
        {
            toast.error('Please Enter Valid Phone Number');
            return;
        }

        try {
            const response = await axios.post('https://thetest-h9x3.onrender.com/user/register/send-otp', {
                phone: data.phone
            });

            if (response.data.success) {
                setShowOtp(true);
                console.log(response)
                toast.success(response.data.message, {
                    toastStyle: { border: '2px solid blue', borderRadius: '8px' }
                });
            } else {
               
                setPopUp(response.data.message)
                
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
            const response = await axios.post('https://thetest-h9x3.onrender.com/user/verify-otp', {
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
                console.log(pendingRide)
                if(pendingRide)
                {
                    navigate('/fare-link')
                }else{
                     navigate('/');
                }
                
                
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
            {popUp&&
              
                <div className='model-overlay' style={{width:'100%',height:"100vh",position:'absolute',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',background:'#000000b3',zIndex:'1'}}>
                
                   <div style={{display:'flex',flexDirection:'column',padding:'30px',background:'white',boxShadow:'2px 2px 5px gray',filter:'none',borderRadius:'10px',alignItems:'end'}}>
                   <div style={{color:'blue',border:'1px solid blue',padding:'10px',borderRadius:'20px',cursor:'pointer'}}>
                       <FontAwesomeIcon icon={faXmark}  onClick={()=>setPopUp(false)}/>
                   </div>
                   <div style={{display:'flex',flexDirection:'row',padding:'60px',background:'white',borderRadius:'5px',width:'800px',justifyContent:'center',alignItems:'center',paddingTop:'20px'}}>
                        <div style={{color:'blue',fontSize:'30px',border:'1px solid blue',borderRadius:'30px',padding:'5px',width:'45px',height:"45px",textAlign:'center', fontWeight:'500'}}>
                         i 
                      </div>
                      <div style={{ textAlign:'justify',marginLeft:'20px'}}dangerouslySetInnerHTML={{ __html: popUp }}>
               
                      </div>
                   </div>
                      
                    
                   </div>
            </div>
            }
            
            <Navbar/>
            <div className="sign-container" style={popUp?{filter:'blur(5px)'}:{}}>
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
                      <form style={{width:"100%"}}>
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

                           {
                             !showOtp&&<p className="bottom-text">
                                {
                                    login
                                    ?
                                    <> New to kuicqli?  <span onClick={()=>{setLogin(false)}} style={{fontWeight:"600",textDecoration:'underLine',color:'blue',cursor:'pointer'}}>SignUp</span></>

                                    :
                                     <>Already have an Account <span  style={{fontWeight:"600",textDecoration:'underLine',color:'blue',cursor:'pointer'}} onClick={()=>{setLogin(true)}}>Login</span></>
                                }
                               
                            </p>
                           } 
                        </div>
                    </form>}
                    
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SignUp;
