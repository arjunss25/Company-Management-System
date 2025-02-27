import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from '../Components/SuperadminSidebar';
import Navbar from '../Components/Navbar';

const SuperadminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="sidebar lg:w-[300px]">
      <SuperAdminSidebar />
      </div>
      <div className=" w-full lg:w-[calc(100%-300px)]  flex flex-col">
        <Navbar />
        <main className="w-full overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperadminLayout;
