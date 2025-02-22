import React, { useState, useEffect } from 'react';



import CompanyCards from '../../Components/SuperadminComponents/CompanyCards';
import SuperAdminSidebar from '../../Components/SuperadminSidebar';

const SuperAdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [companies, setCompanies] = useState([]);
  
    useEffect(() => {
      // Simulate fetching companies data
      setCompanies(Array(13).fill(null));
    }, []);
  
    return (
      <div className="flex">
  
        {/* Main Content */}
        <div className="flex-1 px-5">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-0 lg:items-center mb-12">
            <div className="flex flex-col space-y-2">
              <h1 className="text-[2rem] text-gray-800 font-bold tracking-tight ">
                Companies
              </h1>
            </div>
  
            {/* Search Bar */}
            <div className="relative w-full lg:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search companies..."
                className="w-full lg:w-[400px] px-6 py-4 rounded-full border-none
                         bg-white/70 backdrop-blur-sm shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50
                         text-gray-700 placeholder-gray-400 transition-all duration-300"
              />
              <svg
                className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
  
          {/* Cards Section */}
          <CompanyCards />
        </div>
      </div>
    );
  };
export default SuperAdminDashboard
