import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import TokenService from '../Config/tokenService';
import usePermissions from '../Hooks/userPermission';

const ProtectedRoute = ({
  allowedRoles,
  allowedPermissions,
  element: Element,
  children,
}) => {
  const { loading, hasPermission } = usePermissions();
  const token = TokenService.getToken();
  const userRole = TokenService.getUserRole();

  console.log('ProtectedRoute - Checking access:', {
    userRole,
    allowedRoles,
    allowedPermissions,
    hasToken: !!token,
    loading,
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse">Loading permissions...</div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check role-based access
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(
      (role) => role.toLowerCase() === userRole?.toLowerCase()
    );

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

    console.log('Checking permissions:', {
      required: allowedPermissions,
      hasAccess: hasRequiredPermission,
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
  if (Element) {
    return (
      <>
        {Element}
        {children && <Outlet />}
      </>
    );
  }

  // Otherwise render children
  return children || <Outlet />;
};

export default ProtectedRoute;
