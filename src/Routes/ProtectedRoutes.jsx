import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectUserRole,
  selectPermissions,
} from '../store/slices/authSlice';

const ProtectedRoute = ({ allowedRoles, allowedPermissions, element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const userPermissions = useSelector(selectPermissions);

  console.log('ProtectedRoute - Checking access:', {
    userRole,
    allowedRoles,
    allowedPermissions,
    userPermissions,
    isAuthenticated,
  });

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check role-based access
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(
      (role) => role.toLowerCase() === userRole?.toLowerCase()
    );

    if (!hasAllowedRole) {
      console.log(
        'Unauthorized role, redirecting. Required one of:',
        allowedRoles,
        'but has:',
        userRole
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If permissions are specified, check permission-based access
  if (Array.isArray(allowedPermissions) && allowedPermissions.length > 0) {
    // Check if user has ALL required permissions
    const hasAllRequiredPermissions = allowedPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    console.log('Checking permissions:', {
      required: allowedPermissions,
      userPermissions,
      hasAccess: hasAllRequiredPermissions,
    });

    if (!hasAllRequiredPermissions) {
      console.log(
        'Unauthorized permission, redirecting. Required ALL of:',
        allowedPermissions,
        'but has:',
        userPermissions
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render the protected content
  return element ? element : <Outlet />;
};

export default ProtectedRoute;
