import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import SocketProvider from "./context/Socketcontext.jsx";
import { RideProvider } from "./context/RideContext.jsx";
import { GoogleMapsProvider } from "./providers/GoogleMapsProvider.jsx"; // <— make sure the file name is exact
import "./i18n";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleMapsProvider> {/* <-- Wrap at the top so every component can access maps */}
      <SocketProvider>
        <RideProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RideProvider>
      </SocketProvider>
    </GoogleMapsProvider>
  </StrictMode>
);
