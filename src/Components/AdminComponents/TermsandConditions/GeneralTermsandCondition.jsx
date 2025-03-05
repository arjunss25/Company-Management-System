import React, { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminApi } from '../../../Services/AdminApi';

const NotificationModal = ({ isOpen, onClose, type, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {type === 'success' ? (
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600"
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
          )}
          <h3
            className={`text-xl font-semibold mb-2 ${
              type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {type === 'success' ? 'Success!' : 'Error!'}
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-white font-medium
              ${
                type === 'success'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              }
              transition-colors duration-200`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const GeneralTermsandCondition = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [editTermText, setEditTermText] = useState('');
  const [termsData, setTermsData] = useState({
    loading: true,
    error: null,
    data: [],
  });
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination values
  const totalPages = Math.ceil(termsData.data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = termsData.data.slice(startIndex, endIndex);

  const fetchTermsAndConditions = async () => {
    try {
      setTermsData((prev) => ({ ...prev, loading: true, error: null }));
      const response = await AdminApi.listTermsAndConditions();

      if (response.status === 'Success' && response.data) {
        setTermsData({
          loading: false,
          error: null,
          data: response.data,
        });
      } else {
        throw new Error(
          response.message || 'Failed to fetch terms and conditions'
        );
      }
    } catch (error) {
      setTermsData({
        loading: false,
        error: error.message || 'Failed to fetch terms and conditions',
        data: [],
      });
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  const handleEdit = (term) => {
    setSelectedTerm(term);
    setEditTermText(term.title);
    setIsEditModalOpen(true);
  };

  const handleDelete = (term) => {
    setSelectedTerm(term);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editTermText.trim()) {
      setNotification({
        isOpen: true,
        type: 'error',
        message: 'Please enter terms and conditions',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AdminApi.editTermsAndConditions(
        selectedTerm.id,
        editTermText
      );
      if (response.status === 'Success') {
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Terms and conditions updated successfully',
        });
        setIsEditModalOpen(false);
        fetchTermsAndConditions(); 
      } else {
        throw new Error(
          response.message || 'Failed to update terms and conditions'
        );
      }
    } catch (error) {
      setNotification({
        isOpen: true,
        type: 'error',
        message: error.message || 'Failed to update terms and conditions',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await AdminApi.deleteTermsAndConditions(selectedTerm.id);
      if (response.status === 'Success') {
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Terms and conditions deleted successfully',
        });
        setIsDeleteModalOpen(false);
        fetchTermsAndConditions(); 
      } else {
        throw new Error(
          response.message || 'Failed to delete terms and conditions'
        );
      }
    } catch (error) {
      setNotification({
        isOpen: true,
        type: 'error',
        message: error.message || 'Failed to delete terms and conditions',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      startPage = 2;
      endPage = 4;
    }

    if (currentPage >= totalPages - 2) {
      startPage = totalPages - 3;
      endPage = totalPages - 1;
    }

    if (startPage > 2) {
      pages.push('...');
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex">
      <div className="flex-1 md:w-[calc(100%-300px)]">
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
                onClick={() =>
                  navigate('/admin/terms-and-conditions-dashboard')
                }
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                General Terms & Conditions
              </h1>
            </div>
          </div>

          {/* Loading State */}
          {termsData.loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {termsData.error && (
            <div className="text-center p-8">
              <div className="text-red-500 mb-4">{termsData.error}</div>
              <button
                onClick={fetchTermsAndConditions}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Table Container */}
          {!termsData.loading && !termsData.error && (
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
                    {currentItems.map((term, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        key={term.id}
                        className="group hover:bg-blue-50/50 transition-colors duration-300"
                      >
                        <td className="px-8 py-5 w-24">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                            {startIndex + index + 1}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                            {term.title}
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
                    {termsData.data.length === 0 && (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-8 py-12 text-center text-gray-500"
                        >
                          No terms and conditions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {termsData.data.length > 0 && (
                <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to{' '}
                    {Math.min(endIndex, termsData.data.length)} of{' '}
                    {termsData.data.length} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      } transition-all duration-300`}
                    >
                      Previous
                    </button>
                    {getPageNumbers().map((pageNumber, index) =>
                      pageNumber === '...' ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 text-gray-500"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
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
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Update Terms & Condition
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
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
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
                Delete Terms & Condition
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        message={notification.message}
      />
    </div>
  );
};

export default GeneralTermsandCondition;
