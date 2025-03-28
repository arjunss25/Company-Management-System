import React, { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PERMISSIONS } from '../../../Hooks/userPermission';
import axiosInstance from '../../../Config/axiosInstance';

const Userrights = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const allPermissions = Object.values(PERMISSIONS);
  const [isLoading, setIsLoading] = useState(false);

  const [rights, setRights] = useState({
    selectAll: false,
    rights: Array(allPermissions.length).fill(false),
  });

  const [saveStatus, setSaveStatus] = useState({
    show: false,
    success: false,
    message: '',
  });

  const handleSelectAll = () => {
    setRights({
      selectAll: !rights.selectAll,
      rights: Array(allPermissions.length).fill(!rights.selectAll),
    });
  };

  const handleSingleCheck = (index) => {
    const newRights = [...rights.rights];
    newRights[index] = !newRights[index];
    setRights({
      selectAll: newRights.every((right) => right),
      rights: newRights,
    });
  };

  const handleSavePermissions = async () => {
    try {
      setIsLoading(true);

      const selectedPermissions = allPermissions.filter(
        (_, index) => rights.rights[index]
      );

      const payload = {
        user_id: parseInt(userId),
        permissions: selectedPermissions,
      };

      const response = await axiosInstance.post('/save-permission/', payload);

      if (response.data.status === 'Success') {
        setSaveStatus({
          show: true,
          success: true,
          message: 'Permissions saved successfully!',
        });

        setTimeout(() => {
          navigate('/admin/staff-details');
        }, 2000);
      } else {
        setSaveStatus({
          show: true,
          success: false,
          message: 'Failed to save permissions. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      setSaveStatus({
        show: true,
        success: false,
        message: 'An error occurred while saving permissions.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const permissionCategories = {
    'Page Access': allPermissions.filter((p) => p.startsWith('view_')),
    'User Management': allPermissions.filter((p) => p.includes('user_')),
    'Client Management': allPermissions.filter((p) => p.includes('client')),
    'Location Management': allPermissions.filter((p) => p.includes('location')),
    'Material Management': allPermissions.filter((p) => p.includes('material')),
    'Terms & Conditions': allPermissions.filter((p) => p.includes('terms')),
    'Contract Management': allPermissions.filter((p) => p.includes('contract')),
    'Quotation Management': allPermissions.filter(
      (p) =>
        p.includes('quotation') ||
        p.includes('_started') ||
        p.includes('_progress') ||
        p.includes('_hold') ||
        p.includes('_completed')
    ),
    Documentation: allPermissions.filter(
      (p) =>
        p.includes('lpo') ||
        p.includes('wcr') ||
        p.includes('grn') ||
        p.includes('invoice')
    ),
    'Retention Management': allPermissions.filter((p) =>
      p.includes('retention')
    ),
  };

  const formatPermissionName = (permission) => {
    return permission
      .split('_')
      .map((word) => {
        if (word.toLowerCase() === 'export') {
          return 'Export as PDF';
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 md:w-[calc(100%-300px)] h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/admin/staff-details')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                User Rights Management
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-lg font-semibold text-gray-700">
                Select All Permissions
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rights.selectAll}
                  onChange={handleSelectAll}
                  className="w-6 h-6 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                />
              </div>
            </label>
          </div>

          {Object.entries(permissionCategories).map(
            ([category, permissions]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-6"
              >
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {category}
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {permissions.map((permission, index) => (
                    <motion.div
                      key={permission}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between px-6 py-4 hover:bg-blue-50/40 transition-colors duration-200"
                    >
                      <span className="text-gray-700 font-medium">
                        {formatPermissionName(permission)}
                      </span>
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={
                            rights.rights[allPermissions.indexOf(permission)]
                          }
                          onChange={() =>
                            handleSingleCheck(
                              allPermissions.indexOf(permission)
                            )
                          }
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          )}

          {saveStatus.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
                saveStatus.success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {saveStatus.message}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-8 right-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSavePermissions}
              disabled={isLoading}
              className={`px-8 py-3 bg-blue-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl ${
                isLoading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-5 h-5">
                    <svg
                      className="w-full h-full text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Permissions'
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Userrights;
