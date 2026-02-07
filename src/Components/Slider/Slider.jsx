import React from 'react'
import './Slider.css'
import SLIDER from "../../assets/SLIDER.png"

const Slider = () => {
  return (
    <>
      <div className="slider-container">
        <img src={SLIDER} alt="" className='slider-img'/>
      </div>
    </>
  )
}

export default Slider
