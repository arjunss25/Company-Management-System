import React, { useState } from 'react';
import Adminsidebar from '../../../Sidebar/Adminsidebar';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Quotationvalidity = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [editTermText, setEditTermText] = useState('');

  // Sample quotation validity terms
  const termsData = [
    { id: 1, terms: 'Quotation valid for 30 days from date of issue' },
    { id: 2, terms: 'Prices subject to change after validity period' },
    { id: 3, terms: 'Written confirmation required for price guarantee' },
    { id: 4, terms: 'Validity extension subject to market conditions' },
    { id: 5, terms: 'Re-quotation required after expiry date' },
  ];

  const handleEdit = (term) => {
    setSelectedTerm(term);
    setEditTermText(term.terms);
    setIsEditModalOpen(true);
  };

  const handleDelete = (term) => {
    setSelectedTerm(term);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Adminsidebar />

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
                onClick={() => navigate('/terms-and-conditions-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Quotation Validity Terms
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
                      Terms
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {termsData.map((term, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={term.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 w-24">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {term.id}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                          {term.terms}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={() => handleEdit(term)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(term)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors duration-300"
                          >
                            Delete
                          </motion.button>
                        </div>
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Update Quotation Validity Term
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms
                </label>
                <textarea
                  value={editTermText}
                  onChange={(e) => setEditTermText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle update logic here
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Quotation Validity Term
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle delete logic here
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Quotationvalidity;
