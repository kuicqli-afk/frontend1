import React, { useState, useEffect } from "react";
import "./ScrollToTopButton.css";

import UpArrow from '../../assets/UpArrow.png'

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolling down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {isVisible && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
         <img src={UpArrow} alt="" />
        </button>
      )}
    </div>
  );
};


