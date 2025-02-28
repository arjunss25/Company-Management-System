import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiMail, FiPhone, FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';

const ProfileModal = ({ isOpen, onClose, profileData }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
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
        </div>

        {/* Profile Image */}
        <div className="relative px-6">
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              {profileData?.data?.image ? (
                <img
                  src={`http://82.29.160.146${profileData.data.image}`}
                  alt={profileData.data.staff_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-medium">
                  {profileData?.data?.staff_name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pt-16 pb-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {profileData?.data?.staff_name || 'N/A'}
            </h2>
            <p className="text-sm text-gray-500">
              {profileData?.data?.abbrevation || 'N/A'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <FiUser className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-sm font-medium capitalize">
                  {profileData?.data?.role || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <FiMail className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">
                  {profileData?.data?.username || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                <FiPhone className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-sm font-medium">
                  {profileData?.data?.number || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <FiCalendar className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Registration Date</p>
                <p className="text-sm font-medium">
                  {formatDate(profileData?.data?.date_of_registration)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
