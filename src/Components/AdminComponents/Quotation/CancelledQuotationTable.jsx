import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlineFilter, AiOutlinePrinter } from 'react-icons/ai';
import { PiFilePdfDuotone } from 'react-icons/pi';
import { GrRevert } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DateFilterModal from './DateFilterModal';
import axiosInstance from '../../../Config/axiosInstance';
import LoadingSpinner from '../../Common/LoadingSpinner';
import RevertConfirmationModal from '../../Common/RevertConfirmationModal';
import SuccessModal from '../../Common/SuccessModal';

const CancelledQuotationTable = () => {
  const navigate = useNavigate();
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [dateFilters, setDateFilters] = useState({ dateFrom: '', dateTo: '' });
  const [quotations, setQuotations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPdfId, setLoadingPdfId] = useState(null);
  const [isDateFilterLoading, setIsDateFilterLoading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchCancelledQuotations();
  }, []);

  const fetchCancelledQuotations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/list-cancelled-quotations/');
      if (response.data.status === 'Success') {
        setQuotations(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching cancelled quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDateFilters = async (filters) => {
    try {
      setIsDateFilterLoading(true);

      // Format dates to YYYY-MM-DD
      const formatDateForApi = (date) => {
        return new Date(date).toISOString().split('T')[0];
      };

      const response = await axiosInstance.get(
        `/filter-quotations/${formatDateForApi(
          filters.dateFrom
        )}/${formatDateForApi(filters.dateTo)}/`
      );

      if (response.data.status === 'Success') {
        // Filter only cancelled quotations from the response
        const cancelledQuotations = response.data.data.filter(
          (quote) => quote.is_cancelled
        );
        setQuotations(cancelledQuotations);
        setTotalPages(Math.ceil(cancelledQuotations.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page
        setDateFilters(filters);
      }
    } catch (error) {
      console.error('Error applying date filters:', error);
    } finally {
      setIsDateFilterLoading(false);
      setIsDateFilterOpen(false);
    }
  };

  const clearFilters = () => {
    fetchCancelledQuotations();
    setDateFilters({ dateFrom: '', dateTo: '' });
  };

  // Calculate pagination range
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Get current page items
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return quotations.slice(indexOfFirstItem, indexOfLastItem);
  };

  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);
  const [quotationToRevert, setQuotationToRevert] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [revertResult, setRevertResult] = useState({
    success: false,
    message: '',
  });

  const handleEdit = (quotation) => {
    navigate(`/admin/edit-quotation/${quotation.id}`);
  };

  const handleRevert = (quotation) => {
    setQuotationToRevert(quotation);
    setIsRevertModalOpen(true);
  };

  const handleConfirmRevert = async () => {
    try {
      const response = await axiosInstance.post(
        '/revert-cancelled-quotations/',
        {
          quotation_id: quotationToRevert.id,
        }
      );

      if (response.data.status === 'Success') {
        setRevertResult({
          success: true,
          message: 'Quotation has been successfully reverted.',
        });
        fetchCancelledQuotations();
      } else {
        setRevertResult({
          success: false,
          message: 'Failed to revert quotation. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error reverting quotation:', error);
      setRevertResult({
        success: false,
        message:
          'An error occurred while reverting the quotation. Please try again.',
      });
    } finally {
      setIsRevertModalOpen(false);
      setQuotationToRevert(null);
      setIsResultModalOpen(true);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePrintPDF = async (quotationId) => {
    try {
      setLoadingPdfId(quotationId);
      const response = await axiosInstance.get(
        `/download-quotation-pdf/${quotationId}/`,
        {
          responseType: 'blob',
        }
      );

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // You can show your error modal here if needed
    } finally {
      setLoadingPdfId(null);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 ">
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
                onClick={() => navigate('/admin/quotation-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-center mb-8">
            CANCELLED QUOTATIONS
          </h1>

          {/* Date Filter */}
          <div className="flex items-center justify-end space-x-4 mb-10">
            <button
              onClick={() => setIsDateFilterOpen(true)}
              disabled={isDateFilterLoading}
              className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ${
                isDateFilterLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isDateFilterLoading ? (
                <div className="animate-spin w-5 h-5">
                  <svg
                    className="w-full h-full text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              ) : (
                <AiOutlineFilter size={20} />
              )}
              <span>
                {dateFilters.dateFrom && dateFilters.dateTo
                  ? `${formatDate(dateFilters.dateFrom)} to ${formatDate(
                      dateFilters.dateTo
                    )}`
                  : 'Select Date Range'}
              </span>
            </button>
            {(dateFilters.dateFrom || dateFilters.dateTo) && (
              <button
                onClick={clearFilters}
                disabled={isDateFilterLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            {loading ? (
              <LoadingSpinner />
            ) : quotations.length === 0 ? (
              <div className="flex items-center justify-center w-full min-h-[200px]">
                <p className="text-gray-500 text-lg">
                  No cancelled quotations found
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                          Quotation No
                        </th>
                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                          Client
                        </th>
                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                          Location
                        </th>
                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                          Subject
                        </th>
                        <th className="px-8 py-5 text-center text-sm font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentItems().map((quotation, index) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          key={quotation.id}
                          className="group hover:bg-blue-50/50 transition-colors duration-300"
                        >
                          <td className="px-8 py-5 text-gray-700">
                            {quotation.date}
                          </td>
                          <td className="px-8 py-5 text-gray-700">
                            {quotation.quotation_no}
                          </td>
                          <td className="px-8 py-5 text-gray-700">
                            {quotation.client}
                          </td>
                          <td className="px-8 py-5 text-gray-700">
                            {quotation.location}
                          </td>
                          <td className="px-8 py-5 text-gray-700">
                            {quotation.subject}
                          </td>
                          <td className="px-8 py-5 text-center whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEdit(quotation)}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                              >
                                <FiEdit size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRevert(quotation)}
                                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-300"
                              >
                                <GrRevert size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePrintPDF(quotation.id)}
                                disabled={loadingPdfId === quotation.id}
                                className={`p-2 rounded-lg transition-colors duration-300 ${
                                  loadingPdfId === quotation.id
                                    ? 'bg-gray-100 cursor-not-allowed'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {loadingPdfId === quotation.id ? (
                                  <div className="animate-spin">
                                    <svg
                                      className="w-[18px] h-[18px] text-gray-400"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      />
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      />
                                    </svg>
                                  </div>
                                ) : (
                                  <PiFilePdfDuotone size={18} />
                                )}
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - Only show if there are items */}
                {quotations.length > 0 && (
                  <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {getPageNumbers().map((number) => (
                        <button
                          key={number}
                          onClick={() => setCurrentPage(number)}
                          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                            currentPage === number
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

      <RevertConfirmationModal
        isOpen={isRevertModalOpen}
        onClose={() => {
          setIsRevertModalOpen(false);
          setQuotationToRevert(null);
        }}
        onConfirm={handleConfirmRevert}
      />

      <SuccessModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        success={revertResult.success}
        message={revertResult.message}
      />

      <DateFilterModal
        isOpen={isDateFilterOpen}
        onClose={() => setIsDateFilterOpen(false)}
        onApply={handleApplyDateFilters}
        isLoading={isDateFilterLoading}
        initialDates={dateFilters}
      />
    </div>
  );
};

export default CancelledQuotationTable;
