// components/NoInternet.jsx
import React from "react";
import Lottie from "lottie-react";
import noInternetAnim from "../../assets/animations/No Connection.json"; // your Lottie file path

const NoInternet = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <div className="w-80">
        <Lottie animationData={noInternetAnim} loop autoplay />
      </div>
      <h1 className="text-2xl font-bold text-gray-700 mt-4">No Internet Connection</h1>
      <p className="text-gray-500">Please check your network and try again.</p>
    </div>
  );
};

export default NoInternet;
