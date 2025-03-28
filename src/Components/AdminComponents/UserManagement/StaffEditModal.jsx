import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoClose, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';


const StaffEditModal = ({ isOpen, onClose, staff, onSave }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const formatDateForInput = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return '';
        const [day, month, year] = dateString.split('-'); // Updated to handle dashes
        if (!day || !month || !year) return '';
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };
    

    const [formData, setFormData] = useState({
        staff_name: staff?.staff_name || '',
        abbrevation: staff?.abbrevation || '',
        role: staff?.role || '',
        date_of_registration: staff?.date_of_registration
            ? formatDateForInput(staff.date_of_registration)
            : '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    useEffect(() => {
        if (isOpen && staff) {
            console.log('Staff data:', staff);
            setFormData({
                staff_name: staff.staff_name || '',
                abbrevation: staff.abbrevation || '',
                role: staff.role || '',
                date_of_registration: staff.date_of_registration
                    ? formatDateForInput(staff.date_of_registration)
                    : '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    }, [staff, isOpen]);
    
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateProfileForm = () => {
        const newErrors = {};
        if (!formData.staff_name.trim()) newErrors.staff_name = 'Staff name is required';
        if (!formData.abbrevation.trim()) newErrors.abbrevation = 'Abbreviation is required';
        if (!formData.role.trim()) newErrors.role = 'Role is required';
        if (!formData.date_of_registration.trim()) newErrors.date_of_registration = 'Date is required';
        return newErrors;
    };

    const validatePasswordForm = () => {
        const newErrors = {};
        if (!formData.newPassword) newErrors.newPassword = 'New password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (formData.newPassword.length < 6) {
          newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
      };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = activeTab === 'profile'
            ? validateProfileForm()
            : validatePasswordForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        const dataToSubmit = activeTab === 'profile'
            ? {
                id: staff?.id,
                staff_name: formData.staff_name,
                abbrevation: formData.abbrevation,
                role: formData.role,
                date_of_registration: formData.date_of_registration
                    .split('-')
                    .reverse()
                    .join('-')  // Fix the format here
            }
            : {
                staff_id: staff?.id,
                new_password: formData.newPassword,
                confirm_password: formData.confirmPassword
              };


        onSave(dataToSubmit, activeTab);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-6 flex items-center justify-between border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Edit Staff</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${activeTab === 'profile'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${activeTab === 'password'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Change Password
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    {activeTab === 'profile' ? (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="staff_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Staff Name
                                </label>
                                <input
                                    type="text"
                                    id="staff_name"
                                    name="staff_name"  // Changed from 'username'
                                    value={formData.staff_name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.staff_name ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                />
                                {errors.staff_name && <p className="text-red-500 text-sm mt-1">{errors.staff_name}</p>}
                            </div>

                            <div>
                                <label htmlFor="abbrevation" className="block text-sm font-medium text-gray-700 mb-1">
                                    Abbrevation
                                </label>
                                <input
                                    type="text"
                                    id="abbrevation"
                                    name="abbrevation"
                                    value={formData.abbrevation}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.abbrevation ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                />
                                {errors.abbrevation && <p className="text-red-500 text-sm mt-1">{errors.abbrevation}</p>}
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.role ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                >
                                    <option value="">Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Sales Person">Sales Person</option>
                                    <option value="Staff">Staff</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                            </div>

                            <div>
                                <label htmlFor="date_of_registration" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Registration
                                </label>
                                <input
                                    type="date"
                                    id="date_of_registration"
                                    name="date_of_registration"
                                    value={formData.date_of_registration}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${errors.date_of_registration ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                />
                                {errors.date_of_registration && <p className="text-red-500 text-sm mt-1">{errors.date_of_registration}</p>}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* New Password Field */}
                            <div className="relative">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 pr-10 rounded-lg border ${errors.newPassword ? "border-red-500" : "border-gray-300"
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                >
                                    {showNewPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                </button>
                                {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 pr-10 rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                </button>
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default StaffEditModal;