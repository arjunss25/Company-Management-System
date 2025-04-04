import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import { FcCancel } from 'react-icons/fc';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlinePrinter, AiOutlineFilter } from 'react-icons/ai';
import { PiFilePdfDuotone } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CancelConfirmationModal from './CancelConfirmationModal';
import DateFilterModal from './DateFilterModal';
import axiosInstance from '../../../Config/axiosInstance';
import LoadingSpinner from '../../Common/LoadingSpinner';
import SuccessModal from '../../Common/SuccessModal';
import usePermissions from '../../../Hooks/userPermission';
import { PERMISSIONS } from '../../../Hooks/userPermission';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const PendingForApproval = () => {
  const navigate = useNavigate();
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [dateFilters, setDateFilters] = useState({ dateFrom: '', dateTo: '' });
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingPdfId, setLoadingPdfId] = useState(null);
  const [isDateFilterLoading, setIsDateFilterLoading] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [cancelResult, setCancelResult] = useState({
    success: false,
    message: '',
  });
  const { hasPermission } = usePermissions();
  const [unauthorizedModalOpen, setUnauthorizedModalOpen] = useState(false);
  const [unauthorizedAction, setUnauthorizedAction] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchPendingQuotations();
  }, []);

  const fetchPendingQuotations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/pending-quotations/');
      if (response.data.status === 'Success') {
        setQuotations(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching pending quotations:', error);
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
        `/filter-pending-by-date/${formatDateForApi(
          filters.dateFrom
        )}/${formatDateForApi(filters.dateTo)}/`
      );

      if (response.data.status === 'Success') {
        setQuotations(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
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

  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [quotationToCancel, setQuotationToCancel] = useState(null);

  const checkPermissionAndExecute = (action, permission, callback) => {
    if (hasPermission(permission)) {
      callback();
    } else {
      setUnauthorizedAction(action);
      setUnauthorizedModalOpen(true);
    }
  };

  const handleEdit = (quotation) => {
    checkPermissionAndExecute('edit', PERMISSIONS.EDIT_PENDING_QUOTATIONS, () =>
      navigate(`/edit-work-details/${quotation.id}`)
    );
  };

  const handleCancel = (quotation) => {
    checkPermissionAndExecute('cancel', PERMISSIONS.CANCEL_QUOTATION, () => {
      setQuotationToCancel(quotation);
      setIsCancelModalOpen(true);
    });
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
        fetchPendingQuotations(); // Refresh the list
      } else {
        setCancelResult({
          success: false,
          message: 'Failed to cancel quotation. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error cancelling quotation:', error);
      setCancelResult({
        success: false,
        message: 'An error occurred while cancelling the quotation.',
      });
    } finally {
      setIsCancelModalOpen(false);
      setQuotationToCancel(null);
      setIsResultModalOpen(true);
    }
  };

  const handlePrintPDF = (quotationId) => {
    checkPermissionAndExecute(
      'export',
      PERMISSIONS.EXPORT_PENDING_QUOTATIONS,
      async () => {
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
      }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return quotations.slice(indexOfFirstItem, indexOfLastItem);
  };

  const UnauthorizedModal = ({ isOpen, onClose, action }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">
              Unauthorized Action
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have permission to {action} this quotation. Please
              contact your administrator for access.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
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
            PENDING FOR APPROVAL QUOTATIONS
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
                <LoadingSpinner />
              ) : quotations.length === 0 ? (
                <div className="flex items-center justify-center w-full min-h-[200px]">
                  <p className="text-gray-500 text-lg">
                    No pending quotations found
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
                        Quotation Status
                      </th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                        Amount
                      </th>
                      <th className="px-8 py-5 text-center text-sm font-semibold text-gray-600 whitespace-nowrap">
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
                        <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                          {quotation.date}
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
                          <span className="px-5 py-1 bg-red-100 rounded-[1rem] text-red-500 text-[0.8rem]">
                            {quotation.quotation_status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-gray-700">
                          {quotation.subject}
                        </td>
                        <td className="px-8 py-5 text-center whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <motion.button
                              data-tooltip-id="action-tooltip"
                              data-tooltip-content={
                                !hasPermission(
                                  PERMISSIONS.EDIT_PENDING_QUOTATIONS
                                )
                                  ? "You don't have permission to edit quotations"
                                  : ''
                              }
                              whileHover={
                                hasPermission(
                                  PERMISSIONS.EDIT_PENDING_QUOTATIONS
                                )
                                  ? { scale: 1.1 }
                                  : {}
                              }
                              whileTap={
                                hasPermission(
                                  PERMISSIONS.EDIT_PENDING_QUOTATIONS
                                )
                                  ? { scale: 0.95 }
                                  : {}
                              }
                              onClick={() => handleEdit(quotation)}
                              disabled={
                                !hasPermission(
                                  PERMISSIONS.EDIT_PENDING_QUOTATIONS
                                )
                              }
                              className={`p-2 rounded-lg transition-colors duration-300 ${
                                hasPermission(
                                  PERMISSIONS.EDIT_PENDING_QUOTATIONS
                                )
                                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <FiEdit size={18} />
                            </motion.button>

                            <motion.button
                              data-tooltip-id="action-tooltip"
                              data-tooltip-content={
                                !hasPermission(PERMISSIONS.CANCEL_QUOTATION)
                                  ? "You don't have permission to cancel quotations"
                                  : ''
                              }
                              whileHover={
                                hasPermission(PERMISSIONS.CANCEL_QUOTATION)
                                  ? { scale: 1.1 }
                                  : {}
                              }
                              whileTap={
                                hasPermission(PERMISSIONS.CANCEL_QUOTATION)
                                  ? { scale: 0.95 }
                                  : {}
                              }
                              onClick={() => handleCancel(quotation)}
                              disabled={
                                !hasPermission(PERMISSIONS.CANCEL_QUOTATION)
                              }
                              className={`p-2 rounded-lg transition-colors duration-300 ${
                                hasPermission(PERMISSIONS.CANCEL_QUOTATION)
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <FcCancel size={18} />
                            </motion.button>

                            <motion.button
                              data-tooltip-id="action-tooltip"
                              data-tooltip-content={
                                !hasPermission(
                                  PERMISSIONS.EXPORT_PENDING_QUOTATIONS
                                )
                                  ? "You don't have permission to export quotations"
                                  : loadingPdfId === quotation.id
                                  ? 'Generating PDF...'
                                  : ''
                              }
                              whileHover={
                                hasPermission(
                                  PERMISSIONS.EXPORT_PENDING_QUOTATIONS
                                )
                                  ? { scale: 1.1 }
                                  : {}
                              }
                              whileTap={
                                hasPermission(
                                  PERMISSIONS.EXPORT_PENDING_QUOTATIONS
                                )
                                  ? { scale: 0.95 }
                                  : {}
                              }
                              onClick={() => handlePrintPDF(quotation.id)}
                              disabled={
                                !hasPermission(
                                  PERMISSIONS.EXPORT_PENDING_QUOTATIONS
                                ) || loadingPdfId === quotation.id
                              }
                              className={`p-2 rounded-lg transition-colors duration-300 ${
                                !hasPermission(
                                  PERMISSIONS.EXPORT_PENDING_QUOTATIONS
                                )
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : loadingPdfId === quotation.id
                                  ? 'bg-gray-100 cursor-not-allowed'
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {loadingPdfId === quotation.id ? (
                                <svg
                                  className="animate-spin h-5 w-5 text-gray-600"
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
                              ) : (
                                <PiFilePdfDuotone size={18} />
                              )}
                            </motion.button>
                          </div>

                          <Tooltip
                            id="action-tooltip"
                            place="top"
                            className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                          />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* pagination */}
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
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
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
        isLoading={isDateFilterLoading}
        initialDates={dateFilters}
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

      <UnauthorizedModal
        isOpen={unauthorizedModalOpen}
        onClose={() => setUnauthorizedModalOpen(false)}
        action={unauthorizedAction}
      />
    </div>
  );
};

export default PendingForApproval;
