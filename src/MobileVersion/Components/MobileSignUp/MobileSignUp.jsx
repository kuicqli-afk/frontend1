import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";


function MobileSignUp({setPopUp}) {
    const [showOtp,setShowOtp]=useState(false)
      const [data, setData] = useState({name:'', phone: '', otp: '' });
      const [error,setError]=useState()
     
   
     const handleSubmit = async (e) => {
  
        const newPhone=data.phone.replace(/\D/g, "");
        if (!data.phone) {
            setError('Please Enter Phone Number')
            return;
        }

        if(newPhone.length!=10)
        {
            setError('Please Enter A Valid Phone Number')
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
           setError('Please Enter Otp')
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
   <div className="form">
    {
        showOtp ? 
        <div>
            <input type="text" placeholder='OTP' style={{textAlign:'center'}} maxLength={4} minLength={4}  onChange={(e) => setData({ ...data,otp: e.target.value })}  value={data.otp}/>
            <p style={{fontSize:'12px',padding:'10px',lineHeight:'20px'}}>Four Digit OTP is Send To Your Number</p>
            <button className="login-btn" on onClick={handleSubmit2}>Sign Up</button>
        </div> :
        <>
          <input type="text" placeholder='User Name'  onChange={(e) => setData({ ...data,name: e.target.value })}  value={data.name}/>
          
          <input type="text" placeholder="User Phone Number"  onChange={(e) => setData({ ...data, phone: e.target.value })}value={data.phone}/>
          <div style={error?{color:'white',textAlign:'start',fontSize:'14px',padding:'0',marginBottom:'10px',marginLeft:'10px'}:{display:'none'}}>{error}</div>
          <p style={{fontSize:'12px',padding:'10px',lineHeight:'20px'}}>By continuing, you agree to kuicqli’s Terms of use and Privacy Policy.</p>
          <button className="login-btn"  onClick={handleSubmit}>Request OTP</button>
        </>
    }
          
         </div>
  )
}

export default MobileSignUp