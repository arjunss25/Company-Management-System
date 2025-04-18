import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import { FcCancel } from 'react-icons/fc';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlinePrinter, AiOutlineFilter } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DeleteConfirmationModal from '../../Common/DeleteConfirmationModal';
import DateFilterModal from './DateFilterModal';
import axiosInstance from '../../../Config/axiosInstance';
import LoadingSpinner from '../../Common/LoadingSpinner';
import SuccessModal from '../../Common/SuccessModal';
import { PiFilePdfDuotone } from 'react-icons/pi';
import CancelConfirmationModal from './CancelConfirmationModal';
import { CiFileOn } from 'react-icons/ci';
import usePermissions from '../../../Hooks/userPermission';
import { PERMISSIONS } from '../../../Hooks/userPermission';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const ActiveQuotationTable = () => {
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);
  const [isDateFilterLoading, setIsDateFilterLoading] = useState(false);
  const { hasPermission } = usePermissions();

  const handleApplyDateFilters = async (filters) => {
    try {
      setIsDateFilterLoading(true);

      // Format dates to YYYY-MM-DD
      const formatDateForApi = (date) => {
        return new Date(date).toISOString().split('T')[0];
      };

      const response = await axiosInstance.get(
        `/filter-approved-by-date/${formatDateForApi(
          filters.dateFrom
        )}/${formatDateForApi(filters.dateTo)}/`
      );

      if (response.data.status === 'Success') {
        // Handle empty data case
        if (
          !response.data.data ||
          Object.keys(response.data.data).length === 0
        ) {
          setQuotations([]);
        } else {
          setQuotations(response.data.data);
        }
        setDateFilters(filters);
      }
    } catch (error) {
      console.error('Error applying date filters:', error);
      setQuotations([]);
    } finally {
      setIsDateFilterLoading(false);
      setIsDateFilterOpen(false);
    }
  };

  const clearFilters = () => {
    fetchQuotations();
    setDateFilters({ dateFrom: '', dateTo: '' });
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/approved-quotations/');
      if (response.data.status === 'Success') {
        setQuotations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPDF = async (quotationId) => {
    if (hasPermission(PERMISSIONS.EXPORT_ACTIVE_QUOTATIONS)) {
      try {
        setLoadingPdfId(quotationId);
        const response = await axiosInstance.get(
          `/download-quotation-pdf/${quotationId}/`,
          { responseType: 'blob' }
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
  };

  const handleCancel = (quotation) => {
    if (hasPermission(PERMISSIONS.DELETE_ACTIVE_QUOTATIONS)) {
      setQuotationToCancel(quotation);
      setIsCancelModalOpen(true);
    }
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
        fetchQuotations();
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

  const handleEdit = (quotation) => {
    if (hasPermission(PERMISSIONS.EDIT_ACTIVE_QUOTATIONS)) {
      navigate(`/edit-work-details/${quotation.id}`);
    }
  };

  const handleDelete = (quotation) => {
    setQuotationToDelete(quotation);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.post('/delete-quotation/', {
        quotation_id: quotationToDelete.id,
      });

      if (response.data.status === 'Success') {
        setCancelResult({
          success: true,
          message: 'Quotation has been successfully deleted.',
        });
        fetchQuotations();
      } else {
        setCancelResult({
          success: false,
          message: 'Failed to delete quotation. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error deleting quotation:', error);
      setCancelResult({
        success: false,
        message: 'An error occurred while deleting the quotation.',
      });
    } finally {
      setIsDeleteModalOpen(false);
      setQuotationToDelete(null);
      setIsResultModalOpen(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    // Check if the date is in DD/MM/YYYY format
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${day}-${month}-${year}`;
    }

    // Fallback for other date formats
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original string if invalid date

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if there's an error
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
            ACTIVE QUOTATIONS
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
            <div className="overflow-x-auto">
              {loading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : !Array.isArray(quotations) || quotations.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full min-h-[300px] py-8">
                  <div className="text-gray-400 mb-3 text-[3rem]">
                    <CiFileOn />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    No Active Quotations Found
                  </p>
                  {dateFilters.dateFrom && dateFilters.dateTo && (
                    <p className="text-gray-400 text-sm mt-2">
                      No quotations available for the selected date range
                    </p>
                  )}
                  {(dateFilters.dateFrom || dateFilters.dateTo) && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
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
                          <span className="px-5 py-1 bg-green-100 rounded-[1rem] text-green-500 text-[0.8rem]">
                            {quotation.quotation_status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-gray-700 whitespace-nowrap">
                          {quotation.subject}
                        </td>
                        <td className="px-8 py-5 text-center whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <motion.button
                              data-tooltip-id="action-tooltip"
                              data-tooltip-content={
                                !hasPermission(
                                  PERMISSIONS.EDIT_ACTIVE_QUOTATIONS
                                )
                                  ? "You don't have permission to edit active quotations"
                                  : ''
                              }
                              whileHover={
                                hasPermission(
                                  PERMISSIONS.EDIT_ACTIVE_QUOTATIONS
                                )
                                  ? { scale: 1.1 }
                                  : {}
                              }
                              whileTap={
                                hasPermission(
                                  PERMISSIONS.EDIT_ACTIVE_QUOTATIONS
                                )
                                  ? { scale: 0.95 }
                                  : {}
                              }
                              onClick={() => handleEdit(quotation)}
                              disabled={
                                !hasPermission(
                                  PERMISSIONS.EDIT_ACTIVE_QUOTATIONS
                                )
                              }
                              className={`p-2 rounded-lg transition-colors duration-300 ${
                                hasPermission(
                                  PERMISSIONS.EDIT_ACTIVE_QUOTATIONS
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
                                !hasPermission(
                                  PERMISSIONS.DELETE_ACTIVE_QUOTATIONS
                                )
                                  ? "You don't have permission to cancel quotations"
                                  : ''
                              }
                              whileHover={
                                hasPermission(
                                  PERMISSIONS.DELETE_ACTIVE_QUOTATIONS
                                )
                                  ? { scale: 1.1 }
                                  : {}
                              }
                              whileTap={
                                hasPermission(
                                  PERMISSIONS.DELETE_ACTIVE_QUOTATIONS
                                )
                                  ? { scale: 0.95 }
                                  : {}
                              }
                              onClick={() => handleCancel(quotation)}
                              disabled={
                                !hasPermission(
                                  PERMISSIONS.DELETE_ACTIVE_QUOTATIONS
                                )
                              }
                              className={`p-2 rounded-lg transition-colors duration-300 ${
                                hasPermission(
                                  PERMISSIONS.DELETE_ACTIVE_QUOTATIONS
                                )
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
                                  PERMISSIONS.EXPORT_ACTIVE_QUOTATIONS
                                )
                                  ? "You don't have permission to export quotations"
                                  : loadingPdfId === quotation.id
                                  ? 'Generating PDF...'
                                  : ''
                              }
                              whileHover={
                                hasPermission(
                                  PERMISSIONS.EXPORT_ACTIVE_QUOTATIONS
                                ) && !loadingPdfId
                                  ? { scale: 1.1 }
                                  : {}
                              }
                              whileTap={
                                hasPermission(
                                  PERMISSIONS.EXPORT_ACTIVE_QUOTATIONS
                                ) && !loadingPdfId
                                  ? { scale: 0.95 }
                                  : {}
                              }
                              onClick={() => handlePrintPDF(quotation.id)}
                              disabled={
                                !hasPermission(
                                  PERMISSIONS.EXPORT_ACTIVE_QUOTATIONS
                                ) || loadingPdfId === quotation.id
                              }
                              className={`p-2 rounded-lg transition-colors duration-300 ${
                                !hasPermission(
                                  PERMISSIONS.EXPORT_ACTIVE_QUOTATIONS
                                )
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : loadingPdfId === quotation.id
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

                          <Tooltip
                            id="action-tooltip"
                            place="top"
                            className="!bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                          />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Show pagination only if there are items and not loading */}
            {!loading && quotations.length > 0 && (
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setQuotationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Quotation"
        message="Are you sure you want to delete this quotation? This action cannot be undone."
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

export default ActiveQuotationTable;
