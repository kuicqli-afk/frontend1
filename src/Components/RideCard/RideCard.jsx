// RideCard.jsx
import React from "react";
import "./RideCard.css"; // import the CSS

const RideCard = ({ ride }) => {
  return (
    <div className="ride-card">
      <div className="ride-header">
        <h3>Order #{ride?ride._id.slice(0, 6):'ride id'}</h3>
        <span className={`status ${ride?ride.status.toLowerCase()
            :''
        }`}>
          {ride?ride.status:'status'}
        </span>
      </div>

      <div className="ride-body">
        <p style={{padding:"10px"}}><strong>Pickup Location:</strong> {ride?ride.pickUp:'pickUp Location'}</p>
        <p style={{padding:"10px"}}><strong>Drop Location:</strong> {ride?ride.drop:'drop location'}</p>
        <p style={{padding:"10px"}}><strong>Price:</strong> {ride?ride.fare:'price'}</p>
        <p style={{padding:"10px"}}><strong>Driver:</strong> {ride?.driver||<div style={{padding:'5px',color:'red',background:'#ff00004d',borderRadius:'5px',fontSize:'10px'}}>Not Assigned</div>}</p>
   
      </div>

      <div className="ride-footer">
        <small>{new Date(ride?ride.createdAt:'00:00').toLocaleString()}</small>
      </div>
    </div>
  );
};

export default RideCard;
