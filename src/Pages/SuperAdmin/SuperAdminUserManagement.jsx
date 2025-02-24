import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  IoPersonAdd,
  IoRefreshOutline,
  IoCloudUploadOutline,
  IoImageOutline,
} from 'react-icons/io5';

import StaffList from '../../Components/SuperadminComponents/StaffList';
import EditStaffModal from '../../Components/SuperadminComponents/EditStaffModal';
import { SuperadminApi } from '../../Services/SuperadminApi';
import OtpVerificationModal from '../../Components/SuperadminComponents/OtpVerificationModal';
import CustomLoader from '../../Components/Common/CustomLoader';

const  SuperAdminUserManagement = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [companies, setCompanies] = useState([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

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

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await SuperadminApi.getCompanyList();
        if (response.status === "Success") {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          photo: file,
          photoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };

      const selectedCompany = companies.find(
        company => company.company_name === formData.companyName
      );

      // Create FormData object with exact field names required by the API
      const staffFormData = new FormData();
      staffFormData.append('company_id', selectedCompany?.id);
      staffFormData.append('staff_name', formData.staffName);
      staffFormData.append('abbrevation', formData.abbreviation);
      staffFormData.append('role', formData.role);
      staffFormData.append('username', formData.username);
      staffFormData.append('password', formData.password);
      staffFormData.append('date_of_registration', formatDate(formData.dateOfRegistration));
      staffFormData.append('number', formData.phoneNumber);
      if (formData.photo) {
        staffFormData.append('image', formData.photo);
      }

      const response = await SuperadminApi.registerStaff(staffFormData);
      
      if (response.status === "Success") {
        setRegisteredEmail(formData.username);
        setShowOtpModal(true);
        
        // Clear the form
        setFormData({
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
      }
    } catch (error) {
      console.error('Error registering staff:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register staff. Please try again.';
      alert(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleEditClick = (staff) => {
    setSelectedCompany(staff); // Set the selected staff data for editing
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedCompany) => {
    // Dispatch update action to update the company data
    dispatch(updateCompany(updatedCompany));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your staff and user accounts
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'add'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Add New Staff
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Staff List
          </button>
        </div>

        {activeTab === 'add' ? (
          <div className="bg-white rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Staff Member
              </h2>
              <button
                type="reset"
                onClick={() =>
                  setFormData({
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
                  })
                }
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <IoRefreshOutline className="w-5 h-5" />
                Reset Form
              </button>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Basic Information Section - Updated Design */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <IoPersonAdd className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Basic Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Staff Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="staffName"
                      value={formData.staffName}
                      onChange={handleChange}
                      placeholder="Enter staff name"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Abbreviation
                    </label>
                    <input
                      type="text"
                      name="abbreviation"
                      value={formData.abbreviation}
                      onChange={handleChange}
                      placeholder="Enter abbreviation"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    >
                      <option value="">Select company</option>
                      {companies.map((company, index) => (
                        <option key={company.id} value={company.company_name}>
                          {company.company_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Account Details Section - Updated Design */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <IoCloudUploadOutline className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Account Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    >
                      <option value="">Select role</option>
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                      <option value="Sales Person">Sales Person</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section - Updated Design */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <IoImageOutline className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Additional Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Registration Date
                    </label>
                    <input
                      type="date"
                      name="dateOfRegistration"
                      value={formData.dateOfRegistration}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-gray-100 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                      Profile Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                          <div className="space-y-1 text-center">
                            {formData.photoPreview ? (
                              <img
                                src={formData.photoPreview}
                                alt="Preview"
                                className="w-20 h-20 mx-auto rounded-full object-cover"
                              />
                            ) : (
                              <>
                                <IoImageOutline className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="text-sm text-gray-600">
                                  Click to upload
                                </div>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            name="photo"
                            onChange={handleChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Updated Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <IoPersonAdd className="w-5 h-5" />
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        ) : (
          <StaffList onEditClick={handleEditClick} />
        )}
      </div>

      <EditStaffModal
        isOpen={isModalOpen}
        staffData={selectedCompany}
        handleClose={handleCloseModal}
        handleUpdate={handleUpdate}
      />

      {isRegistering && <CustomLoader />}
      
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        staffId={registeredEmail}
      />
    </div>
  );
};

export default SuperAdminUserManagement;
