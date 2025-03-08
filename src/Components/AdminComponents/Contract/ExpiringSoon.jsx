import React, { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminApi } from '../../../Services/AdminApi';

const ExpiringSoon = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 10;

  useEffect(() => {
    const fetchExpiringSoonContracts = async () => {
      try {
        const response = await AdminApi.listExpiringSoonContracts();
        if (response.status === "Success") {
          const formattedContracts = response.data.map((contract, index) => ({
            id: contract.id,
            slno: (index + 1).toString().padStart(1, '0'),
            contractNo: contract.contract_no,
            client: contract.client_name,
            location: contract.location_name,
            validTill: contract.valid_till,
          }));
          setContracts(formattedContracts);
        }
      } catch (error) {
        console.error('Error fetching expiring soon contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringSoonContracts();
  }, []);

  // Pagination calculations
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = contracts.slice(indexOfFirstContract, indexOfLastContract);
  const totalPages = Math.ceil(contracts.length / contractsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
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
                Contracts Expiring Soon
              </h1>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading contracts...</div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                        <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                          Sl.No
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
                              {((currentPage - 1) * contractsPerPage) + index + 1}
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
                            <span className="text-orange-600 font-medium">
                              {contract.validTill}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {contracts.length > 0 && (
                  <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {indexOfFirstContract + 1} to{' '}
                      {Math.min(indexOfLastContract, contracts.length)} of{' '}
                      {contracts.length} entries
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                        } transition-all duration-300`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                        } transition-all duration-300`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpiringSoon;
