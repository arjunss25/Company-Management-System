import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from '../Components/SuperadminSidebar';
import Navbar from '../Components/Navbar';

const SuperadminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperadminLayout;
