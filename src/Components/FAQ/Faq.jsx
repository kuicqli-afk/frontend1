import React, { useState } from "react";
import "./Faq.css";

const faqData = [
  { question: "What is Deliver APP?", answer: "Deliver is an app designed for logistics and delivery services." },
  { question: "How do I use Deliver App?", answer: "You can download the app, register, and start booking deliveries." },
  { question: "Does Porter transport between cities?", answer: "Yes, intercity transport is available depending on vehicle type." },
  { question: "What are the items that are prohibited by Porter?", answer: "Explosives, illegal goods, and restricted items are not allowed." },
  { question: "What is Deliver APP?", answer: "Deliver is an app designed for logistics and delivery services." },
  { question: "How do I use Deliver App?", answer: "You can download the app, register, and start booking deliveries." },
  { question: "Does Porter transport between cities?", answer: "Yes, intercity transport is available depending on vehicle type." },
  { question: "What are the items that are prohibited by Porter?", answer: "Explosives, illegal goods, and restricted items are not allowed." },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">FREQUENTLY ASKED<br />QUESTION.</h2>
      <p className="faq-subtitle">
        If you need any further assistance, we're always here to help.
      </p>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="faq-item"
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <span>{item.question}</span>

              <span className="faq-icon">
                {openIndex === index ? (
                  <i class="fa-solid fa-angle-up"></i>  
                ) : (
                  <i className="fa-solid fa-angle-down"></i>
                )}
              </span>
            </div>

            {openIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
