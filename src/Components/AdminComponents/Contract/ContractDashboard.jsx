import React, { useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { BsCheckCircle } from 'react-icons/bs';
import { RiFileList3Line } from 'react-icons/ri';
import { MdOutlinePayments } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AddRateCardModal from './AddRateCardModal';
import AddRateCardItemModal from './AddRateCardItemModal';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';
import { Tooltip } from 'react-tooltip';

const ContractDashboard = () => {
  const navigate = useNavigate();
  const [isRateCardModalOpen, setIsRateCardModalOpen] = useState(false);
  const [isRateCardItemModalOpen, setIsRateCardItemModalOpen] = useState(false);
  const { loading, error, hasPermission } = usePermissions();

  // Update hasMinimumPermission to use some() instead of every()
  const hasMinimumPermission = () => {
    const minimumPermissions = [
      PERMISSIONS.VIEW_CONTRACTS,
      PERMISSIONS.CREATE_CONTRACT,
      PERMISSIONS.VIEW_RATE_CARDS,
      PERMISSIONS.CREATE_RATE_CARD,
      PERMISSIONS.VIEW_RATE_CARD_ITEMS,
      PERMISSIONS.CREATE_RATE_CARD_ITEMS,
    ];

    // Allow access if user has any of the required permissions
    return minimumPermissions.some((permission) => hasPermission(permission));
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error loading permissions: {error}</div>
      </div>
    );
  }

  if (!hasMinimumPermission()) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          You don't have permission to access this section.
        </div>
      </div>
    );
  }

  // Update the cards arrays to include all possible actions
  const contractCards = [
    {
      title: 'Add Contract',
      count: '+',
      icon: <MdAddCircle size={30} />,
      iconColor: 'text-blue-500',
      onClick: () => navigate('/admin/add-contract'),
      requiredPermission: PERMISSIONS.CREATE_CONTRACT,
    },
    {
      title: 'Active',
      count: '0',
      icon: <BsCheckCircle size={30} />,
      iconColor: 'text-green-500',
      onClick: () => navigate('/admin/active-contracts'),
      requiredPermission: PERMISSIONS.VIEW_CONTRACTS,
    },
    {
      title: 'Expired',
      count: '23',
      icon: <AiOutlineClockCircle size={30} />,
      iconColor: 'text-red-500',
      onClick: () => navigate('/admin/expired-contracts'),
      requiredPermission: PERMISSIONS.VIEW_CONTRACTS,
    },
    {
      title: 'Expiring Soon',
      count: '0',
      icon: <AiOutlineClockCircle size={30} />,
      iconColor: 'text-orange-500',
      onClick: () => navigate('/admin/expiring-contracts'),
      requiredPermission: PERMISSIONS.VIEW_CONTRACTS,
    },
  ];

  const rateCards = [
    {
      title: 'Add Ratecard',
      count: '+',
      icon: <MdOutlinePayments size={30} />,
      iconColor: 'text-purple-500',
      onClick: () => setIsRateCardModalOpen(true),
      requiredPermission: PERMISSIONS.CREATE_RATE_CARD,
    },
    {
      title: 'View Ratecard',
      count: '15',
      icon: <RiFileList3Line size={30} />,
      iconColor: 'text-indigo-500',
      onClick: () => navigate('/admin/view-rate-card'),
      requiredPermission: PERMISSIONS.VIEW_RATE_CARDS,
    },
  ];

  const rateCardItems = [
    {
      title: 'Add Rate card Item',
      count: '+',
      icon: <MdOutlinePayments size={30} />,
      iconColor: 'text-teal-500',
      onClick: () => setIsRateCardItemModalOpen(true),
      requiredPermission: PERMISSIONS.CREATE_RATE_CARD_ITEMS,
    },
    {
      title: 'View Rate card Item',
      count: '15',
      icon: <RiFileList3Line size={30} />,
      iconColor: 'text-cyan-500',
      onClick: () => navigate('/admin/view-rate-card-items'),
      requiredPermission: PERMISSIONS.VIEW_RATE_CARD_ITEMS,
    },
  ];

  // Filter cards based on permissions
  const visibleContractCards = contractCards.filter((card) =>
    hasPermission(card.requiredPermission)
  );

  const visibleRateCards = rateCards.filter((card) =>
    hasPermission(card.requiredPermission)
  );

  const visibleRateCardItems = rateCardItems.filter((card) =>
    hasPermission(card.requiredPermission)
  );

  return (
    <div className="w-full flex">
      <div className="main-content w-full">
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Contract Dashboard
          </h1>
        </div>

        {/* Contract Section */}
        {visibleContractCards.length > 0 && (
          <div className="px-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Contract
            </h2>
            <div className="cards-sec-inner w-full flex flex-wrap gap-4">
              {visibleContractCards.map((card, index) => (
                <div
                  key={index}
                  className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                  onClick={card.onClick}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${card.iconColor}`}
                  >
                    {card.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[2.2rem] font-bold text-gray-800">
                      {card.count}
                    </p>
                  </div>
                  <div className="title h-[50px] flex items-center">
                    <h2 className="text-gray-500 text-base font-medium">
                      {card.title}
                    </h2>
                  </div>
                  <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rate Card Section */}
        {visibleRateCards.length > 0 && (
          <div className="px-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Rate Card
            </h2>
            <div className="cards-sec-inner w-full flex flex-wrap gap-4">
              {visibleRateCards.map((card, index) => (
                <div
                  key={index}
                  className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                  onClick={card.onClick}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${card.iconColor}`}
                  >
                    {card.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[2.2rem] font-bold text-gray-800">
                      {card.count}
                    </p>
                  </div>
                  <div className="title h-[50px] flex items-center">
                    <h2 className="text-gray-500 text-base font-medium">
                      {card.title}
                    </h2>
                  </div>
                  <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rate Card Items Section */}
        {visibleRateCardItems.length > 0 && (
          <div className="px-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Rate Card Items
            </h2>
            <div className="cards-sec-inner w-full flex flex-wrap gap-4">
              {visibleRateCardItems.map((card, index) => (
                <div
                  key={index}
                  className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                  onClick={card.onClick}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${card.iconColor}`}
                  >
                    {card.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[2.2rem] font-bold text-gray-800">
                      {card.count}
                    </p>
                  </div>
                  <div className="title h-[50px] flex items-center">
                    <h2 className="text-gray-500 text-base font-medium">
                      {card.title}
                    </h2>
                  </div>
                  <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isRateCardModalOpen && hasPermission(PERMISSIONS.CREATE_RATE_CARD) && (
        <AddRateCardModal
          isOpen={isRateCardModalOpen}
          onClose={() => setIsRateCardModalOpen(false)}
        />
      )}

      {isRateCardItemModalOpen &&
        hasPermission(PERMISSIONS.CREATE_RATE_CARD_ITEMS) && (
          <AddRateCardItemModal
            isOpen={isRateCardItemModalOpen}
            onClose={() => setIsRateCardItemModalOpen(false)}
          />
        )}
    </div>
  );
};

export default ContractDashboard;
