import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TokenService from '../Config/tokenService';
import {
  selectIsAuthenticated,
  selectUserRole,
  selectPermissions,
} from '../store/slices/authSlice';

const ProtectedRoute = ({ allowedRoles, allowedPermissions, element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const userPermissions = useSelector(selectPermissions);
  const token = TokenService.getToken();
  const isSuperAdmin = userRole === 'SuperAdmin';
  const isStaff = userRole === 'Staff';
  const isSalesPerson = userRole === 'Sales Person';

  console.log('Auth Debug:', {
    isAuthenticated,
    userRole,
    userPermissions,
    hasToken: !!token,
    isSuperAdmin,
    isStaff,
    isSalesPerson,
  });

  console.log('ProtectedRoute - Checking access:', {
    token: token ? 'Token exists' : 'No token',
    userRole,
    allowedRoles,
    allowedPermissions,
    userPermissions,
    isAuthenticated,
    isSuperAdmin,
    isStaff,
    isSalesPerson,
  });

  // Check both Redux auth state and token
  if (!isAuthenticated || !token) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Role-based access check
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(
      (role) => role.toLowerCase() === userRole?.toLowerCase()
    );

    if (!hasAllowedRole) {
      console.log('Unauthorized role, redirecting to unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Permission-based access check
  if (Array.isArray(allowedPermissions) && allowedPermissions.length > 0) {
    // SuperAdmin bypasses permission checks
    if (isSuperAdmin) {
      return element ? element : <Outlet />;
    }

    // Staff and Sales Person need to have the required permissions
    if (isStaff || isSalesPerson) {
      const hasRequiredPermissions = allowedPermissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasRequiredPermissions) {
        console.log('Unauthorized permission, redirecting to unauthorized');
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  return element ? element : <Outlet />;
};

export default ProtectedRoute;
