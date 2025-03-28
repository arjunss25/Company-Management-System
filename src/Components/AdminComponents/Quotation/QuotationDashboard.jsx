import React from 'react';
import { useNavigate } from 'react-router-dom';
import usePermissions from '../../../Hooks/userPermission';
import { PERMISSIONS } from '../../../Hooks/userPermission';
import TokenService from '../../../Config/tokenService';
import { MdAddCircle, MdClose, MdOutlinePendingActions } from 'react-icons/md';
import { FaEye, FaClock, FaHourglassStart } from 'react-icons/fa';
import { VscLayersActive } from 'react-icons/vsc';
import { RiProgress6Line, RiFolderReceivedFill } from 'react-icons/ri';
import { PiCircleNotchFill } from 'react-icons/pi';
import { LuFileClock } from 'react-icons/lu';
import { AiFillFileAdd } from 'react-icons/ai';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { GrDocumentLocked } from 'react-icons/gr';
import { GiCheckMark } from 'react-icons/gi';

const QuotationDashboard = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const userRole = TokenService.getUserRole();
  const isSuperAdmin = userRole === 'SuperAdmin';
  const isStaff = userRole === 'Staff';
  const isSalesPerson = userRole === 'Sales Person';

  // Helper function to check if user has any of the required permissions
  const hasAnyRequiredPermission = (permissions) => {
    // SuperAdmin should have access to everything
    if (isSuperAdmin) return true;

    // Staff and Sales Person need to have at least one of the required permissions
    if (isStaff || isSalesPerson) {
      return permissions.some((permission) => hasPermission(permission));
    }

    return false;
  };

  const sections = [
    {
      title: 'Quotation',
      items: [
        {
          count: '+',
          label: 'Add Quotations',
          icon: <AiFillFileAdd className="text-green-500 text-2xl" />,
          path: '/admin/add-quotations',
          requiredPermissions: [PERMISSIONS.CREATE_QUOTATION],
        },
        {
          count: 44,
          label: 'View Quotations',
          icon: <FaEye className="text-blue-500 text-2xl" />,
          path: '/admin/view-quotations',
          requiredPermissions: [PERMISSIONS.VIEW_QUOTATIONS],
        },
        {
          count: 6,
          label: 'Cancelled Quotations',
          icon: <MdClose className="text-red-500 text-2xl" />,
          path: '/admin/cancelled-quotations',
          requiredPermissions: [PERMISSIONS.VIEW_CANCELLED_QUOTATIONS],
        },
        {
          count: 24,
          label: 'Pending For Approval',
          icon: <FaClock className="text-orange-500 text-2xl" />,
          path: '/admin/pending-approval',
          requiredPermissions: [PERMISSIONS.VIEW_PENDING_QUOTATIONS],
        },
        {
          count: 0,
          label: 'Approval Pending Work Started',
          icon: (
            <MdOutlinePendingActions className="text-orange-500 text-2xl" />
          ),
          path: '/admin/pending-workstarted',
          requiredPermissions: [PERMISSIONS.VIEW_PENDING_WORKSTARTED],
        },
        {
          count: 17,
          label: 'Active Quotations',
          icon: <VscLayersActive className="text-blue-500 text-2xl" />,
          path: '/admin/active-quotations',
          requiredPermissions: [PERMISSIONS.VIEW_ACTIVE_QUOTATIONS],
        },
        {
          count: 3,
          label: 'Closed Projects',
          icon: (
            <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl" />
          ),
          path: '/admin/closed-projects',
          requiredPermissions: [PERMISSIONS.VIEW_CLOSED_PROJECTS],
        },
      ],
    },
    {
      title: 'Work Status',
      items: [
        {
          count: 10,
          label: 'Not Started',
          icon: <PiCircleNotchFill className="text-gray-500 text-2xl" />,
          path: '/admin/not-started',
          requiredPermissions: [PERMISSIONS.VIEW_NOT_STARTED],
        },
        {
          count: 14,
          label: 'In Progress',
          icon: <RiProgress6Line className="text-yellow-500 text-2xl" />,
          path: '/admin/in-progress',
          requiredPermissions: [PERMISSIONS.VIEW_IN_PROGRESS],
        },
        {
          count: 8,
          label: 'No Access',
          icon: <GrDocumentLocked className="text-red-500 text-2xl" />,
          path: '/admin/no-access',
          requiredPermissions: [PERMISSIONS.VIEW_NO_ACCESS],
        },
        {
          count: 8,
          label: 'On Hold',
          icon: <LuFileClock className="text-green-500 text-2xl" />,
          path: '/admin/on-hold',
          requiredPermissions: [PERMISSIONS.VIEW_ON_HOLD],
        },
        {
          count: 17,
          label: 'Handover Overdue',
          icon: <FaHourglassStart className="text-red-500 text-2xl" />,
          path: '/admin/handover-overdue',
          requiredPermissions: [PERMISSIONS.VIEW_HANDOVER_OVERDUE],
        },
        {
          count: 8,
          label: 'Completed',
          icon: <GiCheckMark className="text-green-500 text-2xl" />,
          path: '/admin/completed',
          requiredPermissions: [PERMISSIONS.VIEW_COMPLETED],
        },
      ],
    },
    {
      title: 'Documentation Status',
      items: [
        {
          count: 3,
          label: 'LPO Pending',
          icon: <FaClock className="text-yellow-500 text-2xl" />,
          path: '/admin/lpo-pending',
          requiredPermissions: [PERMISSIONS.VIEW_LPO_PENDING],
        },
        {
          count: 9,
          label: 'WCR Pending',
          icon: <FaClock className="text-blue-500 text-2xl" />,
          path: '/admin/wcr-pending',
          requiredPermissions: [PERMISSIONS.VIEW_WCR_PENDING],
        },
        {
          count: 4,
          label: 'GRN Pending',
          icon: <FaClock className="text-orange-500 text-2xl" />,
          path: '/admin/grn-pending',
          requiredPermissions: [PERMISSIONS.VIEW_GRN_PENDING],
        },
        {
          count: 3,
          label: 'Invoice Pending',
          icon: <MdOutlinePendingActions className="text-blue-500 text-2xl" />,
          path: '/admin/invoice-pending',
          requiredPermissions: [PERMISSIONS.VIEW_INVOICE_PENDING],
        },
        {
          count: 18,
          label: 'LPO Received',
          icon: <RiFolderReceivedFill className="text-green-500 text-2xl" />,
          path: '/admin/lpo-received',
          requiredPermissions: [PERMISSIONS.VIEW_LPO_RECEIVED],
        },
        {
          count: 16,
          label: 'GRN Received',
          icon: <RiFolderReceivedFill className="text-purple-500 text-2xl" />,
          path: '/admin/grn-received',
          requiredPermissions: [PERMISSIONS.VIEW_GRN_RECEIVED],
        },
        {
          count: 16,
          label: 'Invoice Submitted',
          icon: (
            <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl" />
          ),
          path: '/admin/invoice-submitted',
          requiredPermissions: [PERMISSIONS.VIEW_INVOICE_SUBMITTED],
        },
      ],
    },
    {
      title: 'Retention',
      items: [
        {
          count: 3,
          label: 'Retention Invoice Pending',
          icon: <FaClock className="text-red-500 text-2xl" />,
          path: '/admin/retention-invoice-pending',
          requiredPermissions: [PERMISSIONS.VIEW_RETENTION_INVOICE_PENDING],
        },
        {
          count: 1,
          label: 'Retention Invoice Overdue',
          icon: <FaHourglassStart className="text-yellow-500 text-2xl" />,
          path: '/admin/retention-invoice-overdue',
          requiredPermissions: [PERMISSIONS.VIEW_RETENTION_INVOICE_OVERDUE],
        },
        {
          count: 15,
          label: 'Retention Invoice Submitted',
          icon: (
            <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl" />
          ),
          path: '/admin/retention-invoice-submitted',
          requiredPermissions: [PERMISSIONS.VIEW_RETENTION_INVOICE_SUBMITTED],
        },
      ],
    },
  ];

  // Filter sections and items based on permissions
  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        hasAnyRequiredPermission(item.requiredPermissions)
      ),
    }))
    .filter((section) => section.items.length > 0);

  const handleCardClick = (path, requiredPermissions) => {
    // SuperAdmin should have access to everything
    if (isSuperAdmin) {
      navigate(path);
      return;
    }

    // Staff and Sales Person need to have at least one of the required permissions
    if (isStaff || isSalesPerson) {
      const hasRequiredPermission = requiredPermissions.some((permission) =>
        hasPermission(permission)
      );

      if (!hasRequiredPermission) {
        navigate('/unauthorized');
        return;
      }
    }

    navigate(path);
  };

  // Check if user has permission to view quotations
  if (!isSuperAdmin && !hasPermission(PERMISSIONS.VIEW_QUOTATIONS)) {
    navigate('/unauthorized');
    return null;
  }

  return (
    <div className="w-full flex">
      <div className="main-content w-full">
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Quotation Dashboard
          </h1>
        </div>

        {filteredSections.map((section, index) => (
          <div key={index} className="px-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {section.title}
            </h2>
            <div className="cards-sec-inner w-full flex flex-wrap gap-4">
              {section.items.map((item, idx) => (
                <div
                  key={idx}
                  className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                           group relative overflow-hidden transition-all duration-300"
                  onClick={() =>
                    handleCardClick(item.path, item.requiredPermissions)
                  }
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[2.2rem] font-bold text-gray-800">
                      {item.count}
                    </p>
                  </div>
                  <div className="title h-[50px] flex items-center">
                    <h2 className="text-gray-500 text-base font-medium">
                      {item.label}
                    </h2>
                  </div>
                  <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotationDashboard;
