import React, { useState, useEffect } from 'react';
import { IoClose, IoCloudUpload } from 'react-icons/io5';
import { SuperadminApi } from '../../Services/SuperadminApi';

const EditStaffModal = ({ isOpen, staffData, onClose }) => {
  const [formData, setFormData] = useState({
    staff_name: '',
    abbrevation: '',
    role: '',
    username: '',
    password: '',
    date_of_registration: '',
    number: '',
    image: null,
    imagePreview: '',
    user: '',
    id: '',
    company_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (staffData) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
      };

      setFormData({
        staff_name: staffData.staff_name || '',
        abbrevation: staffData.abbrevation || '',
        role: staffData.role || '',
        username: staffData.username || '',
        password: '', 
        date_of_registration: formatDateForInput(staffData.date_of_registration) || '',
        number: staffData.number || '',
        imagePreview: staffData.image ? `http://82.29.160.146${staffData.image}` : '',
        user: staffData.user || '',
        id: staffData.id || '',
        company_id: '',
      });
    }
  }, [staffData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.staff_name.trim())
      newErrors.staff_name = 'Staff Name is required';
    if (!formData.abbrevation.trim())
      newErrors.abbrevation = 'Abbreviation is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.number.trim()) newErrors.number = 'Phone Number is required';
    if (!formData.date_of_registration)
      newErrors.date_of_registration = 'Registration Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formatDateForApi = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };

      const staffFormData = new FormData();
      
      staffFormData.append('staff_name', formData.staff_name);
      staffFormData.append('abbrevation', formData.abbrevation);
      staffFormData.append('role', formData.role);
      staffFormData.append('username', formData.username);
      staffFormData.append('date_of_registration', formatDateForApi(formData.date_of_registration));
      staffFormData.append('number', formData.number);
      staffFormData.append('user', formData.user);
      staffFormData.append('company_id', '2');

      if (formData.image instanceof File) {
        staffFormData.append('image', formData.image);
      }

      console.log('========================');
      console.log('Staff ID being used:', formData.id);
      console.log('Full FormData payload:');
      for (let [key, value] of staffFormData.entries()) {
        console.log(`${key}: ${value}`);
      }
      console.log('========================');

      const response = await SuperadminApi.editStaff(formData.id, staffFormData);
      console.log('API Response:', response);
      
      if (response.status === "Success") {
        onClose(true);
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
      setErrors({
        submit: error.response?.data?.message || 'Failed to update staff member'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Staff Member
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image upload section */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        alt="Staff"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                        <IoCloudUpload className="w-12 h-12 text-blue-300" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm">Change Photo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Name
                </label>
                <input
                  type="text"
                  name="staff_name"
                  value={formData.staff_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.staff_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.staff_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Abbreviation
                </label>
                <input
                  type="text"
                  name="abbrevation"
                  value={formData.abbrevation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.abbrevation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.abbrevation}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.number && (
                  <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Date
              </label>
              <input
                type="date"
                name="date_of_registration"
                value={formData.date_of_registration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.date_of_registration && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date_of_registration}
                </p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium
                                   hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 
                                   transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Staff'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;
