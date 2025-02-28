import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../Pages/Auth/LoginPage';
import ProtectedRoute from './ProtectedRoutes';
import SuperadminLayout from '../layouts/SuperadminLayout';
import AdminLayout from '../layouts/AdminLayout';
import SuperAdminDashboard from '../Pages/SuperAdmin/SuperAdminDashboard';
import CompanyManagement from '../Pages/SuperAdmin/CompanyManagement';
import UnauthorizedPage from '../Pages/Auth/UnauthorizedPage';
import SuperAdminUserManagement from '../Pages/SuperAdmin/SuperAdminUserManagement';
import SuperAdminViewStaff from '../Pages/SuperAdmin/SuperAdminViewStaff';
import AdminDashboard from '../Pages/Admin/AdminDashboard';
import ClientLocationDashboard from '../Components/AdminComponents/Client/ClientLocationDashboard';
import ClientTable from '../Components/AdminComponents/Client/ClientTable';
import LocationTable from '../Components/AdminComponents/Client/LocationTable';
import { PERMISSIONS } from '../Hooks/userPermission';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Superadmin Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['superadmin', 'SuperAdmin']}>
            <SuperadminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/superadmin">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="company-management" element={<CompanyManagement />} />
          <Route
            path="user-management"
            element={<SuperAdminUserManagement />}
          />
          <Route
            path="viewstaff/:companyId"
            element={<SuperAdminViewStaff />}
          />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              'admin',
              'Admin',
              'staff',
              'Staff',
              'sales',
              'Sales',
            ]}
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Client/Location Routes */}
          <Route
            path="client-location"
            element={
              <ProtectedRoute
                allowedRoles={[
                  'admin',
                  'Admin',
                  'staff',
                  'Staff',
                  'sales',
                  'Sales',
                ]}
                allowedPermissions={[
                  PERMISSIONS.VIEW_CLIENTS,
                  PERMISSIONS.VIEW_LOCATIONS,
                ]}
                element={<ClientLocationDashboard />}
              />
            }
          />

          {/* Client List Route */}
          <Route
            path="clients"
            element={
              <ProtectedRoute
                allowedRoles={[
                  'admin',
                  'Admin',
                  'staff',
                  'Staff',
                  'sales',
                  'Sales',
                ]}
                allowedPermissions={[PERMISSIONS.VIEW_CLIENTS]}
                element={<ClientTable />}
              />
            }
          />

          {/* Location List Route */}
          <Route
            path="locations"
            element={
              <ProtectedRoute
                allowedRoles={[
                  'admin',
                  'Admin',
                  'staff',
                  'Staff',
                  'sales',
                  'Sales',
                ]}
                allowedPermissions={[PERMISSIONS.VIEW_LOCATIONS]}
                element={<LocationTable />}
              />
            }
          />

          {/* Contract Routes */}
          <Route
            path="contract-dashboard"
            element={<div>Contract Dashboard</div>}
          />
        </Route>
      </Route>

      {/* Redirect root to admin dashboard for admin users */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
