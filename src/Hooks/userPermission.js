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
  // Quotation Management permissions
  VIEW_QUOTATIONS: 'view_quotations',
  CREATE_QUOTATION: 'create_quotation',
  EDIT_QUOTATION: 'edit_quotation',
  DELETE_QUOTATION: 'delete_quotation',
  APPROVE_QUOTATION: 'approve_quotation',
  CANCEL_QUOTATION: 'cancel_quotation',
  // Quotation Status permissions
  VIEW_ACTIVE_QUOTATIONS: 'view_active_quotations',
  VIEW_PENDING_QUOTATIONS: 'view_pending_quotations',
  VIEW_CANCELLED_QUOTATIONS: 'view_cancelled_quotations',
  // Work Status permissions
  VIEW_NOT_STARTED: 'view_not_started',
  VIEW_IN_PROGRESS: 'view_in_progress',
  VIEW_COMPLETED: 'view_completed',
  VIEW_ON_HOLD: 'view_on_hold',
  VIEW_NO_ACCESS: 'view_no_access',
  // Documentation Status permissions
  VIEW_LPO_STATUS: 'view_lpo_status',
  VIEW_WCR_STATUS: 'view_wcr_status',
  VIEW_GRN_STATUS: 'view_grn_status',
  VIEW_INVOICE_STATUS: 'view_invoice_status',
  // Retention permissions
  VIEW_RETENTION_STATUS: 'view_retention_status',
  MANAGE_RETENTION: 'manage_retention',
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
