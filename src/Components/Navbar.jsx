import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUserRole,
  selectUserName,
  logout,
} from '../store/slices/authSlice';
import { FiUser, FiLogOut, FiKey, FiX } from 'react-icons/fi';
import { IoNotificationsOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminApi } from '../Services/AdminApi';
import ProfileModal from './ProfileModal';
import ChangePasswordModal from './ChangePasswordModal';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [profileData, setProfileData] = useState({
    staffName: '',
    companyLogo: '',
  });
  const [fullProfileData, setFullProfileData] = useState(null);
  const userRole = useSelector(selectUserRole);
  const userName = useSelector(selectUserName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSuperAdmin = userRole?.toLowerCase() === 'superadmin';

  useEffect(() => {
    if (!isSuperAdmin) {
      fetchProfileData();
    }
  }, [isSuperAdmin]);

  const fetchProfileData = async () => {
    try {
      const response = await AdminApi.getCompanyLogo();
      if (response.status === 'Success') {
        setProfileData({
          staffName: response.data.staff_name,
          companyLogo: `http://82.29.160.146${response.data.company_logo}`,
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleViewProfile = async () => {
    if (isSuperAdmin) return;

    try {
      const response = await AdminApi.getProfile();
      console.log('Profile API Response:', response);

      setFullProfileData(response);
      setIsProfileModalOpen(true);
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Error fetching full profile data:', error);
      setFullProfileData({
        status: 'Error',
        data: {
          staff_name: profileData.staffName,
          image: profileData.companyLogo,
          role: userRole,
          username: '',
          number: '',
          date_of_registration: '',
          abbrevation: '',
        },
      });
      setIsProfileModalOpen(true);
      setIsProfileOpen(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    if (isSuperAdmin) return;

    setFullProfileData(updatedData);
    if (updatedData.status === 'Success') {
      setProfileData({
        staffName: updatedData.data.staff_name,
        companyLogo: updatedData.data.image
          ? `http://82.29.160.146${updatedData.data.image}`
          : '',
      });
    }
    fetchProfileData();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="w-full h-[70px] bg-white border-b border-gray-200 px-6 flex items-center justify-end">
      {/* Right side - Notifications & Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <IoNotificationsOutline className="w-6 h-6 text-gray-500" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {!isSuperAdmin && (
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-100">
                {profileData.companyLogo ? (
                  <img
                    src={profileData.companyLogo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {profileData.staffName?.[0]?.toUpperCase() ||
                      userName?.[0]?.toUpperCase() ||
                      'U'}
                  </div>
                )}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">
                {isSuperAdmin ? userName : profileData.staffName || userName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userRole || 'User'}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                {!isSuperAdmin && (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                            {profileData.companyLogo ? (
                              <img
                                src={profileData.companyLogo}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                {profileData.staffName?.[0]?.toUpperCase() ||
                                  userName?.[0]?.toUpperCase() ||
                                  'U'}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {profileData.staffName || userName}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {userRole || 'User'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <FiX className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleViewProfile}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FiUser className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsChangePasswordModalOpen(true);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FiKey className="w-4 h-4" />
                      <span>Change Password</span>
                    </button>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ChangePasswordModal - Only show for non-superadmin users */}
      {!isSuperAdmin && (
        <>
          <ChangePasswordModal
            isOpen={isChangePasswordModalOpen}
            onClose={() => setIsChangePasswordModalOpen(false)}
          />

          {/* Profile Modal */}
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            profileData={fullProfileData || {}}
            onProfileUpdate={handleProfileUpdate}
          />
        </>
      )}
    </div>
  );
};

export default Navbar;
