import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { AdminApi } from '../Services/AdminApi';
import { SuccessModal } from './Common/Modal';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.old_password) {
      newErrors.old_password = 'Current password is required';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your new password';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await AdminApi.changePassword(formData);
      if (response.status === 'Success') {
        setShowSuccessModal(true);
        setFormData({
          old_password: '',
          new_password: '',
          confirm_password: '',
        });
      } else {
        setErrors({ submit: response.message || 'Failed to change password' });
      }
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          'An error occurred while changing password',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 relative overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="h-28 bg-gradient-to-r from-blue-100 to-blue-500 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <FiX size={20} />
            </button>
            <div className="absolute -bottom-8 left-6">
              <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                <FiLock className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-6 pt-12 pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Change Password
            </h2>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                {errors.submit}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old_password ? 'text' : 'password'}
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.old_password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old_password')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.old_password ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
                {errors.old_password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.old_password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new_password ? 'text' : 'password'}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.new_password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new_password')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new_password ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.new_password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm_password ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirm_password
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm_password')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm_password ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirm_password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Changing Password...' : 'Change Password'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        message="Password changed successfully!"
      />
    </>
  );
};

export default ChangePasswordModal;
