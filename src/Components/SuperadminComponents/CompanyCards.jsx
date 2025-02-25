import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies } from '../../Redux/SuperAdminSlice/companiesSlice';
import { HiArrowRight } from 'react-icons/hi';
import LoadingSpinner from '../Common/LoadingSpinner';

const CompanyCards = () => {
  const dispatch = useDispatch();
  const { items: companies, status, error } = useSelector((state) => state.companies);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  if (status === 'loading') {
    return <div><LoadingSpinner/></div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="bg-gray-50 rounded-full p-8 mb-6">
          <svg 
            className="w-16 h-16 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Companies Found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't find any companies matching your search criteria. 
          Try adjusting your search terms or browse all companies.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {companies.map((company) => (
        <div
          key={company.id}
          className="relative bg-white rounded-xl overflow-hidden cursor-pointer
          group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
          hover:scale-[1.02] motion-safe:animate-fadeIn hover:border-[1px] border-[#DFDFDF]"
        >
          {/* Company Logo */}
          <div className="relative aspect-square p-6">
            <img
              src={company.logo_image?.startsWith('http') 
                ? company.logo_image 
                : `http://82.29.160.146${company.logo_image}`}
              alt={`${company.company_name} Logo`}
              className=" object-cover"
              onError={(e) => {
                e.target.src = '/default-logo.png';
              }}
            />
          </div>
        
          {/* Company Name */}
          <div
            className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm 
            px-3 py-2 text-center overflow-hidden
            transition-all h-[20%] duration-300  group-hover:h-[40%] flex items-center"
          >
            <h3 className="text-white text-[1.2rem] font-semibold truncate text-left">
              {company.company_name} <span>.</span>
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyCards;
