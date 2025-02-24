import React from 'react';

const CustomLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
        {/* Modern single spinner */}
        <div className="relative w-16 h-16">
          {/* Outer gradient ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
          
          {/* Inner gradient ring */}
          <div className="absolute inset-2 rounded-full border-4 border-blue-100"></div>
          
          {/* Center dot */}
          <div className="absolute inset-[30%] bg-blue-500 rounded-full"></div>
        </div>
        
        {/* Loading text with animation */}
        <div className="mt-4 text-gray-700 font-medium animate-pulse">
          Registering Staff...
        </div>
      </div>
    </div>
  );
};

export default CustomLoader; 