import React, { createContext, useState ,useEffect} from 'react';
import axios from 'axios'
import { FaHome } from "react-icons/fa";

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  //Fare Calculation
   const [fare, setFare] = useState([]);
  //Selected Vehicle
  const [vehicle,setVehicle]=useState('bike');
  const phone=localStorage.getItem('phone')
  //Privous Rides
  const [coins,setCoins]=useState()
  const [previousRides,setPreviousRides]=useState([])
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


  





     useEffect(()=>{
      axios.post('https://thetest-h9x3.onrender.com/ride/get-ride/userId/',{
        phone:phone
      }).then((response)=>{
        console.log(response.data.data)
       setPreviousRides([...response.data.data].reverse());

      }).catch((error)=>console.log(error))
    },[])

       useEffect(() => {
        axios.post('https://thetest-h9x3.onrender.com/user/get-coins',{
          phone:phone
        }).then((response)=>{
          console.log(response)
          setCoins(response.data.data)
    
        }).catch((error)=>{
          console.log(error)
        })
      }, []);
  
  return (
    <RideContext.Provider value={{ pendingRide,fare,setFare,setPendingRide: updatePendingRide, clearPendingRide ,previousRides,vehicle,setVehicle,coins}}>
      {children}
    </RideContext.Provider>
  );
};