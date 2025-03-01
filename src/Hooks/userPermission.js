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

  // Material permissions
  VIEW_MATERIALS: 'view_materials',
  CREATE_MATERIAL: 'create_material',
  EDIT_MATERIAL: 'edit_material',
  DELETE_MATERIAL: 'delete_material',
  VIEW_MATERIAL_REQUESTS: 'view_material_requests',
  MANAGE_MATERIAL_REQUESTS: 'manage_material_requests',
  VIEW_MATERIAL_CONSUMPTION: 'view_material_consumption',
  MANAGE_STORE: 'manage_store',
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
    PERMISSIONS.VIEW_MATERIALS,
    PERMISSIONS.CREATE_MATERIAL,
    PERMISSIONS.EDIT_MATERIAL,
    PERMISSIONS.DELETE_MATERIAL,
    PERMISSIONS.VIEW_MATERIAL_REQUESTS,
    PERMISSIONS.MANAGE_MATERIAL_REQUESTS,
    PERMISSIONS.VIEW_MATERIAL_CONSUMPTION,
    PERMISSIONS.MANAGE_STORE,
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
    PERMISSIONS.VIEW_MATERIALS,
    PERMISSIONS.CREATE_MATERIAL,
    PERMISSIONS.EDIT_MATERIAL,
    PERMISSIONS.DELETE_MATERIAL,
    PERMISSIONS.VIEW_MATERIAL_REQUESTS,
    PERMISSIONS.MANAGE_MATERIAL_REQUESTS,
    PERMISSIONS.VIEW_MATERIAL_CONSUMPTION,
    PERMISSIONS.MANAGE_STORE,
  ],
  staff: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.CREATE_LOCATION,
    PERMISSIONS.EDIT_LOCATION,
    PERMISSIONS.VIEW_MATERIALS,
    PERMISSIONS.VIEW_MATERIAL_REQUESTS,
    PERMISSIONS.VIEW_MATERIAL_CONSUMPTION,
  ],
  Staff: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.CREATE_LOCATION,
    PERMISSIONS.EDIT_LOCATION,
    PERMISSIONS.VIEW_MATERIALS,
    PERMISSIONS.VIEW_MATERIAL_REQUESTS,
    PERMISSIONS.VIEW_MATERIAL_CONSUMPTION,
  ],
  sales: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.VIEW_MATERIALS,
  ],
  Sales: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.VIEW_MATERIALS,
  ],
};

const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPermissions = () => {
      try {
        setLoading(true);
        // Get permissions from TokenService
        const permissions = TokenService.getUserPermissions();
        console.log('Loaded permissions from storage:', permissions);
        setUserPermissions(permissions);
        setError(null);
      } catch (err) {
        console.error('Error loading permissions:', err);
        setError(err.message);
        setUserPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();

    // Set up an interval to check for permission changes
    const intervalId = setInterval(loadPermissions, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const hasPermission = (permission) => {
    // Log the permission check
    console.log('Checking permission:', {
      permission,
      userPermissions,
      hasPermission: userPermissions.includes(permission),
    });

    return userPermissions.includes(permission);
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
    error,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessPage,
    canPerformAction,
  };
};

export default usePermissions;
