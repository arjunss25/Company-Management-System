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
  EDIT_VIEW_QUOTATIONS: 'edit_view_quotations',
  DELETE_VIEW_QUOTATIONS: 'delete_view_quotations',
  EXPORT_VIEW_QUOTATIONS: 'export_view_quotations',
  CREATE_QUOTATION: 'create_quotation',
  EDIT_QUOTATION: 'edit_quotation',
  DELETE_QUOTATION: 'delete_quotation',
  APPROVE_QUOTATION: 'approve_quotation',
  CANCEL_QUOTATION: 'cancel_quotation',
  REVERT_QUOTATION: 'revert_quotation',
  // Quotation Status permissions
  VIEW_ACTIVE_QUOTATIONS: 'view_active_quotations',
  EDIT_ACTIVE_QUOTATIONS: 'edit_active_quotations',
  DELETE_ACTIVE_QUOTATIONS: 'delete_active_quotations',
  EXPORT_ACTIVE_QUOTATIONS: 'export_active_quotations',
  VIEW_PENDING_QUOTATIONS: 'view_pending_quotations',
  EDIT_PENDING_QUOTATIONS: 'edit_pending_quotations',
  DELETE_PENDING_QUOTATIONS: 'delete_pending_quotations',
  EXPORT_PENDING_QUOTATIONS: 'export_pending_quotations',
  VIEW_CANCELLED_QUOTATIONS: 'view_cancelled_quotations',
  EDIT_CANCELLED_QUOTATIONS: 'edit_cancelled_quotations',
  REVERT_CANCELLED_QUOTATIONS: 'revert_cancelled_quotations',
  EXPORT_CANCELLED_QUOTATIONS: 'export_cancelled_quotations',
  VIEW_PENDING_WORKSTARTED: 'view_pending_workstarted',
  EDIT_PENDING_WORKSTARTED: 'edit_pending_workstarted',
  DELETE_PENDING_WORKSTARTED: 'delete_pending_workstarted',
  EXPORT_PENDING_WORKSTARTED: 'export_pending_workstarted',
  VIEW_CLOSED_PROJECTS: 'view_closed_projects',
  EDIT_CLOSED_PROJECTS: 'edit_closed_projects',
  DELETE_CLOSED_PROJECTS: 'delete_closed_projects',
  EXPORT_CLOSED_PROJECTS: 'export_closed_projects',
  VIEW_NOT_STARTED: 'view_not_started',
  EDIT_NOT_STARTED: 'edit_not_started',
  DELETE_NOT_STARTED: 'delete_not_started',
  EXPORT_NOT_STARTED: 'export_not_started',
  VIEW_IN_PROGRESS: 'view_in_progress',
  EDIT_IN_PROGRESS: 'edit_in_progress',
  DELETE_IN_PROGRESS: 'delete_in_progress',
  EXPORT_IN_PROGRESS: 'export_in_progress',
  VIEW_NO_ACCESS: 'view_no_access',
  EDIT_NO_ACCESS: 'edit_no_access',
  DELETE_NO_ACCESS: 'delete_no_access',
  EXPORT_NO_ACCESS: 'export_no_access',
  VIEW_ON_HOLD: 'view_on_hold',
  EDIT_ON_HOLD: 'edit_on_hold',
  DELETE_ON_HOLD: 'delete_on_hold',
  EXPORT_ON_HOLD: 'export_on_hold',
  VIEW_HANDOVER_OVERDUE: 'view_handover_overdue',
  EDIT_HANDOVER_OVERDUE: 'edit_handover_overdue',
  DELETE_HANDOVER_OVERDUE: 'delete_handover_overdue',
  EXPORT_HANDOVER_OVERDUE: 'export_handover_overdue',
  VIEW_COMPLETED: 'view_completed',
  EDIT_COMPLETED: 'edit_completed',
  DELETE_COMPLETED: 'delete_completed',
  EXPORT_COMPLETED: 'export_completed',
  VIEW_LPO_PENDING: 'view_lpo_pending',
  EDIT_LPO_PENDING: 'edit_lpo_pending',
  DELETE_LPO_PENDING: 'delete_lpo_pending',
  EXPORT_LPO_PENDING: 'export_lpo_pending',
  VIEW_WCR_PENDING: 'view_wcr_pending',
  EDIT_WCR_PENDING: 'edit_wcr_pending',
  DELETE_WCR_PENDING: 'delete_wcr_pending',
  EXPORT_WCR_PENDING: 'export_wcr_pending',
  VIEW_GRN_PENDING: 'view_grn_pending',
  EDIT_GRN_PENDING: 'edit_grn_pending',
  DELETE_GRN_PENDING: 'delete_grn_pending',
  EXPORT_GRN_PENDING: 'export_grn_pending',
  VIEW_INVOICE_PENDING: 'view_invoice_pending',
  EDIT_INVOICE_PENDING: 'edit_invoice_pending',
  DELETE_INVOICE_PENDING: 'delete_invoice_pending',
  EXPORT_INVOICE_PENDING: 'export_invoice_pending',
  VIEW_LPO_RECEIVED: 'view_lpo_received',
  EDIT_LPO_RECEIVED: 'edit_lpo_received',
  DELETE_LPO_RECEIVED: 'delete_lpo_received',
  EXPORT_LPO_RECEIVED: 'export_lpo_received',
  VIEW_GRN_RECEIVED: 'view_grn_received',
  EDIT_GRN_RECEIVED: 'edit_grn_received',
  DELETE_GRN_RECEIVED: 'delete_grn_received',
  EXPORT_GRN_RECEIVED: 'export_grn_received',
  VIEW_INVOICE_SUBMITTED: 'view_invoice_submitted',
  EDIT_INVOICE_SUBMITTED: 'edit_invoice_submitted',
  DELETE_INVOICE_SUBMITTED: 'delete_invoice_submitted',
  EXPORT_INVOICE_SUBMITTED: 'export_invoice_submitted',
  VIEW_RETENTION_INVOICE_PENDING: 'view_retention_invoice_pending',
  EDIT_RETENTION_INVOICE_PENDING: 'edit_retention_invoice_pending',
  DELETE_RETENTION_INVOICE_PENDING: 'delete_retention_invoice_pending',
  EXPORT_RETENTION_INVOICE_PENDING: 'export_retention_invoice_pending',
  VIEW_RETENTION_INVOICE_OVERDUE: 'view_retention_invoice_overdue',
  EDIT_RETENTION_INVOICE_OVERDUE: 'edit_retention_invoice_overdue',
  DELETE_RETENTION_INVOICE_OVERDUE: 'delete_retention_invoice_overdue',
  EXPORT_RETENTION_INVOICE_OVERDUE: 'export_retention_invoice_overdue',
  VIEW_RETENTION_INVOICE_SUBMITTED: 'view_retention_invoice_submitted',
  EDIT_RETENTION_INVOICE_SUBMITTED: 'edit_retention_invoice_submitted',
  DELETE_RETENTION_INVOICE_SUBMITTED: 'delete_retention_invoice_submitted',
  EXPORT_RETENTION_INVOICE_SUBMITTED: 'export_retention_invoice_submitted',
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
