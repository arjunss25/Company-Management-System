import React from 'react';
import { Navigate } from 'react-router-dom';
import TokenService from '../Config/tokenService';
import usePermissions from '../Hooks/userPermission';

const ProtectedRoute = ({
  allowedRoles,
  allowedPermissions,
  element,
  children,
}) => {
  const { loading, hasPermission } = usePermissions();
  const token = TokenService.getToken();
  const userRole = TokenService.getUserRole()?.toLowerCase();

  // Add detailed logging
  console.log('ProtectedRoute Debug:', {
    token: token ? 'Token exists' : 'No token',
    userRole,
    allowedRoles,
    allowedPermissions,
    loading,
    hasPermission: (permission) => hasPermission(permission),
  });

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check role-based access
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(
      (role) => role.toLowerCase() === userRole
    );

    console.log('Role check:', {
      userRole,
      allowedRoles,
      hasAllowedRole,
    });

    if (!hasAllowedRole) {
      console.log(
        'Unauthorized role, redirecting. Expected one of:',
        allowedRoles,
        'but got:',
        userRole
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If permissions are specified, check permission-based access
  if (Array.isArray(allowedPermissions) && allowedPermissions.length > 0) {
    const hasRequiredPermission = allowedPermissions.some((permission) =>
      hasPermission(permission)
    );

    console.log('Permission check:', {
      requiredPermissions: allowedPermissions,
      hasRequiredPermission,
    });

    if (!hasRequiredPermission) {
      console.log(
        'Unauthorized permission, redirecting. Required one of:',
        allowedPermissions
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If element prop is provided, render it
  if (element) {
    return element;
  }

  // Otherwise render children
  return children;
};

export default ProtectedRoute;
