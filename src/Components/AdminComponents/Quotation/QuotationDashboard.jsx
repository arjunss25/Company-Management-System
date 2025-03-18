import React from 'react';
import { useNavigate } from 'react-router-dom';
import usePermissions from '../../../Hooks/userPermission';
import { PERMISSIONS } from '../../../Hooks/userPermission';
import { MdAddCircle, MdClose,MdOutlinePendingActions } from 'react-icons/md';
import { FaEye, FaClock, FaHourglassStart } from 'react-icons/fa';
import { VscLayersActive } from 'react-icons/vsc';
import { RiProgress6Line, RiFolderReceivedFill } from 'react-icons/ri';
import { PiCircleNotchFill } from 'react-icons/pi';
import { LuFileClock } from "react-icons/lu";
import { AiFillFileAdd } from 'react-icons/ai';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { GrDocumentLocked } from "react-icons/gr";
import { GiCheckMark } from 'react-icons/gi';


const QuotationDashboard = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // Check if user has basic quotation viewing permission
  if (!hasPermission(PERMISSIONS.VIEW_QUOTATIONS)) {
    navigate('/unauthorized');
    return null;
  }

  const sections = [
    {
      title: 'Quotation',
      items: [
        { 
          count: '+', 
          label: 'Add Quotations', 
          icon: <AiFillFileAdd className="text-green-500 text-2xl" />, 
          path: '/admin/add-quotations',
          requiredPermission: PERMISSIONS.CREATE_QUOTATION
        },
        { count: 44, label: 'View Quotations', icon: <FaEye className="text-blue-500 text-2xl" />, path: '/admin/view-quotations' },
        { count: 6, label: 'Cancelled Quotations', icon: <MdClose className="text-red-500 text-2xl" />, path: '/admin/cancelled-quotations' },
        { count: 24, label: 'Pending For Approval', icon: <FaClock className="text-orange-500 text-2xl" />, path: '/admin/pending-approval' },
        { count: 0, label: 'Approval Pending Work Started', icon: <MdOutlinePendingActions className="text-orange-500 text-2xl" />, path: '/admin/pending-workstarted' },
        { count: 17, label: 'Active Quotations', icon: <VscLayersActive className="text-blue-500 text-2xl" />, path: '/admin/active-quotations' },
        { count: 3, label: 'Closed Projects', icon: <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl" />, path: '/admin/closed-projects' },
      ],
    },
    {
      title: 'Work Status',
      items: [
        { count: 10, label: 'Not Started', icon: <PiCircleNotchFill className="text-gray-500 text-2xl" />, path: '/not-started' },
        { count: 14, label: 'In Progress', icon: <RiProgress6Line className="text-yellow-500 text-2xl" />, path: '/in-progress' },
        { count: 8, label: 'No Access', icon: <GrDocumentLocked className="text-red-500 text-2xl" />, path: '/no-access' },
        { count: 8, label: 'On Hold', icon: <LuFileClock className="text-green-500 text-2xl" />, path: '/on-hold' },
        { count: 17, label: 'Handover Overdue', icon: <FaHourglassStart className="text-red-500 text-2xl" />, path: '/handover-overdue' },
        { count: 8, label: 'Completed', icon: <GiCheckMark className="text-green-500 text-2xl" />, path: '/completed' },
      ],
    },
    {
      title: 'Documentation Status',
      items: [
        { count: 3, label: 'LPO Pending', icon: <FaClock className="text-yellow-500  text-2xl" />, path: '/lpo-pending' },
        { count: 9, label: 'WCR Pending', icon: <FaClock className="text-blue-500 text-2xl" />, path: '/wcr-pending' },
        { count: 4, label: 'GRN Pending', icon: <FaClock className="text-orange-500 text-2xl" />, path: '/grn-pending' },
        { count: 3, label: 'Invoice Pending', icon: <MdOutlinePendingActions className="text-blue-500 text-2xl" />, path: '/invoice-pending' },
        { count: 18, label: 'LPO Received', icon: <RiFolderReceivedFill className="text-green-500 text-2xl" />, path: '/lpo-received' },
        { count: 16, label: 'GRN Received', icon: <RiFolderReceivedFill className="text-purple-500 text-2xl" />, path: '/grn-received' },
        { count: 16, label: 'Invoice Submitted', icon: <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl" />, path: '/invoice-submited' },
      ],
    },
    {
      title: 'Retention',
      items: [
        { count: 3, label: 'Retention Invoice Pending', icon: <FaClock className="text-red-500 text-2xl" />, path: '/retention-invoice-pending' },
        { count: 1, label: 'Retention Invoice Overdue', icon: <FaHourglassStart className="text-yellow-500 text-2xl" />, path: '/retention-invoice-overdue' },
        { count: 15, label: 'Retention Invoice Submitted', icon: <IoMdCheckmarkCircleOutline className="text-green-500 text-2xl" />, path: '/retention-invoice-submitted' },
      ],
    },
  ];

  const handleCardClick = (path, requiredPermission) => {
    if (requiredPermission && !hasPermission(requiredPermission)) {
      navigate('/unauthorized');
      return;
    }
    navigate(path);
  };

  return (
    <div className="w-full flex">

      <div className="main-content w-full">
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Quotation Dashboard
          </h1>
        </div>

        {sections.map((section, index) => (
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
                  onClick={() => handleCardClick(item.path, item.requiredPermission)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                  >
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