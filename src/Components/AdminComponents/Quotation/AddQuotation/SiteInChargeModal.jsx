import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { IoCloudUploadOutline } from 'react-icons/io5';

const SiteInChargeModal = ({ isOpen, onClose, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    staffName: '',
    abbreviation: '',
    role: '',
    username: '',
    password: '',
    dateOfRegistration: '',
    phoneNumber: '',
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      staffName: '',
      abbreviation: '',
      role: '',
      username: '',
      password: '',
      dateOfRegistration: '',
      phoneNumber: '',
      photo: null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all h-[80vh] overflow-y-auto">
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
                name="staffName"
                value={formData.staffName}
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
                name="abbreviation"
                value={formData.abbreviation}
                onChange={handleInputChange}
                placeholder="Staff Abbreviation"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
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
                  type={showPassword ? 'password' : 'text'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <IoEyeOutline className="text-gray-500" size={20} />
                  ) : (
                    <IoEyeOffOutline className="text-gray-500" size={20} />
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
                name="dateOfRegistration"
                value={formData.dateOfRegistration}
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
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2 col-span-full">
              <label className="block text-sm font-semibold text-gray-700">
                Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="photo"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <IoCloudUploadOutline className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  {formData.photo && (
                    <p className="text-sm text-green-600">
                      Selected: {formData.photo.name}
                    </p>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t mt-8">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium hover:shadow-md"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteInChargeModal;
