import React, { useState, useEffect } from 'react';
import { CgSearch } from 'react-icons/cg';
import CompanyCards from '../../Components/SuperadminComponents/CompanyCards';
import { useDispatch } from 'react-redux';
import {
  fetchCompanies,
  searchCompanies,
} from '../../Redux/SuperAdminSlice/companiesSlice';
import { useDebounce } from '../../Hooks/useDebounce';
import LoadingSpinner from '../../Components/Common/LoadingSpinner';

const SuperAdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      dispatch(searchCompanies(debouncedSearch));
    } else {
      dispatch(fetchCompanies());
    }
  }, [debouncedSearch, dispatch]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-0 lg:items-center mb-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl lg:text-[2rem] text-gray-800 font-bold tracking-tight">
              Companies
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-[400px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies..."
              className="w-full px-12 py-3 lg:py-3.5 rounded-xl
                       bg-white shadow-md
                       border border-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       focus:border-transparent focus:shadow-lg
                       text-gray-700 placeholder-gray-400
                       transition-all duration-200 ease-in-out"
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <CgSearch className="text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <CompanyCards />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
