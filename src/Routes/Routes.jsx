import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../Pages/Auth/LoginPage';
import ProtectedRoute from './ProtectedRoutes';
import SuperadminLayout from '../layouts/SuperadminLayout';
import AdminLayout from '../layouts/AdminLayout';
import SuperAdminDashboard from '../Pages/SuperAdmin/SuperAdminDashboard';
import CompanyManagement from '../Pages/SuperAdmin/CompanyManagement';
import UnauthorizedPage from '../Pages/Auth/UnauthorizedPage';
import SuperAdminUserManagement from '../Pages/SuperAdmin/SuperAdminUserManagement';
import SuperAdminViewStaff from '../Pages/SuperAdmin/SuperAdminViewStaff';
import AdminDashboard from '../Pages/Admin/AdminDashboard';
import ClientLocationDashboard from '../Components/AdminComponents/Client/ClientLocationDashboard';
import ClientTable from '../Components/AdminComponents/Client/ClientTable';
import LocationTable from '../Components/AdminComponents/Client/LocationTable';
import { PERMISSIONS } from '../Hooks/userPermission';
import MaterialDashboard from '../Components/AdminComponents/Material/MaterialDashboard';
import ViewMaterial from '../Components/AdminComponents/Material/ViewMaterial';
import MaterialRequest from '../Components/AdminComponents/Material/MaterialRequest';
import MaterialRequestDetails from '../Components/AdminComponents/Material/MaterialRequestDetails';
import PendingMaterialRequest from '../Components/AdminComponents/Material/PendingMaterialRequest';
import MaterialConsumption from '../Components/AdminComponents/Material/MaterialConsumption';
import StoreData from '../Components/AdminComponents/Material/StoreData';
import TermsandConditionDashboard from '../Components/AdminComponents/TermsandConditions/TermsandConditionDashboard';
import GeneralTermsandCondition from '../Components/AdminComponents/TermsandConditions/GeneralTermsandCondition';
import Paymentterms from '../Components/AdminComponents/TermsandConditions/Paymentterms';
import CompletionandDelivery from '../Components/AdminComponents/TermsandConditions/CompletionandDelivery';
import Quotationvalidity from '../Components/AdminComponents/TermsandConditions/Quotationvalidity';
import Warranty from '../Components/AdminComponents/TermsandConditions/Warranty';
import ContractDashboard from '../Components/AdminComponents/Contract/ContractDashboard';
import ViewRateCard from '../Components/AdminComponents/Contract/ViewRateCard';
import ViewRateCardItems from '../Components/AdminComponents/Contract/ViewRateCardItems';
import ExpiringSoon from '../Components/AdminComponents/Contract/ExpiringSoon';
import ExpiredContracts from '../Components/AdminComponents/Contract/ExpiredContracts';
import ActiveContract from '../Components/AdminComponents/Contract/ActiveContract';
import AddContract from '../Components/AdminComponents/Contract/AddContract';
import UsermanagementDashboard from '../Components/AdminComponents/UserManagement/UsermanagementDashboard';
import Staffdetails from '../Components/AdminComponents/UserManagement/Staffdetails';
import Userrights from '../Components/AdminComponents/UserManagement/Userrights';
import AddRateCardModal from '../Components/AdminComponents/Contract/AddRateCardModal';
import UpdateRateCardModal from '../Components/AdminComponents/Contract/UpdateRateCardModal';
import QuotationDashboard from '../Components/AdminComponents/Quotation/QuotationDashboard';
import AddQuotations from '../Components/AdminComponents/Quotation/AddQuotation/AddQuotations';
import ViewQuotationTable from '../Components/AdminComponents/Quotation/ViewQuotationTable';
import ActiveQuotationTable from '../Components/AdminComponents/Quotation/ActiveQuotationTable';
import PendingForApproval from '../Components/AdminComponents/Quotation/PendingForApproval';
import CancelledQuotationTable from '../Components/AdminComponents/Quotation/CancelledQuotationTable';
import EditQuotation from '../Components/AdminComponents/Quotation/EditQuotation/EditQuotation';
import NotStartedTable from '../Components/AdminComponents/Quotation/WorkStatus/NotStartedTable';
import InProgress from '../Components/AdminComponents/Quotation/WorkStatus/InProgress';
import Completed from '../Components/AdminComponents/Quotation/WorkStatus/Completed';
import OnHold from '../Components/AdminComponents/Quotation/WorkStatus/Onhold';
import NoAccess from '../Components/AdminComponents/Quotation/WorkStatus/NoAccess';
import LpoPending from '../Components/AdminComponents/Quotation/DocumentationStatus/LpoPending';
import WcrPending from '../Components/AdminComponents/Quotation/DocumentationStatus/WcrPending';
import GrnPending from '../Components/AdminComponents/Quotation/DocumentationStatus/GrnPending';
import InvoicePending from '../Components/AdminComponents/Quotation/DocumentationStatus/InvoicePending';
import LpoReceived from '../Components/AdminComponents/Quotation/DocumentationStatus/LpoReceived';
import GrnReceived from '../Components/AdminComponents/Quotation/DocumentationStatus/GrnReceived';
import RetentionOverDue from '../Components/AdminComponents/Quotation/Retention/RetentionOverDue';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Superadmin Routes */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute
            allowedRoles={['superadmin', 'SuperAdmin']}
            element={<SuperadminLayout />}
          />
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="company-management" element={<CompanyManagement />} />
        <Route path="user-management" element={<SuperAdminUserManagement />} />
        <Route path="view-staff" element={<SuperAdminViewStaff />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={[
              'admin',
              'Admin',
              'staff',
              'Staff',
              'sales',
              'Sales',
            ]}
            element={<AdminLayout />}
          />
        }
      >
        <Route
          path="dashboard"
          element={
            <ProtectedRoute
              allowedPermissions={['view_dashboard']}
              element={<AdminDashboard />}
            />
          }
        />
        <Route
          path="client-location"
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
              allowedPermissions={['view_clients', 'view_locations']}
              element={<ClientLocationDashboard />}
            />
          }
        />
        <Route
          path="clients"
          element={
            <ProtectedRoute
              allowedPermissions={['view_clients']}
              element={<ClientTable />}
            />
          }
        />
        <Route
          path="locations"
          element={
            <ProtectedRoute
              allowedPermissions={['view_locations']}
              element={<LocationTable />}
            />
          }
        />
        <Route
          path="material-dashboard"
          element={
            <ProtectedRoute
              allowedPermissions={['view_materials']}
              element={<MaterialDashboard />}
            />
          }
        />
        <Route
          path="view-material"
          element={
            <ProtectedRoute
              allowedPermissions={['view_materials']}
              element={<ViewMaterial />}
            />
          }
        />
        <Route
          path="material-requests"
          element={
            <ProtectedRoute
              allowedPermissions={['view_material_requests']}
              element={<MaterialRequest />}
            />
          }
        />
        <Route
          path="material-request-details/:id"
          element={
            <ProtectedRoute
              allowedPermissions={['view_material_requests']}
              element={<MaterialRequestDetails />}
            />
          }
        />
        <Route
          path="pending-material-requests"
          element={
            <ProtectedRoute
              allowedPermissions={['manage_material_requests']}
              element={<PendingMaterialRequest />}
            />
          }
        />
        <Route
          path="material-consumption"
          element={
            <ProtectedRoute
              allowedPermissions={['view_material_consumption']}
              element={<MaterialConsumption />}
            />
          }
        />
        <Route
          path="store-data"
          element={
            <ProtectedRoute
              allowedPermissions={['manage_store']}
              element={<StoreData />}
            />
          }
        />

        {/* Terms and Conditions Routes */}
        <Route
          path="terms-and-conditions-dashboard"
          element={
            <ProtectedRoute
              allowedPermissions={['view_terms_and_conditions']}
              element={<TermsandConditionDashboard />}
            />
          }
        />
        <Route
          path="general-terms"
          element={
            <ProtectedRoute
              allowedPermissions={['view_general_terms']}
              element={<GeneralTermsandCondition />}
            />
          }
        />
        <Route
          path="payment-terms"
          element={
            <ProtectedRoute
              allowedPermissions={['view_payment_terms']}
              element={<Paymentterms />}
            />
          }
        />
        <Route
          path="completion-delivery"
          element={
            <ProtectedRoute
              allowedPermissions={['view_completion_terms']}
              element={<CompletionandDelivery />}
            />
          }
        />
        <Route
          path="quotation-validity"
          element={
            <ProtectedRoute
              allowedPermissions={['view_quotation_terms']}
              element={<Quotationvalidity />}
            />
          }
        />
        <Route
          path="warranty-terms"
          element={
            <ProtectedRoute
              allowedPermissions={['view_warranty_terms']}
              element={<Warranty />}
            />
          }
        />

        {/* Contract Routes */}
        <Route
          path="contract-dashboard"
          element={
            <ProtectedRoute
              allowedPermissions={['view_contracts']}
              element={<ContractDashboard />}
            />
          }
        />
        <Route
          path="add-rate-card"
          element={
            <ProtectedRoute
              allowedPermissions={['create_rate_card']}
              element={<AddRateCardModal />}
            />
          }
        />
        <Route
          path="view-rate-card"
          element={
            <ProtectedRoute
              allowedPermissions={['view_rate_cards']}
              element={<ViewRateCard />}
            />
          }
        />
        <Route
          path="update-rate-card/:id"
          element={
            <ProtectedRoute
              allowedPermissions={['edit_rate_card']}
              element={<UpdateRateCardModal />}
            />
          }
        />
        <Route
          path="add-contract"
          element={
            <ProtectedRoute
              allowedPermissions={['create_contract']}
              element={<AddContract />}
            />
          }
        />
        <Route
          path="active-contracts"
          element={
            <ProtectedRoute
              allowedPermissions={['view_contracts']}
              element={<ActiveContract />}
            />
          }
        />
        <Route
          path="expired-contracts"
          element={
            <ProtectedRoute
              allowedPermissions={['view_contracts']}
              element={<ExpiredContracts />}
            />
          }
        />
        <Route
          path="expiring-contracts"
          element={
            <ProtectedRoute
              allowedPermissions={['view_contracts']}
              element={<ExpiringSoon />}
            />
          }
        />
        <Route
          path="view-rate-card-items"
          element={
            <ProtectedRoute
              allowedPermissions={['view_rate_cards']}
              element={<ViewRateCardItems />}
            />
          }
        />

        {/* User Management Routes */}
        <Route
          path="user-management"
          element={
            <ProtectedRoute
              allowedPermissions={['view_user_management']}
              element={<UsermanagementDashboard />}
            />
          }
        />
        <Route
          path="staff-details"
          element={
            <ProtectedRoute
              allowedPermissions={['view_user_details']}
              element={<Staffdetails />}
            />
          }
        />
        <Route
          path="user-rights"
          element={
            <ProtectedRoute
              allowedPermissions={['manage_user_permissions']}
              element={<Userrights />}
            />
          }
        />







