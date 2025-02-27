import React, { useState, useEffect } from 'react';
import { X, User, Lock, Save } from 'lucide-react';
import SuperadminApi from '../../Services/SuperadminApi';

const EditStaffProfile = ({ staff, onClose, onEditSuccess }) => {
  const [activeTab, setActiveTab] = useState('editProfile');
  const [formData, setFormData] = useState({
    staffName: '',
    abbreviation: '',
    companyName: '',
    role: '',
    username: '',
    password: '',
    dateOfRegistration: '',
    phoneNumber: '',
    photo: null,
    photoPreview: '',
  });

  const [errors, setErrors] = useState({});

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (staff) {
      setFormData({
        staffName: staff.staffName || '',
        abbreviation: staff.abbreviation || '',
        companyName: staff.companyName || '',
        role: staff.role || '',
        username: staff.username || '',
        password: staff.password || '',
        dateOfRegistration: staff.dateOfRegistration || '',
        phoneNumber: staff.phoneNumber || '',
        photoPreview: staff.photoPreview || '',
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'photo' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: file,
          photoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError(''); // Clear error when user types
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    try {
      const passwordData = {
        staff_id: staff.id.toString(), // Convert to string as per API requirement
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.confirmPassword,
      };

      // Call the password change API
      await SuperadminApi.changeStaffPassword(passwordData);

      // Clear form and close modal on success
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      onEditSuccess();
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to change password. Please try again.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };

      formDataToSend.append('staff_name', formData.staffName);
      formDataToSend.append('abbrevation', formData.abbreviation);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('username', formData.username);
      formDataToSend.append(
        'date_of_registration',
        formatDate(formData.dateOfRegistration)
      );
      formDataToSend.append('number', formData.phoneNumber);

      // Handle image upload
      if (formData.photo instanceof File) {
        formDataToSend.append('image', formData.photo);
      }

      if (activeTab === 'changePassword' && formData.password) {
        formDataToSend.append('password', formData.password);
      }

      // Call the API to update staff
      await SuperadminApi.editStaff(staff.id, formDataToSend);

      // Call onEditSuccess to refresh the parent component
      onEditSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating staff:', error);
      setErrors({
        ...errors,
        submit: 'Failed to update staff. Please try again.',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Staff Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-4 gap-2">
          <button
            onClick={() => setActiveTab('editProfile')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'editProfile'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('changePassword')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'changePassword'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'editProfile' ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <img
                      src={formData.photoPreview || '/api/placeholder/150/150'}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors duration-200">
                      <input
                        type="file"
                        name="photo"
                        className="hidden"
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Staff Name', name: 'staffName' },
                    { label: 'Abbreviation', name: 'abbreviation' },
                    { label: 'Company Name', name: 'companyName' },
                    { label: 'Role', name: 'role' },
                    { label: 'Username', name: 'username' },
                    { label: 'Phone Number', name: 'phoneNumber' },
                    {
                      label: 'Date of Registration',
                      name: 'dateOfRegistration',
                      type: 'date',
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* New Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                {/* Error Message */}
                {passwordError && (
                  <div className="text-red-500 text-sm">{passwordError}</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Change Password
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStaffProfile;
