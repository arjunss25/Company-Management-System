import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AiOutlineDashboard,
  AiOutlineFileText,
  AiOutlineSetting,
} from 'react-icons/ai';
import { FaBuilding, FaFileContract, FaBoxOpen, FaUsers } from 'react-icons/fa';
import { MdGavel } from 'react-icons/md';

const AdminSidebar = () => {
  const location = useLocation();

  // Function to check if a path is material-related
  const isMaterialPath = (path) => {
    const materialPaths = [
      '/admin/material-dashboard',
      '/admin/view-material',
      '/admin/material-requests',
      '/admin/pending-material-requests',
      '/admin/material-consumption',
      '/admin/store-data',
    ];
    return materialPaths.includes(path);
  };

  // Function to check if a path is client/location-related
  const isClientLocationPath = (path) => {
    const clientLocationPaths = [
      '/admin/client-location',
      '/admin/clients',
      '/admin/locations',
    ];
    return clientLocationPaths.includes(path);
  };

  // Function to check if a path is terms-related
  const isTermsPath = (path) => {
    const termsPaths = [
      '/admin/terms-and-conditions-dashboard',
      '/admin/general-terms',
      '/admin/payment-terms',
      '/admin/completion-delivery',
      '/admin/quotation-validity',
      '/admin/warranty-terms',
    ];
    return termsPaths.includes(path);
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <AiOutlineDashboard size={22} />,
      label: 'Dashboard',
    },
    {
      path: '/admin/client-location',
      icon: <FaBuilding size={22} />,
      label: 'Client/Location',
    },
    {
      path: '/admin/contract-dashboard',
      icon: <FaFileContract size={22} />,
      label: 'Contract',
    },
    {
      path: '/admin/material-dashboard',
      icon: <FaBoxOpen size={22} />,
      label: 'Material',
    },
    {
      path: '/admin/user-management',
      icon: <FaUsers size={22} />,
      label: 'User Management',
    },
    {
      path: '/admin/terms-and-conditions-dashboard',
      icon: <MdGavel size={22} />,
      label: 'Terms & Conditions',
    },
  ];

  return (
    <div className="w-full lg:w-[300px] h-screen bg-black text-white">
      <div className="flex flex-col items-center p-6 border-b border-gray-700">
        <img
          src="/admin_logo.png"
          alt="Company Logo"
          className="h-16 w-16 rounded-full mb-2"
        />
        <span className="text-lg font-bold">New company</span>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-6 py-3 hover:bg-gray-800 text-[#8E8E8E] rounded-[2px] transition-colors
                  ${
                    location.pathname === item.path ||
                    (item.path === '/admin/material-dashboard' &&
                      isMaterialPath(location.pathname)) ||
                    (item.path === '/admin/client-location' &&
                      isClientLocationPath(location.pathname)) ||
                    (item.path === '/admin/terms-and-conditions-dashboard' &&
                      isTermsPath(location.pathname))
                      ? 'border-l-[3px] border-white text-gray-100 bg-gradient-to-r from-slate-600 to-black'
                      : ''
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
