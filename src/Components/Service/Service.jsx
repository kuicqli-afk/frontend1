import React from 'react'
import './Service.css'

import CostSaving from '../../assets/CostSaving.png'
import SafeDelivery from '../../assets/SAFEDELIVERY.png'
import Trackorder from '../../assets/Trackorder.png'
import fastService from '../../assets/fastService.png'

const Service = () => {
  return (
    <>
      <div className="service-container">
        <div className="service-box">
            <img src={CostSaving} alt="" />
            <h2>COST SAVING.</h2>
            <p>Save more on every delivery with our affordable and budget-friendly service.</p>
        </div>
        <div className="service-box">
            <img src={SafeDelivery} alt="" />
            <h2>SAFE DELIVERY.</h2>
            <p>Your orders delivered safely with secure handling and trusted delivery partners.</p>
        </div>
        <div className="service-box">
            <img src={Trackorder} alt="" />
            <h2>TRACK ORDER.</h2>
            <p>Track your order in real time and know exactly where your delivery is.</p>
        </div>
        <div className="service-box">
            <img src={fastService} alt="" />
            <h2>FAST SERVICE.</h2>
            <p>Experience quick and timely deliveries with our fast and efficient service.</p>
        </div>
      </div>
    </>
  )
}

export default Service
