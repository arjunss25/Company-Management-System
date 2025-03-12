import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { AdminApi } from '../../../../Services/AdminApi';

const LocationModal = ({ isOpen, onClose, handleAddLocation }) => {
  const [formData, setFormData] = useState({
    locationName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.locationName.trim()) {
      setError('Location name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await AdminApi.addLocation(formData.locationName);
      if (response.status === 'Success') {
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Location added successfully',
        });
        handleAddLocation(response.data);
        handleReset();
        setTimeout(() => {
          onClose();
          setNotification({ isOpen: false, type: '', message: '' });
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding location:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        message: error.message || 'Failed to add location',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      locationName: '',
    });
    setError('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Location</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoCloseOutline size={28} className="text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="locationName"
                value={formData.locationName}
                onChange={handleInputChange}
                placeholder="Enter Location"
                className={`w-full p-3 border ${
                  error ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification Modal */}
      {notification.isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl transform transition-all">
            <div className="flex flex-col items-center text-center">
              {notification.type === 'success' ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className={`text-2xl font-bold mb-2 ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-gray-600 mb-8">{notification.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setNotification({ isOpen: false, type: '', message: '' })}
                  className={`px-6 py-2.5 rounded-xl text-white font-medium transition-colors ${
                    notification.type === 'success'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationModal;
