import React, { useState } from 'react';
import {
  IoChevronDownOutline,
  IoAddOutline,
  IoSearchOutline,
} from 'react-icons/io5';

const TermsAndConditions = () => {
  const options = {
    general: [
      'Prices are excluding VAT',
      'Transportation charges extra',
      'Loading & unloading charges extra',
      'Scaffolding charges extra',
      'Civil work not included',
      'Working time 8:00 AM to 5:00 PM',
      'Friday working charges extra',
      'Overtime charges extra',
    ],
    payment: [
      '100% Advance',
      '50% Advance & 50% Upon Completion',
      '40% Advance, 30% Progress & 30% Upon Completion',
      '30% Advance, 60% Progress & 10% Retention',
    ],
    completion: [
      'Immediate',
      '2-3 Working Days',
      '1 Week',
      '2 Weeks',
      '3 Weeks',
      '1 Month',
    ],
    validity: ['7 Days', '15 Days', '30 Days'],
    warranty: [
      '1 Year against manufacturing defects',
      '2 Years against manufacturing defects',
      '3 Years against manufacturing defects',
      'No Warranty',
    ],
  };

  const sections = [
    {
      id: 'general',
      title: 'General Terms & Condition',
    },
    {
      id: 'payment',
      title: 'Payment Terms',
    },
    {
      id: 'completion',
      title: 'Completion & Delivery',
    },
    {
      id: 'validity',
      title: 'Quotation Validity',
    },
    {
      id: 'warranty',
      title: 'Warranty',
    },
  ];

  const [openSection, setOpenSection] = useState(null);
  const [selectedTerms, setSelectedTerms] = useState({
    general: [],
    payment: [],
    completion: [],
    validity: [],
    warranty: [],
  });
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [selectedModalItems, setSelectedModalItems] = useState([]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleTermChange = (sectionId, index, value) => {
    setSelectedTerms((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((term, i) =>
        i === index ? value : term
      ),
    }));
  };

  const handleRemoveTerm = (sectionId, index) => {
    setSelectedTerms((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].filter((_, i) => i !== index),
    }));
  };

  const handleOpenSelectModal = (sectionId) => {
    setCurrentSection(sectionId);
    setIsSelectModalOpen(true);
    setSearchQuery('');
  };

  const handleOpenCreateModal = (sectionId) => {
    setCurrentSection(sectionId);
    setIsCreateModalOpen(true);
    setNewTerm('');
  };

  const handleCreateTerm = () => {
    if (newTerm.trim()) {
      options[currentSection] = [...options[currentSection], newTerm.trim()];
      setSelectedTerms((prev) => ({
        ...prev,
        [currentSection]: [...prev[currentSection], newTerm.trim()],
      }));
      setIsCreateModalOpen(false);
      setNewTerm('');
    }
  };

  const filteredOptions = currentSection
    ? options[currentSection].filter((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`border rounded-lg transition-all ${
              openSection === section.id ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <button
              className="w-full px-6 py-4 flex justify-between items-center text-left"
              onClick={() => toggleSection(section.id)}
            >
              <span className="text-gray-700 font-medium">{section.title}</span>
              <IoChevronDownOutline
                className={`text-gray-500 transition-transform duration-200 ${
                  openSection === section.id ? 'rotate-180' : ''
                }`}
                size={20}
              />
            </button>

            {openSection === section.id && (
              <div className="px-6 py-4 border-t space-y-4">
                {selectedTerms[section.id].map((term, index) => (
  <div key={index} className="flex gap-4 items-start">
    <div className="flex-1">
      <input
        type="text"
        value={term}
        onChange={(e) =>
          handleTermChange(section.id, index, e.target.value)
        }
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
      />
    </div>
    <button
      onClick={() => handleRemoveTerm(section.id, index)}
      className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
    >
      Remove
    </button>
  </div>
))}


                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleOpenSelectModal(section.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    Select {section.title}
                  </button>
                  <button
                    onClick={() => handleOpenCreateModal(section.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-green-500 hover:text-green-700 hover:bg-green-50 transition-colors"
                  >
                    <IoAddOutline size={20} />
                    Create New
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Select Modal */}
      {isSelectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Select {sections.find((s) => s.id === currentSection)?.title}
                </h3>
                <button
                  onClick={() => setIsSelectModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearchOutline className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto mb-6 -mx-6 px-6">
                {filteredOptions.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedModalItems((prev) =>
                        prev.includes(option)
                          ? prev.filter((item) => item !== option)
                          : [...prev, option]
                      );
                    }}
                  >
                    <div
                      className={`w-5 h-5 border rounded-md mr-3 flex items-center justify-center transition-all
                        ${
                          selectedModalItems.includes(option)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}
                    >
                      {selectedModalItems.includes(option) && (
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700 select-none">{option}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedModalItems([]);
                    setIsSelectModalOpen(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSelectedTerms((prev) => ({
                      ...prev,
                      [currentSection]: [
                        ...new Set([
                          ...prev[currentSection],
                          ...selectedModalItems,
                        ]),
                      ],
                    }));
                    setSelectedModalItems([]);
                    setIsSelectModalOpen(false);
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Create New{' '}
                  {sections.find((s) => s.id === currentSection)?.title}
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <textarea
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                placeholder="Enter new term..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px] mb-6 resize-none transition-all"
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTerm}
                  disabled={!newTerm.trim()}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium shadow-sm
                    ${
                      newTerm.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsAndConditions;
