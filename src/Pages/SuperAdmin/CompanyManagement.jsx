import React, { useState } from 'react';
import { Building, List, ChevronDown, Plus, Search, Filter } from 'lucide-react';
import AddCompany from './AddCompany';
import CompanyListTable from './CompanyListTable';

const AccordionSection = ({ title, icon: Icon, isExpanded, onToggle, children, accentColor }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
    <button
      className={`w-full px-6 py-4 text-left font-medium flex justify-between items-center ${
        isExpanded ? 'bg-gradient-to-r from-gray-50 to-white rounded-t-xl' : 'rounded-xl'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${accentColor}`}>
          <Icon className="text-white" size={20} />
        </div>
        <span className="text-gray-700 text-lg font-semibold">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {title === 'Company List' && (
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm text-gray-500">12 Companies</span>
            <div className="h-4 w-[1px] bg-gray-300"></div>
            <span className="text-sm text-gray-500">Last updated: Today</span>
          </div>
        )}
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </div>
    </button>
    <div
      className={`transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}
    >
      <div className="p-6 border-t">{children}</div>
    </div>
  </div>
);

const CompanyManagement = () => {
  const [expandedSection, setExpandedSection] = useState('register');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="w-full flex">
      <div className="main-content w-full  h-full p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Company Management
                <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
              </h1>
            </div>
            
            {/* Search and Filter Bar */}
            {expandedSection === 'list' && (
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                  <Filter size={18} className="text-gray-500" />
                  <span>Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Accordion Sections */}
          <div className="space-y-6">
            <AccordionSection
              title="Register Company"
              icon={Building}
              isExpanded={expandedSection === 'register'}
              onToggle={() => toggleSection('register')}
              accentColor="bg-blue-500"
            >
              <AddCompany />
            </AccordionSection>

            <AccordionSection
              title="Company List"
              icon={List}
              isExpanded={expandedSection === 'list'}
              onToggle={() => toggleSection('list')}
              accentColor="bg-green-500"
            >
              <CompanyListTable />
            </AccordionSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;