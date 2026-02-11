import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import { SocketContext } from '../../context/Socketcontext'
import { useGoogleMaps } from "../../providers/GoogleMapsProvider.jsx";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useNavigate } from 'react-router-dom';
import notification from '../../assets/notification2.wav'
function RideStarted() {
    const [directionResponse, setDirectionResponse] = useState(null);
    const [distance,setDistance]=useState('')
    const [travelTime,setTravelTime]=useState('')
    const {socket}=useContext(SocketContext);
    const [data,setData]=useState('')
    const ride =JSON.parse(localStorage.getItem("ride"))
     const { isLoaded } = useGoogleMaps();
    //  const notificationSound = new Audio(notification);
     
     const navigate=useNavigate()
// 🔌 Socket listener
  useEffect(() => {
    if (!socket) return

    const handleRideCompleted = (newRide) => {
      alert('Ride Completed')
      socket.leave(`order_${orderId}`);
      console.log(newRide)
      navigate('/fare-link')
    }

    const handleConfirmOtp=(data)=>{
      const audio = new Audio(notification);
      audio.play().catch(err => console.log("Audio play blocked:", err));
      alert('Ride Confirm Otp')
      console.log('hello')
      console.log(data)
      setData(data)
    
    }

    socket.on('ride-completed', handleRideCompleted)
    socket.on('confirm-otp',handleConfirmOtp)

    // 🧹 Cleanup
    return () => {
      socket.off('ride-completed', handleRideCompleted)
    }
  }, [socket])
   


      /* ================= GOOGLE MAP ================= */
    
     
    
      const calculateRoute = async () => {
        if (!window.google || !ride?.pickUp || !ride?.drop) return;
    
        const directionsService = new window.google.maps.DirectionsService();
    
        try {
          const result = await directionsService.route({
            origin:{
                lat:ride.driverId.location.coordinates[1],
                lng:ride.driverId.location.coordinates[0],
            },
            destination: ride.pickUp,
            travelMode: window.google.maps.TravelMode.DRIVING,
          });
           setDistance( result.routes[0].legs[0].distance.text )  // "12.4 km"
           setTravelTime( result.routes[0].legs[0].duration.text)
           setDirectionResponse(result);
        } catch (err) {
          console.error("Route error:", err);
        }
      };
    
      useEffect(() => {
        if (isLoaded) {
          calculateRoute();
        }
      }, [isLoaded]);
    
      if (!isLoaded) return <div>Loading Map...</div>;
  return (<>
  <Navbar/>
    <div style={{
        padding:"20px"
    }}>
        <h1>Ride Started</h1>
        <div style={{width:"full",height:"500px",border:"2px solid black",marginTop:"10px"}}>
               {ride?.driverId?.location && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "400px" ,borderRadius:"0px"}}
                  center={{
                    lat: ride.driverId.location.coordinates[1],
                    lng: ride.driverId.location.coordinates[0],
                  }}
                  zoom={10}
                //    options={{ styles: darkMapStyle }}
                    options={{   mapTypeControl: false,    
                                streetViewControl: false,  
                                fullscreenControl: false,  }}
                >
                  {/* <Marker
                    position={{
                      lat: ride.driverId.location.coordinates[1],
                      lng: ride.driverId.location.coordinates[0],
                    }}
                  /> */}
                  <Marker
                position={{
                    lat: ride.driverId.location.coordinates[1],
                    lng: ride.driverId.location.coordinates[0],
                }}
                icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "blue",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#fff",
                }}
                />

                  {directionResponse && (
                    <DirectionsRenderer directions={directionResponse} />
                  )}
                </GoogleMap>
              )}
        </div>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>
          <div style={{padding:"10px"}}>
            <p><strong>Driver Name :</strong> {ride.driverId.name}</p>
            <p><strong>Driver Phone :</strong>{ride.driverId.phone}</p>
          </div>
          <div style={{padding:"10px"}}>
            <h3>Ride Confimation Otp- <span style={{color:"blue"}}>{data?data.rideConfirmOtp:'You Receive Otp Once the Rider Completed the Ride'}</span></h3>
            <h5>Driver Patner Will There in -</h5>
          </div>
        </div>
        
    </div>
    
</>
  )
}

export default RideStarted