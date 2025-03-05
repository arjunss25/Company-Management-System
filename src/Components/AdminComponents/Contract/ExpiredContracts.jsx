import React, { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ExpiredContracts = () => {
  const navigate = useNavigate();
  const [contracts] = useState([
    {
      id: 1,
      slno: '001',
      contractNo: 'CNT2023001',
      client: 'Tech Solutions',
      location: 'San Francisco',
      validTill: '31-12-2024',
    },
    {
      id: 2,
      slno: '002',
      contractNo: 'CNT2023002',
      client: 'Digital Innovations',
      location: 'Seattle',
      validTill: '31-12-2024',
    },
    {
      id: 3,
      slno: '003',
      contractNo: 'CNT2023003',
      client: 'Smart Systems',
      location: 'Boston',
      validTill: '31-12-2024',
    },
  ]);

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
                onClick={() => navigate('/admin/contract-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Expired Contracts
              </h1>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Slno
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Contract No
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Client
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Location
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Valid Till
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={contract.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-6 py-5">
                        <span className="text-gray-700 font-medium">
                          {contract.slno}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700 font-medium">
                          {contract.contractNo}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700">{contract.client}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700">
                          {contract.location}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-red-600 font-medium">
                          {contract.validTill}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpiredContracts;
