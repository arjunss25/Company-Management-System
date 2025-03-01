// EditLocationModal.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LocationEditModal = ({
  isModalOpen,
  setIsModalOpen,
  editedLocation,
  setEditedLocation,
  handleSave,
  isEditing,
  editError,
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="bg-blue-100 p-2 rounded-lg mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span>
          Edit Location
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Name
            </label>
            <input
              type="text"
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
              disabled={isEditing}
              className={`w-full px-4 py-3 rounded-lg border ${
                editError ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="Enter location name"
            />
            {editError && (
              <p className="mt-2 text-sm text-red-600">{editError}</p>
            )}
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isEditing}
              className={`flex-1 ${
                isEditing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-6 py-3 rounded-lg focus:ring-4 focus:ring-blue-500/50 transition-all text-sm font-medium flex items-center justify-center`}
            >
              {isEditing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isEditing}
              className="px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationEditModal;
