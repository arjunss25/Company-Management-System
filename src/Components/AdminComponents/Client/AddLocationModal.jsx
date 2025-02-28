import React, { useState } from 'react';

const AddLocationModal = ({ isOpen, handleClose, handleAddLocation }) => {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setLocation(e.target.value);
    setError('');
  };

  const validateForm = () => {
    if (!location.trim()) {
      setError('Location is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddLocation(location);
      setLocation(''); // Clear the input after submission
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all">
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
          Add Location
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter location"
              />
              {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all text-sm font-medium"
            >
              Add Location
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium text-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;
