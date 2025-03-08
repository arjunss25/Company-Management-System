import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AiFillFilePdf, AiFillFileExcel, AiFillFileWord } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';

const PhotoReport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    building: '',
    beforeTitle: '',
    beforePhoto: null,
    afterTitle: '',
    afterPhoto: null,
  });
  const [reports, setReports] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = () => {
    if (isEditMode) {
      const updatedReports = reports.map((report, index) =>
        index === editIndex ? formData : report
      );
      setReports(updatedReports);
      setIsEditMode(false);
      setEditIndex(null);
    } else {
      setReports((prev) => [...prev, formData]);
    }
    setFormData({
      building: '',
      beforeTitle: '',
      beforePhoto: null,
      afterTitle: '',
      afterPhoto: null,
    });
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    setFormData(reports[index]);
    setIsEditMode(true);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const updatedReports = reports.filter((_, i) => i !== index);
    setReports(updatedReports);
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
                  <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? 'Edit Photo Report' : 'Add Photo Report'}</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Building</span>
                    <select
                      name="building"
                      value={formData.building}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Building</option>
                      <option value="Building 1">Building 1</option>
                      <option value="Building 2">Building 2</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Before Title</span>
                    <input
                      type="text"
                      name="beforeTitle"
                      value={formData.beforeTitle}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Before Photo</span>
                    <input
                      type="file"
                      name="beforePhoto"
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">After Title</span>
                    <input
                      type="text"
                      name="afterTitle"
                      value={formData.afterTitle}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">After Photo</span>
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
                    onClick={handleSave}
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

      {/* Reports Table */}
      <div className="mt-8">
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Sl. No</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Building</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Before Picture</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">After Picture</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                  No reports
                </td>
              </tr>
            ) : (
              reports.map((report, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-700">{report.building}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {report.beforePhoto && (
                      <img src={URL.createObjectURL(report.beforePhoto)} alt="Before" className="w-16 h-16 object-cover" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {report.afterPhoto && (
                      <img src={URL.createObjectURL(report.afterPhoto)} alt="After" className="w-16 h-16 object-cover" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
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

      {/* Export Buttons */}
      <div className="flex space-x-4 mt-8">
        <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300">
          <AiFillFilePdf size={20} className="mr-2" />
          Export PDF
        </button>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
          <AiFillFileExcel size={20} className="mr-2" />
          Export Excel
        </button>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
          <AiFillFileWord size={20} className="mr-2" />
          Export Word
        </button>
      </div>
    </div>
  );
};

export default PhotoReport;