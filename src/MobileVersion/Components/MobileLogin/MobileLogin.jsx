import React, { useState} from 'react'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function MobileLogin({setPopUp}) {
        //Login
         const [showOtp,setShowOtp]=useState()
         const [data, setData] = useState({name:'', phone: '', otp: '' });
         const [error,setError]=useState()
         const navigate=useNavigate()
        
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
        });

        if(response.data.success)
        {
            setShowOtp(true)
            toast.success(response.data.message)
            console.log(response)
        }
        else{
           
             setPopUp(response.data.message)
             console.log(response)
        }
      } catch (error) {
       
        toast.error('Server error. Please try again.', {
                toastStyle: { border: '2px solid blue', borderRadius: '8px' }
            });
            console.log(error)
      }
    }

    // Verify OTP

    const handleSubmit2 = async (e) => {
        e.preventDefault();


        if (!data.otp) {
            toast.error('Please enter OTP');
            return;
        }


        try 
        {

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
            

                navigate('/fare-link')
                
                
            }
             else {
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
  return (
      <div className="form">
        {
            showOtp? <div>
            <input type="text" placeholder='OTP' style={{textAlign:'center'}} maxLength={4} minLength={4}  onChange={(e) => setData({ ...data,otp: e.target.value })}  value={data.otp} />
             <p style={{fontSize:'12px',padding:'10px',lineHeight:'20px'}}>Four Digit OTP is Send To Your Number</p>
            <button className="login-btn" on onClick={handleSubmit2}>Log In</button>
            </div> :<><input type="text" placeholder="User Phone Number"  onChange={(e) => setData({ ...data, phone: e.target.value })}value={data.phone}/>
            <p style={{fontSize:'12px',padding:'10px',lineHeight:'20px'}}>If you are already registered, an OTP will be sent to your registered mobile number.</p>
            <button className="login-btn" onClick={handleSubmitLogin}>Request OTP</button></>
            }
            

        </div>
  )
}

export default MobileLogin