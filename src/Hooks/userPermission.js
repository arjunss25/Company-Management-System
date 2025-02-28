import { useState, useEffect } from 'react';
import TokenService from '../Config/tokenService';

// Define permission types
export const PERMISSIONS = {
  // Page permissions
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_CLIENTS: 'view_clients',
  VIEW_LOCATIONS: 'view_locations',

  // Action permissions for Clients
  CREATE_CLIENT: 'create_client',
  EDIT_CLIENT: 'edit_client',
  DELETE_CLIENT: 'delete_client',

  // Action permissions for Locations
  CREATE_LOCATION: 'create_location',
  EDIT_LOCATION: 'edit_location',
  DELETE_LOCATION: 'delete_location',
};

// Role-based permission mappings
const ROLE_PERMISSIONS = {
  superadmin: Object.values(PERMISSIONS),
  SuperAdmin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.DELETE_CLIENT,
    PERMISSIONS.CREATE_LOCATION,
    PERMISSIONS.EDIT_LOCATION,
    PERMISSIONS.DELETE_LOCATION,
  ],
  Admin: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.DELETE_CLIENT,
    PERMISSIONS.CREATE_LOCATION,
    PERMISSIONS.EDIT_LOCATION,
    PERMISSIONS.DELETE_LOCATION,
  ],
  staff: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.CREATE_LOCATION,
    PERMISSIONS.EDIT_LOCATION,
  ],
  Staff: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.CREATE_LOCATION,
    PERMISSIONS.EDIT_LOCATION,
  ],
  sales: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
  ],
  Sales: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
  ],
};

const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadPermissions = () => {
      const currentRole = TokenService.getUserRole();
      console.log('Loading permissions for role:', currentRole);

      if (currentRole) {
        // Get permissions for the exact role
        const permissions = ROLE_PERMISSIONS[currentRole] || [];
        console.log(
          'Assigned permissions for role',
          currentRole,
          ':',
          permissions
        );
        setUserPermissions(permissions);
        setUserRole(currentRole);
      } else {
        console.log('No user role found');
        setUserPermissions([]);
        setUserRole(null);
      }
      setLoading(false);
    };

    loadPermissions();

    // Set up an interval to check for role changes
    const intervalId = setInterval(loadPermissions, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const hasPermission = (permission) => {
    const currentRole = TokenService.getUserRole();

    // Log the permission check
    console.log('Checking permission:', {
      permission,
      role: currentRole,
      userPermissions,
      isSuperAdmin: currentRole?.toLowerCase() === 'superadmin',
    });

    // Superadmin has all permissions (case-insensitive check)
    if (currentRole?.toLowerCase() === 'superadmin') {
      return true;
    }

    // For other roles, check if the permission exists in their permissions array
    const hasPermissionResult = userPermissions.includes(permission);
    console.log(
      `Permission check result for ${permission}:`,
      hasPermissionResult
    );
    return hasPermissionResult;
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every((permission) => hasPermission(permission));
  };

  // Check if user has access to a specific page
  const canAccessPage = (pagePermission) => {
    return hasPermission(pagePermission);
  };

  // Check if user can perform a specific action
  const canPerformAction = (actionPermission) => {
    return hasPermission(actionPermission);
  };

  return {
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessPage,
    canPerformAction,
    userPermissions,
    userRole,
  };
};

export default usePermissions;
