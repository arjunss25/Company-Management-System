import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';
import { AdminApi } from '../../../Services/AdminApi';
import SuccessModal from './SuccessModal';

const EditToolModal = ({ isOpen, onClose, tool, onSuccess, onError }) => {
  const [toolName, setToolName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (tool) {
      setToolName(tool.tool_name || '');
      setDescription(tool.description || '');
    }
  }, [tool]);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!toolName.trim()) {
      setError('Tool name is required');
      return false;
    }
    if (!description.trim()) {
      setError('Description is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create payload with only changed fields
      const payload = {};
      if (toolName !== tool.tool_name) {
        payload.tool_name = toolName;
      }
      if (description !== tool.description) {
        payload.description = description;
      }

      // Only make API call if there are changes
      if (Object.keys(payload).length === 0) {
        onClose();
        onSuccess('No changes were made');
        return;
      }

      const response = await AdminApi.editTool(tool.id, payload);

      if (response.status !== 'Success') {
        throw new Error(response.message || 'Failed to update tool');
      }

      // Close the modal first
      onClose();

      // Then trigger success callback with message
      onSuccess(response.message || 'Tool updated successfully!');
    } catch (error) {
      console.error('Error updating tool:', error);
      onError(error.message || 'Failed to update tool. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await AdminApi.deleteTool(tool.id);

      if (response.status === 'Success') {
        setModalMessage(response.message || 'Tool deleted successfully!');
        setIsError(false);
        setShowModal(true);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.message || 'Failed to delete tool');
      }
    } catch (error) {
      console.error('Error deleting tool:', error);
      setError(error.message || 'Failed to delete tool. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalMessage('');
    setIsError(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl w-[500px] shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Tool</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Tool Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={toolName}
                  onChange={(e) => {
                    setToolName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter tool name"
                  className={`w-full px-4 py-3 border rounded-xl
                           outline-none transition-all text-gray-800
                           placeholder:text-gray-400
                           ${
                             error
                               ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                               : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                           }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter tool description"
                  rows={4}
                  className="w-full px-4 py-3 border rounded-xl
                           border-gray-200 focus:ring-2 focus:ring-blue-500 
                           focus:border-blue-500 outline-none transition-all 
                           text-gray-800 placeholder:text-gray-400"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-8">
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <FaTrash size={16} />
                <span>Delete Tool</span>
              </button>

              {/* Action Buttons */}
              <div className="flex gap-3">
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
                  {loading ? 'Updating...' : 'Update Tool'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-3xl w-[400px] p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this tool? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showModal}
        message={modalMessage}
        isError={isError}
        onClose={handleModalClose}
      />
    </>
  );
};

export default EditToolModal;
