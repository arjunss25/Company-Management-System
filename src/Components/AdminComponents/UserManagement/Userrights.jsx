import React, { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../../Config/axiosInstance';
import TokenService from '../../../Config/tokenService';

const Userrights = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const staffData = location.state?.staffId;
  const userRole = TokenService.getUserRole();
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [permissionCategories, setPermissionCategories] = useState({});
  const [existingPermissions, setExistingPermissions] = useState([]);

  const [rights, setRights] = useState({
    selectAll: false,
    rights: [],
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: '',
    message: '',
  });

  // Function to organize permissions into categories
  const organizePermissions = (permissionsList) => {
    const categories = {
      'Page Access': [],
      'User Management': [],
      'Client Management': [],
      'Location Management': [],
      'Material Management': [],
      'Terms & Conditions': [],
      'Contract Management': [],
      'Quotation Management': [],
      'Documentation Status': [],
      'Work Status': [],
      'Retention Management': [],
      Actions: [],
    };

    permissionsList.forEach((permission) => {
      if (permission.startsWith('view_')) {
        if (permission.includes('quotation')) {
          categories['Quotation Management'].push(permission);
        } else if (
          permission.includes('lpo') ||
          permission.includes('wcr') ||
          permission.includes('grn') ||
          permission.includes('invoice')
        ) {
          categories['Documentation Status'].push(permission);
        } else if (
          permission.includes('completed') ||
          permission.includes('progress') ||
          permission.includes('started') ||
          permission.includes('hold') ||
          permission.includes('overdue')
        ) {
          categories['Work Status'].push(permission);
        } else if (permission.includes('retention')) {
          categories['Retention Management'].push(permission);
        } else if (permission.includes('user')) {
          categories['User Management'].push(permission);
        } else if (permission.includes('client')) {
          categories['Client Management'].push(permission);
        } else if (permission.includes('location')) {
          categories['Location Management'].push(permission);
        } else if (permission.includes('material')) {
          categories['Material Management'].push(permission);
        } else if (permission.includes('terms')) {
          categories['Terms & Conditions'].push(permission);
        } else if (permission.includes('contract')) {
          categories['Contract Management'].push(permission);
        } else {
          categories['Page Access'].push(permission);
        }
      } else {
        // Non-view permissions go to their respective categories based on their prefix
        if (permission.includes('quotation')) {
          categories['Quotation Management'].push(permission);
        } else if (
          permission.includes('lpo') ||
          permission.includes('wcr') ||
          permission.includes('grn') ||
          permission.includes('invoice')
        ) {
          categories['Documentation Status'].push(permission);
        } else if (permission.includes('retention')) {
          categories['Retention Management'].push(permission);
        } else if (permission.includes('user')) {
          categories['User Management'].push(permission);
        } else if (permission.includes('client')) {
          categories['Client Management'].push(permission);
        } else if (permission.includes('location')) {
          categories['Location Management'].push(permission);
        } else if (permission.includes('material')) {
          categories['Material Management'].push(permission);
        } else if (permission.includes('terms')) {
          categories['Terms & Conditions'].push(permission);
        } else if (permission.includes('contract')) {
          categories['Contract Management'].push(permission);
        } else {
          categories['Actions'].push(permission);
        }
      }
    });

    // Remove empty categories
    Object.keys(categories).forEach((key) => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    return categories;
  };

  // Fetch permissions from API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosInstance.get('/list-saved-permissions/');
        if (response.data.status === 'Success') {
          const permissionsList = response.data.data;
          setPermissions(permissionsList);
          const organized = organizePermissions(permissionsList);
          setPermissionCategories(organized);
          setRights({
            selectAll: false,
            rights: Array(permissionsList.length).fill(false),
          });
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  // Fetch existing user permissions
  useEffect(() => {
    const fetchExistingPermissions = async () => {
      if (!staffData) return;

      try {
        // Use the correct endpoint to fetch user permissions
        const response = await axiosInstance.get(
          `/list-permission/${staffData}/`
        );

        if (response.data.status === 'Success') {
          const userPermissions = response.data.data;
          setExistingPermissions(userPermissions);

          // Update rights state based on existing permissions
          if (permissions.length > 0) {
            const newRights = permissions.map((permission) =>
              userPermissions.includes(permission)
            );

            setRights({
              selectAll: newRights.every((right) => right),
              rights: newRights,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      }
    };

    fetchExistingPermissions();
  }, [staffData, permissions]);

  const handleSelectAll = () => {
    setRights({
      selectAll: !rights.selectAll,
      rights: Array(permissions.length).fill(!rights.selectAll),
    });
  };

  const handleSingleCheck = (permission) => {
    const index = permissions.indexOf(permission);
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

      const selectedPermissions = permissions.filter(
        (_, index) => rights.rights[index]
      );

      // Use the correct endpoint and payload format
      const response = await axiosInstance.patch(
        `/edit-permission/${staffData}/`,
        {
          permissions: selectedPermissions,
        }
      );

      if (response.data.status === 'Success') {
        setModalState({
          isOpen: true,
          type: 'success',
          message: 'Permissions saved successfully!',
        });

        // Update existing permissions after successful save
        setExistingPermissions(selectedPermissions);
      } else {
        setModalState({
          isOpen: true,
          type: 'error',
          message: 'Failed to save permissions. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      setModalState({
        isOpen: true,
        type: 'error',
        message: 'An error occurred while saving permissions.',
      });
    } finally {
      setIsLoading(false);
    }
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
            ([category, categoryPermissions]) => (
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
                  {categoryPermissions.map((permission, index) => (
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
                            rights.rights[permissions.indexOf(permission)]
                          }
                          onChange={() => handleSingleCheck(permission)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
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

      {/* Success/Error Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    modalState.type === 'success'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  {modalState.type === 'success' ? (
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    modalState.type === 'success'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {modalState.type === 'success' ? 'Success!' : 'Error!'}
                </h3>
                <p className="text-gray-600 mb-6">{modalState.message}</p>
                <button
                  onClick={() =>
                    setModalState({ ...modalState, isOpen: false })
                  }
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    modalState.type === 'success'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Userrights;
