import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { registerStaff } from '../../../../Services/QuotationApi';

const SiteInChargeModal = ({ isOpen, onClose, handleAddStaff }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    staff_name: '',
    abbrevation: '',
    role: 'Staff',
    username: '',
    password: '',
    date_of_registration: '',
    number: '',
    image: null,
  });
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.staff_name) newErrors.staff_name = 'Staff name is required';
    if (!formData.abbrevation) newErrors.abbrevation = 'Abbreviation is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.date_of_registration) newErrors.date_of_registration = 'Date of registration is required';
    if (!formData.number) newErrors.number = 'Number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const formatDateForServer = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked");

    if (validateForm()) {
      try {
        setIsLoading(true);
        console.log("Sending data:", formData);

        // Create FormData object for file upload
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null) {
            // Format date before sending to server
            if (key === 'date_of_registration') {
              formDataToSend.append(key, formatDateForServer(formData[key]));
            } else {
              formDataToSend.append(key, formData[key]);
            }
          }
        });

        const response = await registerStaff(formDataToSend);
        console.log("Response received:", response);

        if (response.status === "Success") {
          setNotification({
            isOpen: true,
            type: 'success',
            message: 'Staff registered successfully'
          });

          handleAddStaff(response.data);
          handleReset();

          setTimeout(() => {
            setNotification({ isOpen: false, type: '', message: '' });
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error('Error registering staff:', error);
        setNotification({
          isOpen: true,
          type: 'error',
          message: error.message || 'Failed to register staff'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleReset = () => {
    setFormData({
      staff_name: '',
      abbrevation: '',
      role: 'Staff',
      username: '',
      password: '',
      date_of_registration: '',
      number: '',
      image: null,
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add Staff</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoCloseOutline size={28} className="text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Staff Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Staff Name</label>
                <input
                  type="text"
                  name="staff_name"
                  value={formData.staff_name}
                  onChange={handleInputChange}
                  placeholder="Staff Name"
                  className={`w-full p-3 border ${errors.staff_name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                />
                {errors.staff_name && (
                  <p className="text-red-500 text-sm">{errors.staff_name}</p>
                )}
              </div>

              {/* Abbreviation */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Abbreviation</label>
                <input
                  type="text"
                  name="abbrevation"
                  value={formData.abbrevation}
                  onChange={handleInputChange}
                  placeholder="Staff Abbreviation"
                  className={`w-full p-3 border ${errors.abbrevation ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                />
                {errors.abbrevation && (
                  <p className="text-red-500 text-sm">{errors.abbrevation}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value="Staff"
                  disabled
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username (Email)
                </label>
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${errors.username ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    autoComplete="new-password"
                    className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <IoEyeOffOutline className="text-gray-500" size={20} />
                    ) : (
                      <IoEyeOutline className="text-gray-500" size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Date of Registration */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Date of Registration</label>
                <input
                  type="date"
                  name="date_of_registration"
                  value={formData.date_of_registration}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${errors.date_of_registration ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                />
                {errors.date_of_registration && (
                  <p className="text-red-500 text-sm">{errors.date_of_registration}</p>
                )}
              </div>

              {/* Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className={`w-full p-3 border ${errors.number ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                />
                {errors.number && (
                  <p className="text-red-500 text-sm">{errors.number}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button type="button" onClick={handleReset} className="px-6 py-2 border text-gray-700 rounded-xl">Reset</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-xl">
                {isLoading ? "Registering..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification Modal */}
      {notification.isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              {notification.type === 'success' ? (
                <div className="mb-4 rounded-full bg-green-50 p-3">
                  <svg
                    className="w-16 h-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="mb-4 rounded-full bg-red-50 p-3">
                  <svg
                    className="w-16 h-16 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              <h3 className={`text-xl font-semibold mb-2 ${
                notification.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-gray-600 mb-6">{notification.message}</p>
              
              {notification.type === 'error' && (
                <button
                  onClick={() => setNotification({ isOpen: false, type: '', message: '' })}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteInChargeModal;
