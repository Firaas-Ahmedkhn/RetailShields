// components/NetworkWrapper.jsx
import React, { useEffect, useState } from "react";
import NoInternet from "./Nointernet";

const NetworkWrapper = ({ children }) => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online ? children : <NoInternet />;
};

export default NetworkWrapper;
