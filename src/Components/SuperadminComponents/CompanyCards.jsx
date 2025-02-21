import React from 'react';
import { HiArrowRight } from 'react-icons/hi';

const companies = [
  { name: 'Sunrise', image: '/sunrise.png' },
  { name: 'Alfan', image: '/alfanlogomn.png' },
  { name: 'HSTC', image: '/hstc.png' },
  { name: 'Test', image: '/sunrise.png' },
  { name: 'TECH@1', image: '/LOGO14.png' },
  { name: 'Test 1', image: '/hstc.png' },
  { name: '#TESTING COMP', image: '/Travel_21.png' },
  { name: 'New Test Company', image: '/s.png' },
  { name: 'Modal Testing', image: '/eagle.png' },
  { name: 'New Company', image: '/download.png' },
  { name: 'Demo', image: '/download2.png' },
  { name: 'New Test', image: '/download (1).png' },
  { name: 'Test New', image: '/2380510.png' },
];

const CompanyCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {companies.map((company, index) => (
        <div
        key={index}
        className="relative bg-white rounded-xl overflow-hidden cursor-pointer
        group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
        hover:scale-[1.02] motion-safe:animate-fadeIn hover:border-[1px] border-black"
      >
        {/* Company Logo */}
        <div className="relative aspect-square p-6">
          <img
            src={company.image}
            alt={`${company.name} logo`}
            className="object-contain w-full h-full transition-transform duration-300
            group-hover:scale-110"
          />
        </div>
      
        {/* Company Name */}
        <div
          className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm 
          px-3 py-2 text-center border-t border-gray-100 overflow-hidden
          transition-all h-[20%] duration-300  group-hover:h-[40%] flex items-center"
        >
          <h3 className="text-white text-[1.2rem] font-semibold truncate text-left">
            {company.name}.
          </h3>
        </div>
      </div>
      
      ))}
    </div>
  );
};

export default CompanyCards;
