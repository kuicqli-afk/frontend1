import React, { createContext, useState } from 'react';

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  // Use a "Lazy Initializer" function inside useState. 
  // This runs ONLY once when the app starts.
  const [pendingRide, setPendingRideState] = useState(() => {
    try {
      const saved = localStorage.getItem('pendingRideData');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to parse pendingRideData", error);
      return null;
    }
  });

  // We wrap the setter to handle localStorage automatically
  const updatePendingRide = (data) => {
    if (data) {
      localStorage.setItem('pendingRideData', JSON.stringify(data));
    } else {
      localStorage.removeItem('pendingRideData');
    }
    setPendingRideState(data);
  };

  const clearPendingRide = () => {
    localStorage.removeItem('pendingRideData');
    setPendingRideState(null);
  };

  return (
    <RideContext.Provider value={{ pendingRide, setPendingRide: updatePendingRide, clearPendingRide }}>
      {children}
    </RideContext.Provider>
  );
};