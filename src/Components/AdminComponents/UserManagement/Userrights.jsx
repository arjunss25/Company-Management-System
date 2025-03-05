import React, { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Userrights = () => {
  const navigate = useNavigate();
  const [rights, setRights] = useState({
    selectAll: false,
    rights: Array(15).fill(false),
  });

  const pages = [
    'Active Contract',
    'Add Clients',
    'Add Contract',
    'Add Locations',
    'Add Materials',
    'Add Quotation',
    'Add Rate Card',
    'Add Rate Card Item',
    'Add Rate Contract Work',
    'Add Rate Contract Work Proposal',
    'Add Regular Work',
    'Add Staff',
    'Add Terms',
    'Cancelled Quotation',
    'Dashboard',
  ];

  const handleSelectAll = () => {
    setRights({
      selectAll: !rights.selectAll,
      rights: Array(15).fill(!rights.selectAll),
    });
  };

  const handleSingleCheck = (index) => {
    const newRights = [...rights.rights];
    newRights[index] = !newRights[index];
    setRights({
      selectAll: newRights.every((right) => right),
      rights: newRights,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">

      <div className="flex-1 md:w-[calc(100%-300px)] h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8"
        >
          {/* Header section */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/staff-details')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                User Rights
              </h1>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 w-24">
                      Sl No.
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Pages
                    </th>
                    <th className="px-8 py-5 text-center text-sm font-semibold text-gray-600">
                      <label className="inline-flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={rights.selectAll}
                          onChange={handleSelectAll}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2">Select All</span>
                      </label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={index}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 w-24">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                          {page}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={rights.rights[index]}
                            onChange={() => handleSingleCheck(index)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
              >
                Save User Rights
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Userrights;
