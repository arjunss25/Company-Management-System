import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import EditAddMaterials from './EditAddMaterials';
import EditWorkCompletionReport from './EditWorkCompletetionReport';
import EditPhotoReport from './EditPhotoReport';
import EditAttachment from './EditAttachment';
import EditWorkDetails from './EditWorkDetails';

const EditQuotations = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="w-full h-screen flex">

      <div className="main-content w-full  h-full">
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8 bg-white border-b">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            EDIT QUOTATION
          </h1>
        </div>

        <div className="max-w-[90%] mx-auto py-8">
          {/* Work Details Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              className={`w-full px-8 py-6 text-left flex justify-between items-center ${
                expandedSection === 'workDetails'
                  ? 'rounded-t-lg'
                  : 'rounded-lg'
              }`}
              onClick={() => toggleSection('workDetails')}
            >
              <span className="text-[1.1rem] text-gray-700">Work Details</span>
              <IoIosArrowDown
                className={`text-gray-400 text-xl transition-transform duration-300 ${
                  expandedSection === 'workDetails' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ${
                expandedSection === 'workDetails' ? 'block' : 'hidden'
              }`}
            >
              <div className="border-t">
                <EditWorkDetails />
              </div>
            </div>
          </div>

          {/* Materials Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              className={`w-full px-8 py-6 text-left flex justify-between items-center ${
                expandedSection === 'materials' ? 'rounded-t-lg' : 'rounded-lg'
              }`}
              onClick={() => toggleSection('materials')}
            >
              <span className="text-[1.1rem] text-gray-700">Materials</span>
              <IoIosArrowDown
                className={`text-gray-400 text-xl transition-transform duration-300 ${
                  expandedSection === 'materials' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ${
                expandedSection === 'materials' ? 'block' : 'hidden'
              }`}
            >
              <div className="border-t p-6">
                <EditAddMaterials/>
              </div>
            </div>
          </div>

          {/* Work Completion Report */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              className={`w-full px-8 py-6 text-left flex justify-between items-center ${
                expandedSection === 'workCompletion'
                  ? 'rounded-t-lg'
                  : 'rounded-lg'
              }`}
              onClick={() => toggleSection('workCompletion')}
            >
              <span className="text-[1.1rem] text-gray-700">
                Work Completion Report
              </span>
              <IoIosArrowDown
                className={`text-gray-400 text-xl transition-transform duration-300 ${
                  expandedSection === 'workCompletion' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ${
                expandedSection === 'workCompletion' ? 'block' : 'hidden'
              }`}
            >
              <div className="border-t p-6">
                <EditWorkCompletionReport/>
              </div>
            </div>
          </div>

          {/* Photo Report */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              className={`w-full px-8 py-6 text-left flex justify-between items-center ${
                expandedSection === 'photoReport'
                  ? 'rounded-t-lg'
                  : 'rounded-lg'
              }`}
              onClick={() => toggleSection('photoReport')}
            >
              <span className="text-[1.1rem] text-gray-700">Photo Report</span>
              <IoIosArrowDown
                className={`text-gray-400 text-xl transition-transform duration-300 ${
                  expandedSection === 'photoReport' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ${
                expandedSection === 'photoReport' ? 'block' : 'hidden'
              }`}
            >
              <div className="border-t p-6">
                <EditPhotoReport/>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              className={`w-full px-8 py-6 text-left flex justify-between items-center ${
                expandedSection === 'attachments'
                  ? 'rounded-t-lg'
                  : 'rounded-lg'
              }`}
              onClick={() => toggleSection('attachments')}
            >
              <span className="text-[1.1rem] text-gray-700">Attachments</span>
              <IoIosArrowDown
                className={`text-gray-400 text-xl transition-transform duration-300 ${
                  expandedSection === 'attachments' ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ${
                expandedSection === 'attachments' ? 'block' : 'hidden'
              }`}
            >
              <div className="border-t p-6">
                <EditAttachment/>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200">
              Save Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuotations;
