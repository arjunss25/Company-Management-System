import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import { FcCancel } from 'react-icons/fc';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlineFilter } from 'react-icons/ai';
import { PiFilePdfDuotone } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DateFilterModal from '../DateFilterModal';
import axiosInstance from '../../../../Config/axiosInstance';
import LoadingSpinner from '../../../Common/LoadingSpinner';
import SuccessModal from '../../../Common/SuccessModal';
import CancelConfirmationModal from '../CancelConfirmationModal';

const NoAccess = () => {
  const navigate = useNavigate();
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [dateFilters, setDateFilters] = useState({ dateFrom: '', dateTo: '' });
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPdfId, setLoadingPdfId] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [quotationToCancel, setQuotationToCancel] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [cancelResult, setCancelResult] = useState({
    success: false,
    message: '',
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchQuotations();
  }, [currentPage]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        page_size: itemsPerPage,
      };

      if (dateFilters.dateFrom && dateFilters.dateTo) {
        params.date_from = dateFilters.dateFrom;
        params.date_to = dateFilters.dateTo;
      }

      const response = await axiosInstance.get('/list-no-access-work-status/', {
        params,
      });

      if (response.data.status === 'Success') {
        setQuotations(response.data.data);
        const totalCount =
          parseInt(response.data.total_count) || response.data.data.length;
        const calculatedTotalPages = Math.max(
          1,
          Math.ceil(totalCount / itemsPerPage)
        );
        setTotalPages(calculatedTotalPages);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
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
    } finally {
      setLoadingPdfId(null);
    }
  };

  const handleCancel = (quotation) => {
    setQuotationToCancel(quotation);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await axiosInstance.post('/cancel-quotations/', {
        quotation_id: quotationToCancel.id,
      });

      if (response.data.status === 'Success') {
        setCancelResult({
          success: true,
          message: 'Quotation has been successfully cancelled.',
        });
        setIsCancelModalOpen(false);
        setQuotationToCancel(null);
        setIsResultModalOpen(true);
        await fetchQuotations();
      } else {
        setCancelResult({
          success: false,
          message: 'Failed to cancel quotation. Please try again.',
        });
        setIsCancelModalOpen(false);
        setQuotationToCancel(null);
        setIsResultModalOpen(true);
      }
    } catch (error) {
      console.error('Error cancelling quotation:', error);
      setCancelResult({
        success: false,
        message: 'An error occurred while cancelling the quotation.',
      });
      setIsCancelModalOpen(false);
      setQuotationToCancel(null);
      setIsResultModalOpen(true);
    }
  };

  const handleEdit = (quotation) => {
    navigate(`/edit-work-details/${quotation.id}`);
  };

  const handleApplyDateFilters = (filters) => {
    setDateFilters(filters);
    setIsDateFilterOpen(false);
    setCurrentPage(1);
    fetchQuotations();
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return '';

    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${day}-${month}-${year}`;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-center">
            Quotations Work Status - No Access
          </h1>

          {/* Date Filter */}
          <div className="flex items-center justify-end space-x-4 mb-10">
            <button
              onClick={() => setIsDateFilterOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              <AiOutlineFilter size={20} />
              <span>
                {dateFilters.dateFrom && dateFilters.dateTo
                  ? `${formatDate(dateFilters.dateFrom)} to ${formatDate(
                      dateFilters.dateTo
                    )}`
                  : 'Select Date Range'}
              </span>
            </button>
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <LoadingSpinner />
                </div>
              ) : quotations.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
                  <svg
                    className="w-16 h-16 mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-xl font-medium">No Quotations Available</p>
                  <p className="mt-2 text-gray-400">
                    {dateFilters.dateFrom && dateFilters.dateTo
                      ? 'No quotations found for the selected date range'
                      : 'No quotations found in the system'}
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                        Quotation No
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                        Client
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                        Location
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                        Building Name
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                        Building No
                      </th>
                      <th className="px-8 py-5 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.map((quotation, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        key={quotation.id}
                        className="group hover:bg-blue-50/50 transition-colors duration-300"
                      >
                        <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                          {formatDate(quotation.date)}
                        </td>
                        <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                          {quotation.quotation_no}
                        </td>
                        <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                          {quotation.client}
                        </td>
                        <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                          {quotation.location}
                        </td>
                        <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                          {quotation.company}
                        </td>
                        <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                          {quotation.job_no}
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
                              onClick={() => handleCancel(quotation)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                            >
                              <FcCancel size={18} />
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
                                <div className="animate-spin h-4 w-4">
                                  <svg
                                    className="text-gray-600"
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
              )}
            </div>

            {/* Pagination */}
            {quotations.length > 0 && (
              <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
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
                        Math.min(totalPages || 1, prev + 1)
                      )
                    }
                    disabled={currentPage === (totalPages || 1)}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <DateFilterModal
        isOpen={isDateFilterOpen}
        onClose={() => setIsDateFilterOpen(false)}
        onApply={handleApplyDateFilters}
      />

      <CancelConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setQuotationToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        quotation={quotationToCancel}
      />

      <SuccessModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        success={cancelResult.success}
        message={cancelResult.message}
      />
    </div>
  );
};

export default NoAccess;
