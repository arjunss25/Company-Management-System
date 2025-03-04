import React, { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminApi } from '../../../Services/AdminApi';

const NotificationModal = ({ isOpen, onClose, type, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {type === 'success' ? (
            <svg
              className="w-16 h-16 text-green-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-16 h-16 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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

const Warranty = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [editTermText, setEditTermText] = useState('');
  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const termsPerPage = 10;

  useEffect(() => {
    fetchWarrantyTerms();
  }, []);

  const fetchWarrantyTerms = async () => {
    try {
      setIsLoading(true);
      const response = await AdminApi.listWarrantyTerms();
      if (response.status === 'Success') {
        setTerms(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch warranty terms');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch warranty terms');
      setNotification({
        isOpen: true,
        type: 'error',
        message: error.message || 'Failed to fetch warranty terms',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (term) => {
    setSelectedTerm(term);
    setEditTermText(term.warranty);
    setIsEditModalOpen(true);
  };

  const handleDelete = (term) => {
    setSelectedTerm(term);
    setIsDeleteModalOpen(true);
  };

  const handleEditConfirm = async () => {
    try {
      const response = await AdminApi.editWarrantyTerms(
        selectedTerm.id,
        editTermText
      );
      if (response.status === 'Success') {
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Warranty term updated successfully',
        });
        fetchWarrantyTerms();
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.message || 'Failed to update warranty term');
      }
    } catch (error) {
      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update warranty term';
      if (typeof errorMessage === 'object') {
        errorMessage = Object.values(errorMessage).join(', ');
      }
      setNotification({
        isOpen: true,
        type: 'error',
        message: errorMessage,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await AdminApi.deleteWarrantyTerms(selectedTerm.id);
      if (response.status === 'Success') {
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Warranty term deleted successfully',
        });
        fetchWarrantyTerms();
        setIsDeleteModalOpen(false);
      } else {
        throw new Error(response.message || 'Failed to delete warranty term');
      }
    } catch (error) {
      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete warranty term';
      if (typeof errorMessage === 'object') {
        errorMessage = Object.values(errorMessage).join(', ');
      }
      setNotification({
        isOpen: true,
        type: 'error',
        message: errorMessage,
      });
    }
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, type: '', message: '' });
  };

  // Pagination logic
  const indexOfLastTerm = currentPage * termsPerPage;
  const indexOfFirstTerm = indexOfLastTerm - termsPerPage;
  const currentTerms = terms.slice(indexOfFirstTerm, indexOfLastTerm);
  const totalPages = Math.ceil(terms.length / termsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
                Warranty Terms
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
                  {currentTerms.map((term, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={term.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 w-24">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {indexOfFirstTerm + index + 1}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                          {term.warranty}
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

            {terms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No warranty terms found</p>
              </div>
            )}

            {/* Pagination */}
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstTerm + 1} to{' '}
                {Math.min(indexOfLastTerm, terms.length)} of {terms.length}{' '}
                entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  } transition-all duration-300`}
                >
                  Previous
                </button>
                {getPageNumbers().map((pageNumber) => (
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
                ))}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Update Warranty Term
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
                  onClick={handleEditConfirm}
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                Delete Warranty Term
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this term? This action cannot be
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
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
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

export default Warranty;
