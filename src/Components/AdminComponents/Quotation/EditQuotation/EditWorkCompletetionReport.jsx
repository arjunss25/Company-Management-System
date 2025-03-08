import React from 'react';
import { AiFillFilePdf, AiFillFileExcel, AiFillFileWord } from 'react-icons/ai';

const EditWorkCompletionReport = () => {
  const table1Data = [
    { id: 1, location: 'Location 1', scheduledHandoverDate: '2023-12-01' },
    { id: 2, location: 'Location 2', scheduledHandoverDate: '2023-12-15' },
    { id: 3, location: 'Location 3', scheduledHandoverDate: '2024-01-10' },
  ];

  const table2Data = [
    { id: 1, buildingMode: 'Mode 1', buildingNo: 'B1' },
    { id: 2, buildingMode: 'Mode 2', buildingNo: 'B2' },
    { id: 3, buildingMode: 'Mode 3', buildingNo: 'B3' },
  ];

  return (
    <div className="p-8">
    
      {/* First Table */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Scheduled Handover</h2>
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Sl. No</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Location</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Scheduled Handover Date</th>
            </tr>
          </thead>
          <tbody>
            {table1Data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-gray-700">{item.id}</td>
                <td className="px-4 py-2 text-gray-700">{item.location}</td>
                <td className="px-4 py-2 text-gray-700">{item.scheduledHandoverDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Second Table */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Work Information</h2>
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Sl. No</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Building Mode</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Building No</th>
            </tr>
          </thead>
          <tbody>
            {table2Data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-gray-700">{item.id}</td>
                <td className="px-4 py-2 text-gray-700">{item.buildingMode}</td>
                <td className="px-4 py-2 text-gray-700">{item.buildingNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-4">
        <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300">
        Export
          <AiFillFilePdf size={20} className="ml-2" />
          
        </button>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
        Export 
          <AiFillFileExcel size={20} className="ml-2" />
        
        </button>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
        Export
          <AiFillFileWord size={20} className="ml-2" />
          
        </button>
      </div>
    </div>
  );
};

export default EditWorkCompletionReport;