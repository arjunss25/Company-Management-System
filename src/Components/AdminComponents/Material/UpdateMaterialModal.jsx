import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { AdminApi } from '../../../Services/AdminApi';
import SuccessModal from './SuccessModal';

const UpdateMaterialModal = ({ isOpen, onClose, material, onUpdate }) => {
  const [materialName, setMaterialName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (material) {
      setMaterialName(material.name);
    }
  }, [material]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!materialName.trim()) {
      setError('Material name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await AdminApi.editMaterial(material.id, materialName);

      if (response.status === 'Success') {
        setSuccessMessage(response.message || 'Material updated successfully!');
        setShowSuccess(true);
        if (onUpdate) onUpdate();
      } else {
        throw new Error(response.message || 'Failed to update material');
      }
    } catch (error) {
      console.error('Error updating material:', error);
      setError(error.message || 'Failed to update material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl w-[400px] shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Update Material
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Material Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={materialName}
                onChange={(e) => {
                  setMaterialName(e.target.value);
                  setError('');
                }}
                placeholder="Enter material name"
                className={`w-full px-4 py-3 border rounded-xl
                         outline-none transition-all text-gray-800
                         placeholder:text-gray-400
                         ${
                           error
                             ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                             : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                         }`}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2.5 bg-blue-500 text-white rounded-xl
                         hover:bg-blue-600 transition-colors font-medium
                         ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Updating...' : 'Update Material'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        message={successMessage}
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default UpdateMaterialModal;