{/* /////////////////////////////////////////////////// */}
 {/* Quotation Routes - Move them inside admin route block */}
 <Route
    path="quotation-dashboard"
    element={
      <ProtectedRoute
        allowedRoles={['admin', 'Admin', 'staff', 'Staff', 'sales', 'Sales']}
        allowedPermissions={[PERMISSIONS.VIEW_QUOTATIONS]}
        element={<QuotationDashboard />}
      />
    }
  />
  <Route 
    path="add-quotations" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.CREATE_QUOTATION]} 
        element={<AddQuotations />} 
      />
    } 
  />
  <Route 
    path="view-quotations" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_QUOTATIONS]} 
        element={<ViewQuotationTable />} 
      />
    } 
  />
  <Route 
    path="active-quotations" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_ACTIVE_QUOTATIONS]} 
        element={<ActiveQuotationTable />} 
      />
    } 
  />
  <Route 
    path="pending-approval" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_PENDING_QUOTATIONS]} 
        element={<PendingForApproval />} 
      />
    } 
  />
  <Route 
    path="cancelled-quotations" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_CANCELLED_QUOTATIONS]} 
        element={<CancelledQuotationTable />} 
      />
    } 
  />
  <Route 
    path="edit-quotation/:id" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.EDIT_QUOTATION]} 
        element={<EditQuotation />} 
      />
    } 
  />

  {/* Work Status Routes */}
  <Route 
    path="not-started" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_NOT_STARTED]} 
        element={<NotStartedTable />} 
      />
    } 
  />
  <Route 
    path="in-progress" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_IN_PROGRESS]} 
        element={<InProgress />} 
      />
    } 
  />
  <Route 
    path="completed" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_COMPLETED]} 
        element={<Completed />} 
      />
    } 
  />
  <Route 
    path="on-hold" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_ON_HOLD]} 
        element={<OnHold />} 
      />
    } 
  />
  <Route 
    path="no-access" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_NO_ACCESS]} 
        element={<NoAccess />} 
      />
    } 
  />

  {/* Documentation Status Routes */}
  <Route 
    path="lpo-pending" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_LPO_STATUS]} 
        element={<LpoPending />} 
      />
    } 
  />
  <Route 
    path="wcr-pending" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_WCR_STATUS]} 
        element={<WcrPending />} 
      />
    } 
  />
  <Route 
    path="grn-pending" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_GRN_STATUS]} 
        element={<GrnPending />} 
      />
    } 
  />
  <Route 
    path="invoice-pending" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_INVOICE_STATUS]} 
        element={<InvoicePending />} 
      />
    } 
  />
  <Route 
    path="lpo-received" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_LPO_STATUS]} 
        element={<LpoReceived />} 
      />
    } 
  />
  <Route 
    path="grn-received" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_GRN_STATUS]} 
        element={<GrnReceived />} 
      />
    } 
  />

  {/* Retention Routes */}
  <Route 
    path="retention-overdue" 
    element={
      <ProtectedRoute 
        allowedPermissions={[PERMISSIONS.VIEW_RETENTION_STATUS]} 
        element={<RetentionOverDue />} 
      />
    } 
  />









      </Route>
 













      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
