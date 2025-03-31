import React, { useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoChevronDownOutline } from 'react-icons/io5';
import { AdminApi } from '../../../Services/AdminApi';
import { Formik } from 'formik';
import * as Yup from 'yup';
import VerifyOtpModal from './VerifyOtpModal';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';
import TokenService from '../../../Config/tokenService';

const UsermanagementDashboard = () => {
  const navigate = useNavigate();
  const { loading, error, hasPermission } = usePermissions();
  const userRole = TokenService.getUserRole();
  const isSuperAdmin = userRole === 'SuperAdmin';
  const isAdmin = userRole === 'Admin';

  const [showModal, setShowModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredStaffEmail, setRegisteredStaffEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
  });

  const validationSchema = Yup.object().shape({
    staffName: Yup.string().required('Staff name is required'),
    abbreviation: Yup.string().required('Abbreviation is required'),
    role: Yup.string().required('Please select a role'),
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    dateOfRegistration: Yup.date().required('Date is required'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  });

  // Define user management related permissions
  const userManagementPermissions = [
    PERMISSIONS.VIEW_USER_MANAGEMENT,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.VIEW_USER_DETAILS,
    PERMISSIONS.MANAGE_USER_PERMISSIONS,
  ];

  // Helper function to check if user has view permission
  const hasViewPermission = () => {
    // SuperAdmin and Admin should have access to everything
    if (isSuperAdmin || isAdmin) return true;

    // Check for view permission
    return hasPermission(PERMISSIONS.VIEW_USER_MANAGEMENT);
  };

  const cards = [
    {
      title: 'Add New User',
      count: '+',
      icon: <MdAddCircle size={30} />,
      iconColor: 'text-blue-500',
      requiredPermission: PERMISSIONS.CREATE_USER,
    },
    {
      title: 'View Users',
      count: '21',
      icon: <FaEye size={30} />,
      iconColor: 'text-green-500',
      requiredPermission: PERMISSIONS.VIEW_USER_DETAILS,
    },
  ];

  // Filter cards based on permissions
  const visibleCards = cards.filter((card) => {
    // SuperAdmin and Admin see all cards
    if (isSuperAdmin || isAdmin) return true;

    // If user has VIEW_USER_MANAGEMENT, they should see the View Users card
    if (
      card.title === 'View Users' &&
      hasPermission(PERMISSIONS.VIEW_USER_MANAGEMENT)
    ) {
      return true;
    }

    // For Add New User card, check for CREATE_USER permission
    if (card.title === 'Add New User') {
      return hasPermission(PERMISSIONS.CREATE_USER);
    }

    return false;
  });

  const handleCardClick = (title) => {
    if (title === 'Add New User') {
      // Only show modal if user has CREATE_USER permission
      if (isSuperAdmin || isAdmin || hasPermission(PERMISSIONS.CREATE_USER)) {
        setShowModal(true);
      }
    } else if (title === 'View Users') {
      // Allow navigation if user has VIEW_USER_MANAGEMENT
      if (
        isSuperAdmin ||
        isAdmin ||
        hasPermission(PERMISSIONS.VIEW_USER_MANAGEMENT)
      ) {
        navigate('/admin/staff-details');
      }
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);

      // Convert date format from YYYY-MM-DD to DD-MM-YYYY
      const formattedDate = values.dateOfRegistration
        ? new Date(values.dateOfRegistration)
            .toLocaleDateString('en-GB')
            .replace(/\//g, '-')
        : '';

      // Prepare form data
      const formData = new FormData();
      formData.append('staff_name', values.staffName);
      formData.append('abbrevation', values.abbreviation);
      formData.append('role', values.role);
      formData.append('username', values.username);
      formData.append('password', values.password);
      formData.append('date_of_registration', formattedDate);
      formData.append('number', values.phoneNumber);
      // formData.append('company_id', '2'); // Hardcoded as per requirements

      if (values.photo) {
        formData.append('image', values.photo);
      }

      // Call the API
      const response = await AdminApi.registerStaff(formData);
      console.log('API Response:', response); // Logs the API response

      if (response.status === 'Success') {
        setRegisteredStaffEmail(values.username); // Assuming email is part of form values
        setShowOtpModal(true);
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error('API Error:', error); // Logs the API error
      setNotification({
        isOpen: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to register staff',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, type: '', message: '' });
  };

  // Loading state check
  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state check
  if (error) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error loading permissions: {error}</div>
      </div>
    );
  }

  // Check if user has view permission
  if (!hasViewPermission()) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          You don't have permission to access this section.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex">
      <div className="main-content w-full">
        {/* title */}
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            User Management Dashboard
          </h1>
        </div>

        {/* cards-section */}
        <div className="cards-sec w-full p-8">
          <div className="cards-sec-inner w-full flex flex-wrap gap-4 justify-center">
            {visibleCards.map((card, index) => (
              <div
                key={index}
                className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                onClick={() => handleCardClick(card.title)}
              >
                {/* Icon container */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${card.iconColor}`}
                >
                  {card.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1">
                  <p className="text-[2.2rem] font-bold text-gray-800">
                    {card.count}
                  </p>
                </div>

                <div className="title h-[50px] flex items-center">
                  <h2 className="text-gray-500 text-base font-medium">
                    {card.title}
                  </h2>
                </div>

                {/* Hover background effect */}
                <div
                  className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-10 
                              transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-2xl w-full max-w-[1200px] shadow-xl mx-auto overflow-y-auto h-full  lg:h-auto flex flex-col">
            <div className="p-4 sm:p-6 border-b bg-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Add Staff
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    className="w-6 h-6"
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
                </button>
              </div>
            </div>
            {/* Formik Form */}
            <Formik
              initialValues={{
                staffName: '',
                abbreviation: '',
                role: '',
                username: '',
                password: '',
                dateOfRegistration: '',
                phoneNumber: '',
                photo: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({
                handleSubmit,
                handleChange,
                values,
                errors,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Staff Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Staff Name
                      </label>
                      <input
                        type="text"
                        name="staffName"
                        value={values.staffName}
                        onChange={handleChange}
                        placeholder="Enter staff name"
                        className={`w-full p-3 border ${
                          errors.staffName
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                      />
                      {errors.staffName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.staffName}
                        </p>
                      )}
                    </div>

                    {/* Abbreviation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Abbreviation
                      </label>
                      <input
                        type="text"
                        name="abbreviation"
                        value={values.abbreviation}
                        onChange={handleChange}
                        placeholder="Enter abbreviation"
                        className={`w-full p-3 border ${
                          errors.abbreviation
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                      />
                      {errors.abbreviation && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.abbreviation}
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <div className="relative">
                        <select
                          name="role"
                          value={values.role}
                          onChange={handleChange}
                          className={`w-full p-3 border ${
                            errors.role ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white pr-10`}
                        >
                          <option value="">Select role</option>
                          <option value="Staff">Staff</option>
                          <option value="Sales Person">Sales Person</option>
                        </select>
                        <IoChevronDownOutline
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          size={20}
                        />
                      </div>
                      {errors.role && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.role}
                        </p>
                      )}
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        className={`w-full p-3 border ${
                          errors.username ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                      />
                      {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          className={`w-full p-3 border ${
                            errors.password
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                        />
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <FaEyeSlash size={20} />
                          ) : (
                            <FaEye size={20} />
                          )}
                        </div>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Date of Registration */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Date of Registration
                      </label>
                      <input
                        type="date"
                        name="dateOfRegistration"
                        value={values.dateOfRegistration}
                        onChange={handleChange}
                        className={`w-full p-3 border ${
                          errors.dateOfRegistration
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                      />
                      {errors.dateOfRegistration && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dateOfRegistration}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className={`w-full p-3 border ${
                          errors.phoneNumber
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    {/* Photo Upload */}
                    {/* Photo Upload */}
                    <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-2">
                      <label className="text-sm font-medium text-gray-700">
                        Photo
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-all">
                          {values.photo ? (
                            <>
                              <span className="text-sm text-gray-600">
                                {values.photo.name}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                Click to change file
                              </span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <span className="mt-2 text-sm text-gray-500">
                                Click to upload
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            name="photo"
                            onChange={(event) => {
                              setFieldValue(
                                'photo',
                                event.currentTarget.files[0]
                              );
                            }}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Registering...' : 'Add Staff'}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
            {/* Add notification modal */}
            {notification.isOpen && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
                  <div className="flex flex-col items-center text-center">
                    {notification.type === 'success' ? (
                      <svg className="w-16 h-16 text-green-500 mb-4" /*...*/>
                        {/* Success icon */}
                      </svg>
                    ) : (
                      <svg className="w-16 h-16 text-red-500 mb-4" /*...*/>
                        {/* Error icon */}
                      </svg>
                    )}
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        notification.type === 'success'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {notification.type === 'success' ? 'Success!' : 'Error!'}
                    </h3>
                    <p className="text-gray-600 mb-6">{notification.message}</p>
                    <button
                      onClick={closeNotification}
                      className={`px-6 py-2 rounded-lg text-white font-medium ${
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
            )}
          </div>
        </div>
      )}

      <VerifyOtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        staffId={registeredStaffEmail}
      />
    </div>
  );
};

export default UsermanagementDashboard;
