import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UpdateMaterialModal from './UpdateMaterialModal';
import { AdminApi } from '../../../Services/AdminApi';
import SuccessModal from './SuccessModal';
import ConfirmationModal from './ConfirmationModal';

const ViewMaterial = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await AdminApi.listMaterials();

      if (response.status === 'Success') {
        setMaterials(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } else {
        throw new Error(response.message || 'Failed to fetch materials');
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError(error.message || 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (materialId) => {
    const material = materials.find((m) => m.id === materialId);
    setSelectedMaterial(material);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material);
    setShowConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (!materialToDelete) return;

    try {
      setLoading(true);
      setError(null);
      const response = await AdminApi.deleteMaterial(materialToDelete.id);

      if (response.status === 'Success') {
        setSuccessMessage(response.message || 'Material deleted successfully!');
        setShowSuccess(true);
        await fetchMaterials(); // Refresh the list after successful deletion
      } else {
        throw new Error(response.message || 'Failed to delete material');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      setError(error.message || 'Failed to delete material');
    } finally {
      setLoading(false);
      setShowConfirmation(false);
      setMaterialToDelete(null);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setMaterialToDelete(null);
  };

  // Get current materials for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = materials.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
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
                onClick={() => navigate('/admin/material-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Material Details
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
                      Sl.No
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Material Name
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentMaterials.map((material, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={material.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 w-24">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {indexOfFirstItem + index + 1}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                          {material.name}
                        </span>
                      </td>
                      <td className="px-8 py-5 w-32">
                        <div className="flex items-center space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(material.id)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                          >
                            <FiEdit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteClick(material)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                          >
                            <RiDeleteBin6Line size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, materials.length)} of{' '}
                {materials.length} materials
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium
                    ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    } transition-all duration-300`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium
                      ${
                        currentPage === number
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      } transition-colors duration-300`}
                    >
                      {number}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium
                    ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    } transition-all duration-300`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <UpdateMaterialModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedMaterial(null);
        }}
        material={selectedMaterial}
        onUpdate={fetchMaterials}
      />

      <SuccessModal
        isOpen={showSuccess}
        message={successMessage}
        onClose={handleSuccessClose}
      />

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Material"
        message={`Are you sure you want to delete "${materialToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ViewMaterial;
