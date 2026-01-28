import React from 'react'
import './SuccessPopUp.css'
function SuccessPopUp({heading,para,btn}) {
  return (
    <div class="modal-overlay">
        <div class="modal-container success">
            <div class="success-icon-circle">
            ✓
            </div>
            
            <h3>{heading}</h3>
            <p>{para}</p>
            
            <div class="modal-actions">
            <button class="btn-start-tracking">{btn}</button>
            </div>
        </div>
        </div>
  )
}

export default SuccessPopUp