import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div className="relative w-16 h-16">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        
        {/* Animated spinner circle */}
        <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;