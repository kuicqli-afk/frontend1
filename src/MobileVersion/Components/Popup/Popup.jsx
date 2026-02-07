import React from 'react'
import './Popup.css'
function Popup({heading,message}) {
  return (
    <div class="modal-overlay">
  <div class="modal-container">
    <span class="modal-icon">⚠️</span>
    <h3>{heading}</h3>
    <p>{message}</p>
    
    <div class="modal-actions">
      <button class="btn-confirm-cancel">Yes, Cancel Ride</button>
      
      <button class="btn-keep-ride">No, Keep Searching</button>
    </div>
  </div>
</div>
  )
}

export default Popup