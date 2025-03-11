import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { registerStaff } from '../../Services/QuotationApi';

const AddStaffModal = ({ isOpen, onClose, handleAddStaff }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    staff_name: '',
    abbrevation: '',
    role: 'Sales Person',
    username: '',
    password: '',
    date_of_registration: '',
    number: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Log the form data before sending
      console.log('Form Data Values:', formData);

      // Append each field individually
      formDataToSend.append('staff_name', formData.staff_name);
      formDataToSend.append('abbrevation', formData.abbrevation);
      formDataToSend.append('role', 'Staff');
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('date_of_registration', formData.date_of_registration);
      formDataToSend.append('number', formData.number);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Log the FormData entries
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await registerStaff(formDataToSend);
      
      if (response.status === 'Success') {
        handleAddStaff(response.data);
        handleReset();
        onClose();
      } else {
        console.error('Registration failed:', response.message);
      }
    } catch (error) {
      console.error('Error registering staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Also update the role input field to match API requirement
  <input
    type="text"
    value="Staff"
    name="role"
    readOnly
    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
  />

  const handleReset = () => {
    setFormData({
      staff_name: '',
      abbrevation: '',
      role: 'Sales Person',
      username: '',
      password: '',
      date_of_registration: '',
      number: '',
      image: null,
    });
  };

  if (!isOpen) return null;

  return (
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
              <label className="block text-sm font-semibold text-gray-700">
                Staff Name
              </label>
              <input
                type="text"
                name="staff_name"
                value={formData.staff_name}
                onChange={handleInputChange}
                placeholder="Staff Name"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Abbreviation */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Abbreviation
              </label>
              <input
                type="text"
                name="abbrevation"
                value={formData.abbrevation}
                onChange={handleInputChange}
                placeholder="Staff Abbreviation"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Role - Read Only */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Role
              </label>
              <input
                type="text"
                value="Sales Person"
                readOnly
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                autoComplete="off"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
            </div>

            {/* Date of Registration */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Date of Registration
              </label>
              <input
                type="date"
                name="date_of_registration"
                value={formData.date_of_registration}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Photo
              </label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
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
                  Registering...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
