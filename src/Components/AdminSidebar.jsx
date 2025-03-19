import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AiOutlineDashboard,
  AiOutlineSetting,
  AiOutlineMenu,
} from 'react-icons/ai';
import { FaBuilding, FaFileContract, FaBoxOpen, FaUsers } from 'react-icons/fa';
import { MdGavel } from 'react-icons/md';
import { AiOutlineFileText } from 'react-icons/ai';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('admin-sidebar');
      const menuButton = document.getElementById('admin-menu-button');
      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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

  // Function to check if a path is contract-related
  const isContractPath = (path) => {
    const contractPaths = [
      '/admin/contract-dashboard',
      '/admin/view-rate-card',
      '/admin/add-contract',
      '/admin/active-contracts',
      '/admin/expired-contracts',
      '/admin/expiring-contracts',
      '/admin/view-rate-card-items',
    ];
    return contractPaths.includes(path);
  };

  // Add this function to check quotation-related paths
  const isQuotationPath = (path) => {
    const quotationPaths = [
      '/admin/quotation-dashboard',
      '/admin/add-quotations',
      '/admin/view-quotations',
      '/admin/active-quotations',
      '/admin/pending-approval',
      '/admin/cancelled-quotations',
      '/admin/not-started',
      '/admin/in-progress',
      '/admin/completed',
      '/admin/on-hold',
      '/admin/no-access',
      '/admin/lpo-pending',
      '/admin/wcr-pending',
      '/admin/grn-pending',
      '/admin/invoice-pending',
      '/admin/lpo-received',
      '/admin/grn-received',
      '/admin/retention-overdue',
    ];
    return quotationPaths.includes(path);
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <AiOutlineDashboard size={22} />,
      label: 'Dashboard',
    },
    // Add this new menu item after Dashboard
    {
      path: '/admin/quotation-dashboard',
      icon: <AiOutlineFileText size={22} />,
      label: 'Quotation',
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
    <>
      {/* Menu Button - Only visible on mobile */}
      <button
        id="admin-menu-button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AiOutlineMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`
          fixed top-0 left-0
          h-full w-[300px]
          bg-black text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:block
          z-40
        `}
      >
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
                        isTermsPath(location.pathname)) ||
                      (item.path === '/admin/contract-dashboard' &&
                        isContractPath(location.pathname)) ||
                      (item.path === '/admin/quotation-dashboard' &&
                        isQuotationPath(location.pathname))
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
      </aside>

      {/* Overlay - Only visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
