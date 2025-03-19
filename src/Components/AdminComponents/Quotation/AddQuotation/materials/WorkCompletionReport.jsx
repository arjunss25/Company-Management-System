import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AiFillFilePdf, AiFillFileExcel, AiFillFileWord } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { selectQuotationId } from '../../../../../store/slices/quotationSlice';
import axiosInstance from '../../../../../Config/axiosInstance';

const WorkCompletionReport = () => {
  const quotationId = useSelector(selectQuotationId);
  const [workCompletionData, setWorkCompletionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: '',
    message: '',
  });
  const [exportingFormat, setExportingFormat] = useState(null);

  useEffect(() => {
    fetchWorkCompletionData();
  }, [quotationId]);

  const fetchWorkCompletionData = async () => {
    if (!quotationId) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/work-completion-details/${quotationId}/`
      );
      setWorkCompletionData(response.data.data);
    } catch (error) {
      console.error('Error fetching work completion data:', error);
      setError('Failed to load work completion data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to safely render any value
  const renderValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'object') {
      if (value.name) return value.name;
      if (value.value) return value.value;
      if (value.toString && value.toString() !== '[object Object]')
        return value.toString();
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Function to download file from blob response
  const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // Handle export - update to use actual APIs
  const handleExport = async (format) => {
    if (!quotationId) {
      setStatusMessage({
        type: 'error',
        message: 'No quotation selected for export',
      });
      setShowStatusModal(true);
      return;
    }

    setExportingFormat(format);

    try {
      let response;
      let fileName;

      switch (format) {
        case 'pdf':
          response = await axiosInstance.get(
            `/workcompletion/export/pdf/${quotationId}/`,
            { responseType: 'blob' }
          );
          fileName = `work-completion-${quotationId}.pdf`;
          break;
        case 'excel':
          response = await axiosInstance.get(
            `/workcompletion/export/excel/${quotationId}/`,
            { responseType: 'blob' }
          );
          fileName = `work-completion-${quotationId}.xlsx`;
          break;
        case 'word':
          response = await axiosInstance.get(
            `/workcompletion/export/word/${quotationId}/`,
            { responseType: 'blob' }
          );
          fileName = `work-completion-${quotationId}.docx`;
          break;
        default:
          throw new Error('Invalid format');
      }

      downloadFile(response.data, fileName);

      setStatusMessage({
        type: 'success',
        message: `Work completion report exported as ${format.toUpperCase()} successfully`,
      });
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      setStatusMessage({
        type: 'error',
        message: `Failed to export work completion report as ${format.toUpperCase()}`,
      });
    } finally {
      setShowStatusModal(true);
      setExportingFormat(null);
    }
  };

  return (
    <div className="p-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-lg text-gray-600">
            Loading work completion data...
          </span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : workCompletionData ? (
        <>
          {/* Work Completion Summary */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Work Completion Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Quotation Number</p>
                <p className="text-lg font-medium">
                  {workCompletionData.quotation_no || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="text-lg font-medium">
                  {workCompletionData.date || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Project Status</p>
                <p className="text-lg font-medium">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      workCompletionData.project_status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {workCompletionData.project_status || '-'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="text-lg font-medium">
                  {workCompletionData.location || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Quotation Status</p>
                <p className="text-lg font-medium">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      workCompletionData.quotation_status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {workCompletionData.quotation_status || '-'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Option</p>
                <p className="text-lg font-medium">
                  {workCompletionData.option || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Unit Option</p>
                <p className="text-lg font-medium">
                  {workCompletionData.unit_option || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Scheduled Handover */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-800">
                  Scheduled Handover
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sl. No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scheduled Handover Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        1
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workCompletionData.location || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {workCompletionData.scheduled_hand_over_date || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-800">
                  Work Information
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sl. No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Building No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Work Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workCompletionData.units &&
                    workCompletionData.units.length > 0 ? (
                      workCompletionData.units.map((unit, index) => (
                        <tr
                          key={unit.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {unit.unit_type || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {unit.building_number || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {unit.start_date || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {unit.end_date || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                unit.work_status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : unit.work_status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {unit.work_status || '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No units available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50"
              onClick={() => handleExport('pdf')}
              disabled={exportingFormat !== null}
            >
              {exportingFormat === 'pdf' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  Export PDF
                  <AiFillFilePdf size={20} className="ml-2" />
                </>
              )}
            </button>
            <button
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50"
              onClick={() => handleExport('excel')}
              disabled={exportingFormat !== null}
            >
              {exportingFormat === 'excel' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  Export Excel
                  <AiFillFileExcel size={20} className="ml-2" />
                </>
              )}
            </button>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              onClick={() => handleExport('word')}
              disabled={exportingFormat !== null}
            >
              {exportingFormat === 'word' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  Export Word
                  <AiFillFileWord size={20} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          No work completion data available. Please select a quotation first.
        </div>
      )}

      {/* Status Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-6"
            >
              <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-xl font-semibold ${
                      statusMessage.type === 'success'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {statusMessage.type === 'success' ? 'Success' : 'Error'}
                  </h3>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">{statusMessage.message}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      statusMessage.type === 'success'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                    } transition-colors`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkCompletionReport;
