import React from 'react'
import './Popup.css'
function Popup() {
  return (
    <div class="modal-overlay">
  <div class="modal-container">
    <span class="modal-icon">⚠️</span>
    <h3>Cancel Ride?</h3>
    <p>Are you sure you want to cancel? Drivers are currently heading to your area.</p>
    
    <div class="modal-actions">
      <button class="btn-confirm-cancel">Yes, Cancel Ride</button>
      
      <button class="btn-keep-ride">No, Keep Searching</button>
    </div>
  </div>
</div>
  )
}

export default Popup