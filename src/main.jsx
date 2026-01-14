import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import SocketProvider  from './context/Socketcontext.jsx'
import { RideProvider}  from './context/RideContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <BrowserRouter>

  
         <RideProvider>
           <App />
         </RideProvider>
       
      
  
   
 
  </BrowserRouter>
    </SocketProvider>
     </StrictMode>
)
