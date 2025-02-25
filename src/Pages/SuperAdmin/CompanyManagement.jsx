import React, { useState } from 'react';
import {
  Building,
  List,
  ChevronDown,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import AddCompany from './AddCompany';
import CompanyListTable from './CompanyListTable';

const AccordionSection = ({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
  accentColor,
}) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
    <button
      className={`w-full px-4 py-3 text-left font-medium flex items-center justify-between ${
        isExpanded
          ? 'bg-gradient-to-r from-gray-50 to-white rounded-t-xl'
          : 'rounded-xl'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${accentColor}`}>
          <Icon className="text-white" size={20} />
        </div>
        <span className="text-base font-semibold text-gray-700">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {title === 'Company List' && (
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-gray-500">12 Companies</span>
            <div className="h-4 w-[1px] bg-gray-300"></div>
            <span className="text-gray-500">Last updated: Today</span>
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
      <div className="p-4 border-t">{children}</div>
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
    <div className="w-full min-h-screen">
      <div className="p-4 lg:p-6">
        <div className="w-full">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                Company Management
                <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
              </h1>
            </div>


          </div>

          <div className="space-y-4 flex flex-col items-cente w-fullr">
            <AccordionSection
              title="Register Company"
              icon={Building}
              isExpanded={expandedSection === 'register'}
              onToggle={() => toggleSection('register')}
              accentColor="bg-blue-500"
            >
              <div className="max-w-4xl mx-auto">
                <AddCompany />
              </div>
            </AccordionSection>

            <AccordionSection
              title="Company List"
              icon={List}
              isExpanded={expandedSection === 'list'}
              onToggle={() => toggleSection('list')}
              accentColor="bg-green-500"
            >
              <div className="flex justify-center w-full">
                <CompanyListTable />
              </div>
            </AccordionSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;
