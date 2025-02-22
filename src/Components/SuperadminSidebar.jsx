import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AiOutlineDashboard,
  AiOutlineMenu,
  AiOutlineLogout,
} from 'react-icons/ai';
import { FaBuilding, FaUsers } from 'react-icons/fa';

const SuperAdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/superadmin/company-management') {
      // Consider both company management and viewstaff routes as part of company management
      return (
        location.pathname === path || location.pathname.startsWith('/viewstaff')
      );
    }
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/superadmin/dashboard',
      name: 'Dashboard',
      icon: <AiOutlineDashboard size={22} />,
    },
    {
      path: '/superadmin/company-management',
      name: 'Company Management',
      icon: <FaBuilding size={22} />,
    },
    {
      path: '/superadmin/user-management',
      name: 'User Management',
      icon: <FaUsers size={22} />,
    },
    {
      path: '/logout',
      name: 'Logout',
      icon: <AiOutlineLogout size={22} />,
    },
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AiOutlineMenu size={24} />
      </button>

      <div
        className={`
        fixed lg:static
        w-full lg:w-[280px] h-screen 
        bg-black text-white
        transition-all duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        z-10
      `}
      >
        <div className="flex flex-col items-center p-6 border-b border-gray-700">
          <img
            src="/super_admin_avatar.png"
            alt="Super Admin Avatar"
            className="h-16 w-16 rounded-full mb-2"
          />
          <span className="text-lg font-bold">Super Admin</span>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-6 py-3 hover:bg-gray-800 text-[#8E8E8E] rounded-[2px] transition-colors
                    ${
                      location.pathname === item.path
                        ? 'border-l-[3px] border-white text-gray-100 bg-gradient-to-r from-slate-600 to-black'
                        : ''
                    }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-0 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SuperAdminSidebar;
