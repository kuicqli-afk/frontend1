import React, { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapContext = createContext();

export function GoogleMapsProvider({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
    libraries: ["places"],
  });

  return (
    <GoogleMapContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapContext.Provider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
}
