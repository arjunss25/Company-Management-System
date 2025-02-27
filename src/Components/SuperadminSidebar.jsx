import React, { useState, useEffect } from 'react';
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
        location.pathname === path ||
        location.pathname.includes('/superadmin/viewstaff')
      );
    }
    return location.pathname === path;
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
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
      {/* Menu Button - Only visible on mobile */}
      <button
        id="menu-button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AiOutlineMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
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
            src="/profile_pic2.png"
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
                      isActive(item.path)
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

export default SuperAdminSidebar;
