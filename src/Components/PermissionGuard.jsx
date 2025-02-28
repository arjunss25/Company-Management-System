import React from 'react';
import usePermissions from '../Hooks/userPermission';

const PermissionGuard = ({
  permissions,
  children,
  fallback = null,
  requireAll = false,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } =
    usePermissions();

  // If single permission is provided
  if (typeof permissions === 'string') {
    return hasPermission(permissions) ? children : fallback;
  }

  // If array of permissions is provided
  if (Array.isArray(permissions)) {
    // Check if we need all permissions or any permission
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    return hasAccess ? children : fallback;
  }

  // If no permissions specified, render children
  return children;
};

export default PermissionGuard;
