import React from "react";
import "./VehicleLoader.css";

import TwoWheeler from "../../assets/2wheeler.png";
import MiniAuto from "../../assets/MiniAuto.png";
import Eloader from "../../assets/Eloader.png";
import ThreeWheeler from "../../assets/3wheeler.png";
import MiniTruck from "../../assets/Minitruck.png";
import WhiteArrow from "../../assets/whitearrow.png";
import BlueArrow from "../../assets/bluearrow.png";
import Weight from "../../assets/weight.png";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

const VehicleLoader = () => {
  const data = [
    { img: TwoWheeler, weightimg: Weight, weight: "18kg.", title: "2 Wheeler.", price: "₹42/-" },
    { img: MiniAuto, weightimg: Weight, weight: "45kg.", title: "Mini Auto.", price: "₹50/-" },
    { img: Eloader, weightimg: Weight, weight: "400kg.", title: "E Loader.", price: "₹66/-" },
    { img: ThreeWheeler, weightimg: Weight, weight: "550kg.", title: "3 Wheeler.", price: "₹111/-" },
    { img: MiniTruck, weightimg: Weight, weight: "720kg.", title: "Mini Truck.", price: "₹228/-" }
  ];

  return (
    <div className="vehicle-container">
      <Link className="vehicle-left" to='/fare-link'>
        <h2>Check Deliver<br />Fare.</h2>
        <img src={WhiteArrow} className="left-arrow" alt="" />
      </Link>

      {/* AUTO MOVE SLIDER */}
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="vehicle-swiper"
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {data.map((x, i) => (
          <SwiperSlide key={i}>
            <div className="vehicle-card">
              <div className="vehicle-top">
                <img src={x.img} alt="" />
              </div>
              <div className="weight">
                <img src={x.weightimg} alt="" />
                <p>{x.weight}</p>
              </div>

              <div className="detail">
                <h3>{x.title}</h3>
                <p>Starting form</p>
                <h4>{x.price}</h4>
              </div>

              <div className="fare-link">
                <h4>Check Deliver Fare.</h4>
                <img src={BlueArrow} alt="" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VehicleLoader;
