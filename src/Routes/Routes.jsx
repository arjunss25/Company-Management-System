import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../Pages/Auth/LoginPage';
import ProtectedRoute from './ProtectedRoutes';
import SuperadminLayout from '../layouts/SuperadminLayout';
import SuperAdminDashboard from '../Pages/SuperAdmin/SuperAdminDashboard';
import CompanyManagement from '../Pages/SuperAdmin/CompanyManagement';
import UnauthorizedPage from '../Pages/Auth/UnauthorizedPage';
import SuperAdminUserManagement from '../Pages/SuperAdmin/SuperAdminUserManagement';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Superadmin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['superadmin', 'SuperAdmin']} />}>
        <Route path="/superadmin" element={<SuperadminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="company-management" element={<CompanyManagement />} />
          <Route path="user-management" element={<SuperAdminUserManagement />} />
        </Route>
      </Route>

      {/* Protected General Routes */}
      {/* <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
        <Route path="/" element={<GeneralLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GeneralDashboard />} />
         
        </Route>
      </Route> */}

      {/* Redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
