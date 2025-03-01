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
import MaterialDashboard from '../Components/AdminComponents/Material/MaterialDashboard';
import ViewMaterial from '../Components/AdminComponents/Material/ViewMaterial';
import MaterialRequest from '../Components/AdminComponents/Material/MaterialRequest';
import MaterialRequestDetails from '../Components/AdminComponents/Material/MaterialRequestDetails';
import PendingMaterialRequest from '../Components/AdminComponents/Material/PendingMaterialRequest';
import MaterialConsumption from '../Components/AdminComponents/Material/MaterialConsumption';
import StoreData from '../Components/AdminComponents/Material/StoreData';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Superadmin Routes */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute
            allowedRoles={['superadmin', 'SuperAdmin']}
            element={<SuperadminLayout />}
          />
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="company-management" element={<CompanyManagement />} />
        <Route path="user-management" element={<SuperAdminUserManagement />} />
        <Route path="view-staff" element={<SuperAdminViewStaff />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
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
            element={<AdminLayout />}
          />
        }
      >
        <Route
          path="dashboard"
          element={
            <ProtectedRoute
              allowedPermissions={['view_dashboard']}
              element={<AdminDashboard />}
            />
          }
        />
        <Route
          path="client-location"
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
              allowedPermissions={['view_clients', 'view_locations']}
              element={<ClientLocationDashboard />}
            />
          }
        />
        <Route
          path="clients"
          element={
            <ProtectedRoute
              allowedPermissions={['view_clients']}
              element={<ClientTable />}
            />
          }
        />
        <Route
          path="locations"
          element={
            <ProtectedRoute
              allowedPermissions={['view_locations']}
              element={<LocationTable />}
            />
          }
        />
        <Route
          path="material-dashboard"
          element={
            <ProtectedRoute
              allowedPermissions={['view_materials']}
              element={<MaterialDashboard />}
            />
          }
        />
        <Route
          path="view-material"
          element={
            <ProtectedRoute
              allowedPermissions={['view_materials']}
              element={<ViewMaterial />}
            />
          }
        />
        <Route
          path="material-requests"
          element={
            <ProtectedRoute
              allowedPermissions={['view_material_requests']}
              element={<MaterialRequest />}
            />
          }
        />
        <Route
          path="material-request-details/:id"
          element={
            <ProtectedRoute
              allowedPermissions={['view_material_requests']}
              element={<MaterialRequestDetails />}
            />
          }
        />
        <Route
          path="pending-material-requests"
          element={
            <ProtectedRoute
              allowedPermissions={['manage_material_requests']}
              element={<PendingMaterialRequest />}
            />
          }
        />
        <Route
          path="material-consumption"
          element={
            <ProtectedRoute
              allowedPermissions={['view_material_consumption']}
              element={<MaterialConsumption />}
            />
          }
        />
        <Route
          path="store-data"
          element={
            <ProtectedRoute
              allowedPermissions={['manage_store']}
              element={<StoreData />}
            />
          }
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
