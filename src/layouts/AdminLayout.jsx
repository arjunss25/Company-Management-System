import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Components/AdminSidebar';
import Navbar from '../Components/Navbar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="sidebar lg:w-[300px]">
        <AdminSidebar />
      </div>
      <div className="w-full lg:w-[calc(100%-300px)] flex flex-col">
        <Navbar />
        <main className="w-full overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
