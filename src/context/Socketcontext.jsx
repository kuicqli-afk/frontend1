import { createContext, useEffect } from "react";
import {io} from 'socket.io-client';

export const SocketContext=createContext()
const token =localStorage.getItem('token');
const socket=io('https://thetest-h9x3.onrender.com',{
      auth: { token },
      reconnectionAttempts: 5, // try 5 times
      transports: ["websocket"],
})

const SocketProvider=({children})=>{
    useEffect(()=>{
       //Basic Connection Logic

       socket.on('connect',()=>{
        console.log('Connected to Server')
       
       });

       socket.on('disconnect',()=>{
        console.log('Disconnected');
       })

     
    },[])

    const sendMessage=(eventName,message)=>{
        socket.emit(eventName,message);
    };


    const receiveMessage=(eventName,callback)=>{
        socket.on(eventName,callback);
    }

    return(
        <SocketContext.Provider value={{socket,sendMessage,receiveMessage}}>
            {children}
        </SocketContext.Provider>
    )
}


export default SocketProvider;