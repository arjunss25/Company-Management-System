import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminApi } from '../../../Services/AdminApi';

const ActiveContract = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 10;

  // Add pagination handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchActiveContracts();
  }, []);

  const fetchActiveContracts = async () => {
    try {
      const response = await AdminApi.listActiveContracts();
      const contractsData = response?.data || [];
      setContracts(contractsData);
    } catch (error) {
      console.error('Error fetching active contracts:', error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination values
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = contracts.slice(indexOfFirstContract, indexOfLastContract);
  const totalPages = Math.ceil(contracts.length / contractsPerPage);

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
                onClick={() => navigate('/contract-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Active Contracts
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
                      Contract No
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Client Name
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Location
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Rate Card
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Valid Till
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentContracts.map((contract, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={contract.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-6 py-5">
                        <span className="text-gray-700 font-medium">
                          {contract.contract_no}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700">
                          {contract.client_name}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700">
                          {contract.location_name}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700">
                          {contract.rate_cardname}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700">
                          {contract.valid_till}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {contract.contract_status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstContract + 1} to{' '}
                {Math.min(indexOfLastContract, contracts.length)} of{' '}
                {contracts.length} contracts
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  } transition-all duration-300`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      } transition-all duration-300`}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  } transition-all duration-300`}
                >
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

export default ActiveContract;
