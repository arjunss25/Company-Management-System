import React, { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminApi } from '../../../Services/AdminApi';
import StaffEditModal from './StaffEditModal';

const Staffdetails = () => {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setIsLoading(true);
      const response = await AdminApi.listAllStaffs();
      // Verify the staff data structure
      console.log('Staff data:', response.data); // Add this for debugging
      setStaffData(response.data || []);
    } catch (err) {
      setError('Failed to fetch staff data');
      console.error('Error fetching staff data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        // Verify the staff ID being used
        console.log('Deleting staff with ID:', staffId); // Add this for debugging
        await AdminApi.deleteStaff(staffId);
        
        // Refresh the list by filtering out the deleted staff
        setStaffData(prev => prev.filter(staff => staff.id !== staffId));
        
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Staff deleted successfully!',
        });
      } catch (error) {
        console.error('Delete error:', error);
        setNotification({
          isOpen: true,
          type: 'error',
          message: error.response?.data?.message || 'Failed to delete staff',
        });
      }
    }
  };

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setEditModalOpen(true);
  };
  const handleSaveChanges = async (updatedData, tabType) => {
    try {
      if (tabType === 'profile') {
        await AdminApi.editStaff(updatedData.id, {
          staff_name: updatedData.staff_name,
          abbrevation: updatedData.abbrevation,
          role: updatedData.role,
          date_of_registration: updatedData.date_of_registration
        });
        
        // Update the staffData state with the updated information
        setStaffData(prevStaffData => 
          prevStaffData.map(staff => 
            staff.id === updatedData.id 
              ? { 
                  ...staff, 
                  staff_name: updatedData.staff_name,
                  abbrevation: updatedData.abbrevation,
                  role: updatedData.role,
                  date_of_registration: updatedData.date_of_registration
                } 
              : staff
          )
        );
      } else if  (tabType === 'password') {
        await AdminApi.userchangePassword(updatedData);
        alert('Password changed successfully!');
      }
      
      setEditModalOpen(false);
      setNotification({
        isOpen: true,
        type: 'success',
        message: `Staff ${tabType === 'profile' ? 'profile' : 'password'} updated successfully!`,
      });
    } catch (error) {
      console.error('Update error:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        message: error.response?.data?.message || `Failed to update staff ${tabType}`,
      });
    }
  };
  
  // Add the notification component
  const Notification = () => (
    notification.isOpen && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 
              ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {notification.type === 'success' ? '✓' : '✕'}
            </div>
            <h3 className={`text-xl font-semibold mb-2 
              ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {notification.type === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p className="text-gray-600 mb-6">{notification.message}</p>
            <button
              onClick={() => setNotification({...notification, isOpen: false})}
              className={`px-6 py-2 rounded-lg text-white font-medium 
                ${notification.type === 'success' ? 
                  'bg-green-500 hover:bg-green-600' : 
                  'bg-red-500 hover:bg-red-600'}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
  return (
    <div className="flex h-screen bg-gray-50">
      <Notification />
      <div className="flex-1 md:w-[calc(100%-300px)] h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8"
        >
          {/* Header section */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/user-management-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Staff Details
              </h1>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 w-24">
                      Sl No.
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Staff Name
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Role
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Date Of Registration
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staffData.map((staff, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={staff.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 w-24">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                          {staff.staff_name}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                          {staff.date_of_registration}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/admin/user-rights/:userId', {
                              state: {
                                staffId: staff.id,
                                staffName: staff.username,
                                role: staff.role
                              }
                            })}
                            className="px-4 py-2 text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-50 transition-colors duration-300"
                          >
                            User Rights
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                             onClick={() => handleEditClick(staff)}
                            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors duration-300"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Edit Modal */}
      {editModalOpen && selectedStaff && (
        <StaffEditModal 
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          staff={selectedStaff}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default Staffdetails;