import { useState, useEffect } from 'react';
import TokenService from '../Config/tokenService';

// Define permission types
export const PERMISSIONS = {
  // Page permissions
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_CLIENTS: 'view_clients',
  VIEW_LOCATIONS: 'view_locations',

  // User Management permissions
  VIEW_USER_MANAGEMENT: 'view_user_management',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  VIEW_USER_DETAILS: 'view_user_details',
  MANAGE_USER_ROLES: 'manage_user_roles',
  MANAGE_USER_PERMISSIONS: 'manage_user_permissions',

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

  // Terms & Conditions permissions
  VIEW_TERMS_AND_CONDITIONS: 'view_terms_and_conditions',
  VIEW_GENERAL_TERMS: 'view_general_terms',
  VIEW_PAYMENT_TERMS: 'view_payment_terms',
  VIEW_COMPLETION_TERMS: 'view_completion_terms',
  VIEW_QUOTATION_TERMS: 'view_quotation_terms',
  VIEW_WARRANTY_TERMS: 'view_warranty_terms',
  CREATE_TERMS: 'create_terms',
  EDIT_TERMS: 'edit_terms',
  DELETE_TERMS: 'delete_terms',

  // Contract permissions
  VIEW_CONTRACTS: 'view_contracts',
  CREATE_CONTRACT: 'create_contract',
  EDIT_CONTRACT: 'edit_contract',
  DELETE_CONTRACT: 'delete_contract',
  VIEW_RATE_CARDS: 'view_rate_cards',
  CREATE_RATE_CARD: 'create_rate_card',
  EDIT_RATE_CARD: 'edit_rate_card',
  DELETE_RATE_CARD: 'delete_rate_card',
  VIEW_EXPIRED_CONTRACTS: 'view_expired_contracts',
  VIEW_EXPIRING_CONTRACTS: 'view_expiring_contracts',
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
    // User Management permissions for admin
    PERMISSIONS.VIEW_USER_MANAGEMENT,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VIEW_USER_DETAILS,
    PERMISSIONS.MANAGE_USER_ROLES,
    PERMISSIONS.MANAGE_USER_PERMISSIONS,
    // Terms & Conditions permissions for admin
    PERMISSIONS.VIEW_TERMS_AND_CONDITIONS,
    PERMISSIONS.VIEW_GENERAL_TERMS,
    PERMISSIONS.VIEW_PAYMENT_TERMS,
    PERMISSIONS.VIEW_COMPLETION_TERMS,
    PERMISSIONS.VIEW_QUOTATION_TERMS,
    PERMISSIONS.VIEW_WARRANTY_TERMS,
    PERMISSIONS.CREATE_TERMS,
    PERMISSIONS.EDIT_TERMS,
    PERMISSIONS.DELETE_TERMS,
    // Contract permissions for admin
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACT,
    PERMISSIONS.EDIT_CONTRACT,
    PERMISSIONS.DELETE_CONTRACT,
    PERMISSIONS.VIEW_RATE_CARDS,
    PERMISSIONS.CREATE_RATE_CARD,
    PERMISSIONS.EDIT_RATE_CARD,
    PERMISSIONS.DELETE_RATE_CARD,
    PERMISSIONS.VIEW_EXPIRED_CONTRACTS,
    PERMISSIONS.VIEW_EXPIRING_CONTRACTS,
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
    // User Management permissions for Admin
    PERMISSIONS.VIEW_USER_MANAGEMENT,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VIEW_USER_DETAILS,
    PERMISSIONS.MANAGE_USER_ROLES,
    PERMISSIONS.MANAGE_USER_PERMISSIONS,
    // Terms & Conditions permissions for Admin
    PERMISSIONS.VIEW_TERMS_AND_CONDITIONS,
    PERMISSIONS.VIEW_GENERAL_TERMS,
    PERMISSIONS.VIEW_PAYMENT_TERMS,
    PERMISSIONS.VIEW_COMPLETION_TERMS,
    PERMISSIONS.VIEW_QUOTATION_TERMS,
    PERMISSIONS.VIEW_WARRANTY_TERMS,
    PERMISSIONS.CREATE_TERMS,
    PERMISSIONS.EDIT_TERMS,
    PERMISSIONS.DELETE_TERMS,
    // Contract permissions for Admin
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACT,
    PERMISSIONS.EDIT_CONTRACT,
    PERMISSIONS.DELETE_CONTRACT,
    PERMISSIONS.VIEW_RATE_CARDS,
    PERMISSIONS.CREATE_RATE_CARD,
    PERMISSIONS.EDIT_RATE_CARD,
    PERMISSIONS.DELETE_RATE_CARD,
    PERMISSIONS.VIEW_EXPIRED_CONTRACTS,
    PERMISSIONS.VIEW_EXPIRING_CONTRACTS,
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
    // Limited Terms & Conditions permissions for staff
    PERMISSIONS.VIEW_TERMS_AND_CONDITIONS,
    PERMISSIONS.VIEW_GENERAL_TERMS,
    PERMISSIONS.VIEW_PAYMENT_TERMS,
    PERMISSIONS.VIEW_COMPLETION_TERMS,
    PERMISSIONS.VIEW_QUOTATION_TERMS,
    PERMISSIONS.VIEW_WARRANTY_TERMS,
    // Limited Contract permissions for staff
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.VIEW_RATE_CARDS,
    PERMISSIONS.VIEW_EXPIRED_CONTRACTS,
    PERMISSIONS.VIEW_EXPIRING_CONTRACTS,
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
    // Limited Terms & Conditions permissions for Staff
    PERMISSIONS.VIEW_TERMS_AND_CONDITIONS,
    PERMISSIONS.VIEW_GENERAL_TERMS,
    PERMISSIONS.VIEW_PAYMENT_TERMS,
    PERMISSIONS.VIEW_COMPLETION_TERMS,
    PERMISSIONS.VIEW_QUOTATION_TERMS,
    PERMISSIONS.VIEW_WARRANTY_TERMS,
    // Limited Contract permissions for Staff
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.VIEW_RATE_CARDS,
    PERMISSIONS.VIEW_EXPIRED_CONTRACTS,
    PERMISSIONS.VIEW_EXPIRING_CONTRACTS,
  ],
  sales: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.VIEW_MATERIALS,
    // Read-only Terms & Conditions permissions for sales
    PERMISSIONS.VIEW_TERMS_AND_CONDITIONS,
    PERMISSIONS.VIEW_GENERAL_TERMS,
    PERMISSIONS.VIEW_PAYMENT_TERMS,
    PERMISSIONS.VIEW_COMPLETION_TERMS,
    PERMISSIONS.VIEW_QUOTATION_TERMS,
    PERMISSIONS.VIEW_WARRANTY_TERMS,
    // Limited Contract permissions for sales
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.VIEW_RATE_CARDS,
    PERMISSIONS.VIEW_EXPIRED_CONTRACTS,
    PERMISSIONS.VIEW_EXPIRING_CONTRACTS,
  ],
  Sales: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.VIEW_MATERIALS,
    // Read-only Terms & Conditions permissions for Sales
    PERMISSIONS.VIEW_TERMS_AND_CONDITIONS,
    PERMISSIONS.VIEW_GENERAL_TERMS,
    PERMISSIONS.VIEW_PAYMENT_TERMS,
    PERMISSIONS.VIEW_COMPLETION_TERMS,
    PERMISSIONS.VIEW_QUOTATION_TERMS,
    PERMISSIONS.VIEW_WARRANTY_TERMS,
    // Limited Contract permissions for Sales
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.VIEW_RATE_CARDS,
    PERMISSIONS.VIEW_EXPIRED_CONTRACTS,
    PERMISSIONS.VIEW_EXPIRING_CONTRACTS,
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
        //permissions from TokenService
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

    // permission check after 30 sec
    const intervalId = setInterval(loadPermissions, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every((permission) => hasPermission(permission));
  };

  // page access
  const canAccessPage = (pagePermission) => {
    return hasPermission(pagePermission);
  };

  // action check
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
