import React, { useContext, useEffect, useState } from 'react'
import './Coins.css'
import Footer from '../../Components/Footer/Footer'
import bell from '../../../assets/Bell.png'
import coin from '../../../assets/coin.png'
import logo from "../../../assets/Logo.png";
import coin2 from '../../../assets/coin2.png'
import { RideContext } from '../../../context/RideContext'
import Faq from '../../../Components/FAQ/Faq'
import { FaArrowRight } from "react-icons/fa";
import wallet from '../../../assets/wallet.jpg'
import bank from '../../../assets/bank.jpg'
import bikeman from '../../../assets/bikeman.webp'
import { useNavigate } from 'react-router-dom'
function Coins() {

  
   const [openIndex, setOpenIndex] = useState(null);
   const [explain,setExplain]=useState(false)
   const [explain2,setExplain2]=useState(false)


     
  const name=localStorage.getItem('name')
  const navigate=useNavigate()
useEffect(() => {
  if (explain || explain2) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [explain, explain2]);
  
    const toggleFAQ = (index) => {
      setOpenIndex(index === openIndex ? null : index);
    };
  const {coins}=useContext(RideContext);
  const handleNavigate=()=>{
       navigate('/coins/history')
  }
  const faqData = [
  { question: "What is Deliver APP?", answer: "Deliver is an app designed for logistics and delivery services." },
  { question: "How do I use Deliver App?", answer: "You can download the app, register, and start booking deliveries." },
  { question: "Does Porter transport between cities?", answer: "Yes, intercity transport is available depending on vehicle type." },
  { question: "What are the items that are prohibited by Porter?", answer: "Explosives, illegal goods, and restricted items are not allowed." },
  { question: "What is Deliver APP?", answer: "Deliver is an app designed for logistics and delivery services." },
  { question: "How do I use Deliver App?", answer: "You can download the app, register, and start booking deliveries." },
  { question: "Does Deliver transport between cities?", answer: "Yes, intercity transport is available depending on vehicle type." },
  { question: "What are the items that are prohibited by Deliver?", answer: "Explosives, illegal goods, and restricted items are not allowed." },
];
  return (
    <>
    <div className="app-container">
         <header className="header2">
                <img src={logo} alt="" width={120} />
                <div className="header-right">
        
                  <div className="coin-badge">
                    <div style={{ marginLeft: '-10px' }}><img src={coin} alt="" width={22} /></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{coins} Coins Available </span>
                    <p style={{ fontSize: '7px', fontWeight: '300', paddingTop: '1px' }}>
                                            {coins > 25
                                              ? `You can use Coin!`
                                              : `Collect ${25 - coins} more coins to use`}
                                </p>
                    </div>
        
                  </div>
                  <div><img src={bell} width={26} /></div>
                </div>
              </header>

              <div className="coins-container">
               {explain && (
                  <div className="modal">
                    <div className="modal-content">

                      <div className="close-btn" onClick={() => setExplain(false)}>
                        ✖
                      </div>

                      <div className="coin-logo"><img src={coin2} alt="" width={100}/></div>

                      <h2 className="coin-text">1 Coin = ₹1</h2>

                      <p className="warning-text">
                        Minimum 25 coins are required to transfer
                      </p>

                      <input
                        type="number"
                        placeholder="Enter number of coins"
                        className="coin-input"
                      />

                      <button className="transfer-btn">
                        Transfer
                      </button>

                    </div>
                  </div>
                )}
                
                    <div className="coin-card">
                        
                        <div className="coin-header">
                        <h2>Hello, {name} </h2>
                        {/* <span className="reward-badge">+2 Coins Today</span> */}
                        </div>

                        <div className="coin-body">
                        <div className="coin-info">
                            <p className="label" style={{color:'white'}}>Total Coins</p>
                            <h1 className="coin-amount">{coins}</h1>
                            <p className="sub-text">Keep delivering to earn more rewards</p>
                        </div>

                        <div className="coin-image">
                            <img src={coin2} alt="Coins" />
                        </div>
                        
                        </div>  
                         <div className='coin-history' onClick={handleNavigate}>
                          View Coin Transction History
                          <FaArrowRight />
                        </div>

                    </div>
                    <div  className='heading'>Use Coins</div>
                    <div style={{display:'flex',flexDirection:'row',borderRadius:'10px',justifyContent:'space-between'}}>
                      
                        <div onClick={()=>setExplain(true)} style={{background:'white',borderRadius:'10px',width:'170px',height:'170px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                          <div style={{ textAlign: "center" }}>
                            <img src={wallet} alt="" width={90} style={{marginTop:'5px'}}/>
                          </div>
                          <div style={{display:'flex',flexDirection:'row',padding:'10px',justifyContent:'space-between',borderRadius:'10px',background:'#e7e7e7',alignItems:'center'}}>
                               <div>
                                <div style={{fontSize:'11px',color:'gray'}}>Transfer into</div>
                                <div style={{color:'#0000E6',fontSize:'12px'}}>Kuicqli Ride Credits</div>
                               </div>
                               <div style={{textAlign:'center',color:'#0000E6'}}><FaArrowRight /></div>
                          </div>

                        </div>
                         <div  onClick={()=>setExplain(true)} style={{background:'white',borderRadius:'10px',width:'170px',height:'170px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                          <div style={{ textAlign: "center" }}>
                            <img src={bank} alt="" width={120} style={{marginTop:'5px'}}/>
                          </div>
                          <div style={{display:'flex',flexDirection:'row',padding:'10px',justifyContent:'space-between',borderRadius:'10px',background:'#e7e7e7',alignItems:'center'}}>
                               <div>
                                <div style={{fontSize:'11px',color:'gray'}}>Transfer into</div>
                                <div style={{color:'#0000E6',fontSize:'12px'}}>Bank Account</div>
                               </div>
                               <div style={{textAlign:'center',color:'#0000E6'}}><FaArrowRight /></div>
                          </div>
                        </div>
                       
                    </div>



                    <div  className='heading'>More About Coins</div>
                    <div style={{display:'flex',flexDirection:'row',borderRadius:'10px',justifyContent:'space-between'}}>
                      

                          <div style={{background:'white',borderRadius:'10px',width:'170px',height:'200px',display:'flex',flexDirection:'column',justifyContent:'space-between'}} onClick={()=>setExplain2(true)}>
                          <div style={{ textAlign: "center" }}>
                            <img src={wallet} alt="" width={90} />
                          </div>
                          <div style={{display:'flex',flexDirection:'column',padding:'10px',justifyContent:'space-between',borderRadius:'10px',background:'#e7e7e7',alignItems:'start',fontWeight:'600'}} >
                               <div>
                                <div style={{fontSize:'16px',color:'black'}}>How do I earn coins ?</div>
                                <div style={{color:'#0000E6',fontSize:'14px',fontWeight:'600'}}>Learn</div>
                               </div>
                               <div style={{textAlign:'center',color:'#0000E6'}}><FaArrowRight /></div>
                          </div>

                        </div>
                         
                          <div style={{background:'white',borderRadius:'10px',width:'170px',height:'200px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}  onClick={()=>setExplain2(true)}>
                          <div style={{ textAlign: "center" }}>
                            <img src={wallet} alt="" width={90} />
                          </div>
                          <div style={{display:'flex',flexDirection:'column',padding:'10px',justifyContent:'space-between',borderRadius:'10px',background:'#e7e7e7',alignItems:'start'}}>
                               <div>
                                <div style={{fontSize:'15px',color:'black',fontWeight:'600'}}>How do I use coins ? &nbsp;&nbsp;</div>
                                <div style={{color:'#0000E6',fontSize:'14px',fontWeight:'600'}}>Learn</div>
                               </div>
                               <div style={{textAlign:'center',color:'#0000E6'}}><FaArrowRight /></div>
                          </div>

                        </div>
                   
                   
                    </div>



                       
                   
                    </div>
                    
                     <div style={{background:'#0000E6',padding:'10px 20px',marginTop:'0'}}>
                        <div style={{padding:'10px 0px',color:'white',fontSize:'20px',fontWeight:'600'}}>Frequently Asked Questions</div>
                           <div className="faq-list">
                          {faqData.map((item, index) => (
                            <div
                              key={index}
                              className="faq-item"
                              style={{color:'white'}}
                              onClick={() => toggleFAQ(index)}
                            >
                              <div className="faq-question" style={{color:'white',fontSize:'16px'}}>
                                <span>{item.question}</span>

                                <span className="faq-icon" style={{color:'white'}}>
                                  {openIndex === index ? (
                                    <i class="fa-solid fa-angle-up"></i>  
                                  ) : (
                                    <i className="fa-solid fa-angle-down"></i>
                                  )}
                                </span>
                              </div>

                              {openIndex === index && (
                                <div className="faq-answer" style={{color:'white'}}>{item.answer}</div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div style={{width:'100%',height:'80px',background:'#0000E6'}}>

                        </div>
                    </div>
    </div>
    
    
    <Footer/>
    {explain2 && (
  <>
    <div className="overlay" onClick={() => setExplain2(false)}></div>

  <div className="bottom-sheet">
  <div className="sheet-content">

    {/* HEADER */}
    <div className="sheet-header">
      <h2>How to Earn Coins</h2>
      <span onClick={() => setExplain2(false)}>✕</span>
    </div>

    {/* IMAGE SECTION */}
    {/* <div className="sheet-image">
      <img src={bikeman} alt="coin" className="coin-img" style={{width:'100%',height:'100%'}}/>
      
    </div> */}

    {/* TIMELINE */}
    <div className="timeline">

      <div className="timeline-item">
        <div className="timeline-left">
          <div className="circle">1</div>
          <div className="line"></div>
        </div>
        <div className="timeline-content">
          <h4>Complete Ride</h4>
          <p>Finish a delivery successfully.</p>
        </div>
      </div>

      <div className="timeline-item">
        <div className="timeline-left">
          <div className="circle">2</div>
          <div className="line"></div>
        </div>
        <div className="timeline-content">
          <h4>Earn Coins</h4>
          <p>Coins are credited instantly.</p>
        </div>
      </div>

      <div className="timeline-item">
        <div className="timeline-left">
          <div className="circle">3</div>
        </div>
        <div className="timeline-content">
          <h4>Redeem Coins</h4>
          <p>Use coins for ride credits or bank transfer.</p>
        </div>
      </div>

    </div>

  </div>

  {/* FULL WIDTH BUTTON */}
  <div className="sheet-footer">
    <button className="full-btn">
      Start Earning Now
    </button>
  </div>
</div>
  </>
)}
</>
  )
}

export default Coins