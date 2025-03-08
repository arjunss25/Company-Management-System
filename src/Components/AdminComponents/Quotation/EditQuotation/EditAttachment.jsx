import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FiEdit, FiEye, FiDownload } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';

const EditAttachment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    attachmentType: '',
    attachmentNo: '',
    file: null,
  });
  const [attachments, setAttachments] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = () => {
    const newAttachment = {
      ...formData,
      date: new Date().toLocaleDateString(),
    };

    if (isEditMode) {
      const updatedAttachments = attachments.map((attachment, index) =>
        index === editIndex ? newAttachment : attachment
      );
      setAttachments(updatedAttachments);
      setIsEditMode(false);
      setEditIndex(null);
    } else {
      setAttachments((prev) => [...prev, newAttachment]);
    }

    setFormData({
      attachmentType: '',
      attachmentNo: '',
      file: null,
    });
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    setFormData(attachments[index]);
    setIsEditMode(true);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const updatedAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(updatedAttachments);
  };

  const handleImagePreview = (file) => {
    setSelectedImage(URL.createObjectURL(file));
    setIsImagePreviewOpen(true);
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? 'Edit Attachment' : 'Add Attachment'}</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Select Attachment Type</span>
                    <select
                      name="attachmentType"
                      value={formData.attachmentType}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Type 1">Type 1</option>
                      <option value="Type 2">Type 2</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Attachment No</span>
                    <input
                      type="text"
                      name="attachmentNo"
                      value={formData.attachmentNo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">File</span>
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
                    onClick={handleSave}
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

      {/* Attachments Table */}
      <div className="mt-8">
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Sl. No</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Attachment Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Attachment Number</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Attachment</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {attachments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                  No attachments
                </td>
              </tr>
            ) : (
              attachments.map((attachment, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-700">{attachment.attachmentType}</td>
                  <td className="px-4 py-2 text-gray-700">{attachment.attachmentNo}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {attachment.file && (
                      <img src={URL.createObjectURL(attachment.file)} alt="Attachment" className="w-16 h-16 object-cover" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{attachment.date}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleImagePreview(attachment.file)}
                      className="px-2 py-1 text-gray-600 hover:text-gray-800"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => handleDownload(attachment.file)}
                      className="px-2 py-1 text-green-600 hover:text-green-800"
                    >
                      <FiDownload size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-2 py-1 text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-2 py-1 text-red-600 hover:text-red-800"
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview */}
      <AnimatePresence>
        {isImagePreviewOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImagePreviewOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Image Modal s*/}
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
                <img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-cover" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditAttachment;