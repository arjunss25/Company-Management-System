import React from "react";
// import './LoadingSpinner.css'
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[50vh] bg-gray-50">
    {/* Main spinner container */}
    <div className="relative w-16 h-16">
      {/* Outer ring - slow spin */}
      <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      
      {/* Middle ring - medium spin */}
      <div className="absolute inset-1 rounded-full border-4 border-r-cyan-500 border-t-transparent border-b-transparent border-l-transparent animate-spin" 
           style={{animationDuration: "0.7s"}}></div>
      
      {/* Inner ring - fast spin */}
      <div className="absolute inset-2 rounded-full border-4 border-b-violet-500 border-t-transparent border-r-transparent border-l-transparent animate-spin"
           style={{animationDuration: "0.5s"}}></div>
           
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-md"></div>
    </div>
  </div>
  );
};

export default LoadingSpinner;