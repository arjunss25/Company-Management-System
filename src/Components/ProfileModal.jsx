import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUser,
  FiEdit2,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { AdminApi } from '../Services/AdminApi';

const ProfileModal = ({ isOpen, onClose, profileData, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    staff_name: '',
    image: null,
    date_of_registration: '',
  });
  const [previewImage, setPreviewImage] = useState(null);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // For display in the view mode
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      // If date is already in yyyy-mm-dd format
      if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          // It's already in yyyy-mm-dd format
          return dateString;
        } else {
          // It's in dd-mm-yyyy format, convert to yyyy-mm-dd for input
          const [day, month, year] = parts;
          return `${year}-${month}-${day}`;
        }
      }
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  const handleEditClick = () => {
    const currentDate = profileData?.data?.date_of_registration || '';
    setEditFormData({
      staff_name: profileData?.data?.staff_name || '',
      date_of_registration: formatDateForInput(currentDate),
      image: null,
    });
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (editFormData.staff_name) {
        formData.append('staff_name', editFormData.staff_name);
      }

      if (editFormData.date_of_registration) {
        // Convert from yyyy-mm-dd to dd-mm-yyyy
        const date = new Date(editFormData.date_of_registration);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        formData.append('date_of_registration', formattedDate);
      }

      if (editFormData.image) {
        formData.append('image', editFormData.image);
      }

      // Debug log
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await AdminApi.editProfile(formData);
      console.log('Edit Profile Response:', response);

      if (response.status === 'Success') {
        const updatedProfile = await AdminApi.getProfile();
        setIsEditing(false);

        if (typeof onProfileUpdate === 'function') {
          onProfileUpdate(updatedProfile);
        }
      } else {
        console.error('Failed to update profile:', response.message);
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile. Please try again.');
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
          <button
            onClick={handleEditClick}
            className="absolute top-4 right-16 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <FiEdit2 size={20} />
          </button>
        </div>

        {isEditing ? (
          // Edit Form
          <form onSubmit={handleSubmit} className="px-6 pt-16 pb-6">
            <div className="relative px-6 -mt-16 mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg mx-auto">
                {previewImage ||
                (editFormData.image &&
                  URL.createObjectURL(editFormData.image)) ? (
                  <img
                    src={
                      previewImage ||
                      (editFormData.image &&
                        URL.createObjectURL(editFormData.image))
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profileData?.data?.image ? (
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="staff_name"
                  value={editFormData.staff_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Date
                </label>
                <input
                  type="date"
                  name="date_of_registration"
                  value={editFormData.date_of_registration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          // Profile View
          <>
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
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileModal;
