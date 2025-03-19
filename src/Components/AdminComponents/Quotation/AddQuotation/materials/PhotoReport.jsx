import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AiFillFilePdf, AiFillFileExcel, AiFillFileWord } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { selectQuotationId } from '../../../../../store/slices/quotationSlice';
import {
  getBuildingNumbers,
  addPhotoReport,
  editPhotoReport,
  deletePhotoReport,
  getPhotoReports,
  exportPhotoReportPDF,
  exportPhotoReportExcel,
  exportPhotoReportWord,
} from '../../../../../Services/QuotationApi';
import SearchableDropdown from '../../../../Common/SearchableDropdown';

const PhotoReport = () => {
  const quotationId = useSelector(selectQuotationId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buildingNumbers, setBuildingNumbers] = useState([]);
  const [buildingsLoading, setBuildingsLoading] = useState(false);

  const [formData, setFormData] = useState({
    building: '',
    beforeTitle: '',
    beforePhoto: null,
    afterTitle: '',
    afterPhoto: null,
  });
  const [reports, setReports] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: '',
    message: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportingFormat, setExportingFormat] = useState(null);

  useEffect(() => {
    const fetchBuildingNumbers = async () => {
      if (quotationId) {
        setBuildingsLoading(true);
        try {
          const numbers = await getBuildingNumbers(quotationId);
          setBuildingNumbers(
            numbers.map((building) => ({
              id: building.id,
              name: building.building_number,
            }))
          );
        } catch (error) {
          console.error('Error fetching building numbers:', error);
        } finally {
          setBuildingsLoading(false);
        }
      }
    };

    fetchBuildingNumbers();
  }, [quotationId]);

  // fetchPhotoReports function
  const fetchPhotoReports = async () => {
    if (!quotationId) return;

    setLoading(true);
    try {
      const reportsData = await getPhotoReports(quotationId);
      setReports(reportsData || []);
    } catch (error) {
      console.error('Error fetching photo reports:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to load photo reports',
      });
      setShowStatusModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports
  useEffect(() => {
    fetchPhotoReports();
  }, [quotationId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleBuildingChange = (building) => {
    setFormData((prev) => ({
      ...prev,
      building: building.id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quotationId) {
      setStatusMessage({
        type: 'error',
        message: 'Please fill work details first to get quotation ID',
      });
      setShowStatusModal(true);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('quotation', quotationId.toString());
    formDataToSend.append('building', formData.building);
    formDataToSend.append('before_title', formData.beforeTitle);
    if (formData.beforePhoto) {
      formDataToSend.append('before_photo', formData.beforePhoto);
    }
    formDataToSend.append('after_title', formData.afterTitle);
    if (formData.afterPhoto) {
      formDataToSend.append('after_photo', formData.afterPhoto);
    }

    try {
      let response;
      if (isEditMode) {
        response = await editPhotoReport(editId, quotationId, formDataToSend);
      } else {
        response = await addPhotoReport(formDataToSend);
      }

      setFormData({
        building: '',
        beforeTitle: '',
        beforePhoto: null,
        afterTitle: '',
        afterPhoto: null,
      });
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditId(null);

      setStatusMessage({
        type: 'success',
        message: isEditMode
          ? 'Photo report updated successfully'
          : 'Photo report added successfully',
      });

      fetchPhotoReports();
    } catch (error) {
      console.error('Failed to handle photo report:', error);
      setStatusMessage({
        type: 'error',
        message:
          error.response?.data?.message ||
          `Failed to ${isEditMode ? 'update' : 'add'} photo report`,
      });
    } finally {
      setShowStatusModal(true);
    }
  };

  const handleEdit = (report) => {
    setFormData({
      building: report.building,
      beforeTitle: report.before_title,
      beforePhoto: null, 
      afterTitle: report.after_title,
      afterPhoto: null, 
    });
    setIsEditMode(true);
    setEditId(report.id);
    setIsModalOpen(true);
  };

  const handleDelete = (report) => {
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePhotoReport(reportToDelete.id, quotationId);
      const updatedReports = reports.filter(
        (report) => report.id !== reportToDelete.id
      );
      setReports(updatedReports);

      setStatusMessage({
        type: 'success',
        message: 'Photo report deleted successfully',
      });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message:
          error.response?.data?.message || 'Failed to delete photo report',
      });
    } finally {
      setShowStatusModal(true);
      setShowDeleteModal(false);
      setReportToDelete(null);
    }
  };

  const getBuildingNumber = (buildingId) => {
    const building = buildingNumbers.find((b) => b.id === buildingId);
    return building ? building.name : buildingId;
  };

  //file download
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

  // Functions to handle export
  const handleExportPDF = async () => {
    if (!quotationId) {
      setStatusMessage({
        type: 'error',
        message: 'No quotation selected for export',
      });
      setShowStatusModal(true);
      return;
    }

    setExportingFormat('pdf');
    try {
      const blob = await exportPhotoReportPDF(quotationId);
      downloadFile(blob, `photo-report-${quotationId}.pdf`);
      setStatusMessage({
        type: 'success',
        message: 'Photo report exported as PDF successfully',
      });
      setShowStatusModal(true);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to export photo report as PDF',
      });
      setShowStatusModal(true);
    } finally {
      setExportingFormat(null);
    }
  };

  const handleExportExcel = async () => {
    if (!quotationId) {
      setStatusMessage({
        type: 'error',
        message: 'No quotation selected for export',
      });
      setShowStatusModal(true);
      return;
    }

    setExportingFormat('excel');
    try {
      const blob = await exportPhotoReportExcel(quotationId);
      downloadFile(blob, `photo-report-${quotationId}.xlsx`);
      setStatusMessage({
        type: 'success',
        message: 'Photo report exported as Excel successfully',
      });
      setShowStatusModal(true);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to export photo report as Excel',
      });
      setShowStatusModal(true);
    } finally {
      setExportingFormat(null);
    }
  };

  const handleExportWord = async () => {
    if (!quotationId) {
      setStatusMessage({
        type: 'error',
        message: 'No quotation selected for export',
      });
      setShowStatusModal(true);
      return;
    }

    setExportingFormat('word');
    try {
      const blob = await exportPhotoReportWord(quotationId);
      downloadFile(blob, `photo-report-${quotationId}.docx`);
      setStatusMessage({
        type: 'success',
        message: 'Photo report exported as Word successfully',
      });
      setShowStatusModal(true);
    } catch (error) {
      console.error('Error exporting Word:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to export photo report as Word',
      });
      setShowStatusModal(true);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Add Photo Report
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-6"
            >
              <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isEditMode ? 'Edit Photo Report' : 'Add Photo Report'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <SearchableDropdown
                    options={buildingNumbers}
                    value={formData.building}
                    onChange={handleBuildingChange}
                    placeholder="Select a building number"
                    isLoading={buildingsLoading}
                    label="Building No"
                  />

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Before Title
                    </span>
                    <input
                      type="text"
                      name="beforeTitle"
                      value={formData.beforeTitle}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Before Photo
                    </span>
                    <input
                      type="file"
                      name="beforePhoto"
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      After Title
                    </span>
                    <input
                      type="text"
                      name="afterTitle"
                      value={formData.afterTitle}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      After Photo
                    </span>
                    <input
                      type="file"
                      name="afterPhoto"
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>
                </div>
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/*Photo Reports Table */}
      <div className="mt-8 overflow-hidden bg-white rounded-lg shadow">
        <div className="sm:flex sm:items-center sm:justify-between p-4 bg-gray-50">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Photo Reports List
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              A list of all photo reports added to this quotation
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Photo Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Sl. No',
                  'Building No',
                  'Before Title',
                  'Before Photo',
                  'After Title',
                  'After Photo',
                  'Actions',
                ].map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading photo reports...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No photo reports added
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getBuildingNumber(report.building)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.before_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.before_photo && (
                        <img
                          src={report.before_photo}
                          alt="Before"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.after_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.after_photo && (
                        <img
                          src={report.after_photo}
                          alt="After"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(report)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(report)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <RiDeleteBin6Line size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-4 mt-8">
        <button
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50"
          onClick={handleExportPDF}
          disabled={exportingFormat !== null || !quotationId}
        >
          {exportingFormat === 'pdf' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exporting PDF...
            </>
          ) : (
            <>
              <AiFillFilePdf size={20} className="mr-2" />
              Export PDF
            </>
          )}
        </button>
        <button
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50"
          onClick={handleExportExcel}
          disabled={exportingFormat !== null || !quotationId}
        >
          {exportingFormat === 'excel' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exporting Excel...
            </>
          ) : (
            <>
              <AiFillFileExcel size={20} className="mr-2" />
              Export Excel
            </>
          )}
        </button>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
          onClick={handleExportWord}
          disabled={exportingFormat !== null || !quotationId}
        >
          {exportingFormat === 'word' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exporting Word...
            </>
          ) : (
            <>
              <AiFillFileWord size={20} className="mr-2" />
              Export Word
            </>
          )}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && reportToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
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
                  <h3 className="text-xl font-semibold text-gray-900">
                    Confirm Delete
                  </h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Are you sure you want to delete this photo report?
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Building No:</span>{' '}
                      {getBuildingNumber(reportToDelete.building)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Before Title:</span>{' '}
                      {reportToDelete.before_title}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">After Title:</span>{' '}
                      {reportToDelete.after_title}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <RiDeleteBin6Line className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Modal */}
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

export default PhotoReport;
