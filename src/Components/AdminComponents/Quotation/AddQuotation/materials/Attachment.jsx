import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FiEdit, FiEye, FiDownload } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { selectQuotationId } from '../../../../../store/slices/quotationSlice';
import {
  addAttachment,
  getAttachments,
  editAttachment,
  deleteAttachment,
} from '../../../../../Services/QuotationApi';

const Attachment = () => {
  const quotationId = useSelector(selectQuotationId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    attachmentType: '',
    attachmentNo: '',
    file: null,
  });
  const [attachments, setAttachments] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: '',
    message: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);

  // Fetch attachments when component mounts
  useEffect(() => {
    fetchAttachments();
  }, [quotationId]);

  // Function to fetch attachments
  const fetchAttachments = async () => {
    if (!quotationId) return;

    setLoading(true);
    try {
      const data = await getAttachments(quotationId);
      setAttachments(data || []);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to load attachments',
      });
      setShowStatusModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
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
    formDataToSend.append('quotation', quotationId);
    formDataToSend.append('attachment_type', formData.attachmentType);
    formDataToSend.append('attachment_no', formData.attachmentNo);
    if (formData.file) {
      formDataToSend.append('attachment_file', formData.file);
    }

    try {
      if (isEditMode) {
        await editAttachment(quotationId, editId, formDataToSend);
      } else {
        await addAttachment(formDataToSend);
      }

      setFormData({
        attachmentType: '',
        attachmentNo: '',
        file: null,
      });
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditId(null);

      setStatusMessage({
        type: 'success',
        message: isEditMode
          ? 'Attachment updated successfully'
          : 'Attachment added successfully',
      });

      // Refresh attachments list
      fetchAttachments();
    } catch (error) {
      console.error('Failed to handle attachment:', error);
      setStatusMessage({
        type: 'error',
        message:
          error.response?.data?.message ||
          `Failed to ${isEditMode ? 'update' : 'add'} attachment`,
      });
    } finally {
      setShowStatusModal(true);
    }
  };

  const handleEdit = (attachment) => {
    setFormData({
      attachmentType: attachment.attachment_type,
      attachmentNo: attachment.attachment_no,
      file: null, // Can't pre-fill file inputs
    });
    setIsEditMode(true);
    setEditId(attachment.id);
    setIsModalOpen(true);
  };

  const handleDelete = (attachment) => {
    setAttachmentToDelete(attachment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAttachment(quotationId, attachmentToDelete.id);

      setStatusMessage({
        type: 'success',
        message: 'Attachment deleted successfully',
      });

      // Refresh attachments list
      fetchAttachments();
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete attachment',
      });
    } finally {
      setShowStatusModal(true);
      setShowDeleteModal(false);
      setAttachmentToDelete(null);
    }
  };

  const handleImagePreview = (fileUrl) => {
    setSelectedImage(fileUrl);
    setIsImagePreviewOpen(true);
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'attachment';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add more robust handling for attachment type
  const renderValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'object') {
      // Try different approaches to extract a string
      if (value.name) return value.name;
      if (value.value) return value.value;
      if (value.toString && value.toString() !== '[object Object]')
        return value.toString();
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Log data for debugging
  useEffect(() => {
    if (attachments.length > 0) {
      console.log('Attachment data example:', attachments[0]);
    }
  }, [attachments]);

  return (
    <div className="p-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Add Attachment
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
              <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isEditMode ? 'Edit Attachment' : 'Add Attachment'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Select Attachment Type
                    </span>
                    <select
                      name="attachmentType"
                      value={formData.attachmentType}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Inspection Report">
                        Inspection Report
                      </option>
                      <option value="Invoive">Invoice</option>
                      <option value="LPO Number">LPO Number</option>
                      <option value="Work Order">Work Order</option>
                      <option value="Water Inspection">Water Inspection</option>
                      <option value="Work Completion Report">
                        Work Completion Report
                      </option>
                      <option value="Subcontractor Quotation">
                        Subcontractor Quotation
                      </option>
                      <option value="Quotation Revision 1">
                        Quotation Revision 1
                      </option>
                      <option value="Quotation Revision 2">
                        Quotation Revision 2
                      </option>
                      <option value="Quotation Revision 3">
                        Quotation Revision 3
                      </option>
                      <option value="Quotation Revision 4">
                        Quotation Revision 4
                      </option>
                      <option value="Quotation Revision 5">
                        Quotation Revision 5
                      </option>
                      <option value="Quotation Revision 6">
                        Quotation Revision 6
                      </option>
                      <option value="Quotation Revision 7">
                        Quotation Revision 7
                      </option>
                      <option value="Quotation Revision 8">
                        Quotation Revision 8
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Attachment No
                    </span>
                    <input
                      type="text"
                      name="attachmentNo"
                      value={formData.attachmentNo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      File
                    </span>
                    <input
                      type="file"
                      name="file"
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
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Attachments Table */}
      <div className="mt-8 overflow-hidden bg-white rounded-lg shadow">
        <div className="sm:flex sm:items-center sm:justify-between p-4 bg-gray-50">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Attachments List
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              A list of all attachments added to this quotation
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Attachment
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Sl. No',
                  'Attachment Type',
                  'Attachment Number',
                  'Attachment',
                  'Date',
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
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading attachments...</span>
                    </div>
                  </td>
                </tr>
              ) : attachments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No attachments
                  </td>
                </tr>
              ) : (
                attachments.map((attachment, index) => {
                  // Skip any malformed data
                  if (!attachment || typeof attachment !== 'object') {
                    return null;
                  }

                  // Safely extract values for display
                  const type = renderValue(attachment.attachment_type);
                  const number = renderValue(attachment.attachment_no);
                  const fileUrl = attachment.attachment_file;
                  const date = attachment.created_at
                    ? new Date(attachment.created_at).toLocaleDateString()
                    : 'N/A';

                  return (
                    <tr
                      key={attachment.id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fileUrl ? (
                          <img
                            src={fileUrl}
                            alt="Attachment"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400">No file</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          {fileUrl && (
                            <>
                              <button
                                onClick={() => handleImagePreview(fileUrl)}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                <FiEye size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDownload(fileUrl, `${type}-${number}`)
                                }
                                className="text-green-600 hover:text-green-800 transition-colors"
                              >
                                <FiDownload size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEdit(attachment)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(attachment)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <RiDeleteBin6Line size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && attachmentToDelete && (
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
                    Are you sure you want to delete this attachment?
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Type:</span>{' '}
                      {renderValue(attachmentToDelete.attachment_type)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Number:</span>{' '}
                      {renderValue(attachmentToDelete.attachment_no)}
                    </p>
                    {attachmentToDelete.attachment_file && (
                      <div className="mt-2">
                        <img
                          src={attachmentToDelete.attachment_file}
                          alt="Attachment"
                          className="w-24 h-24 object-cover rounded mt-2"
                        />
                      </div>
                    )}
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

      {/* Image Preview Modal */}
      <AnimatePresence>
        {isImagePreviewOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImagePreviewOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-6"
            >
              <div className="relative bg-white shadow-lg rounded-lg p-6 w-[60vw] h-[80vh]">
                <button
                  onClick={() => setIsImagePreviewOpen(false)}
                  className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain mx-auto"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

export default Attachment;
