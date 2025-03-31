import React, { useState, useEffect } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { MdPendingActions } from 'react-icons/md';
import { TbReportAnalytics } from 'react-icons/tb';
import { FaStore } from 'react-icons/fa';
import AddMaterialModal from './AddMaterialModal';
import { useNavigate } from 'react-router-dom';
import { AdminApi } from '../../../Services/AdminApi';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';

const MaterialDashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialsCount, setMaterialsCount] = useState('...');
  const [error, setError] = useState(null);
  const { loading, hasPermission } = usePermissions();

  // Function to check if user has any material-related permission
  const hasMinimumPermission = () => {
    const minimumPermissions = [
      PERMISSIONS.VIEW_MATERIALS,
      PERMISSIONS.CREATE_MATERIAL,
      PERMISSIONS.EDIT_MATERIAL,
      PERMISSIONS.DELETE_MATERIAL,
      PERMISSIONS.VIEW_MATERIAL_REQUESTS,
      PERMISSIONS.CREATE_MATERIAL_REQUEST,
      PERMISSIONS.MANAGE_MATERIAL_REQUESTS,
      PERMISSIONS.VIEW_MATERIAL_CONSUMPTION,
      PERMISSIONS.MANAGE_STORE,
    ];

    return minimumPermissions.some((permission) => hasPermission(permission));
  };

  useEffect(() => {
    fetchMaterialsCount();
  }, []);

  const fetchMaterialsCount = async () => {
    try {
      const response = await AdminApi.getMaterialsCount();
      if (response.status === 'Success') {
        setMaterialsCount(response.data.toString());
      } else {
        throw new Error(response.message || 'Failed to fetch materials count');
      }
    } catch (error) {
      console.error('Error fetching materials count:', error);
      setError(error.message);
      setMaterialsCount('0');
    }
  };

  const cards = [
    {
      title: 'Add New Material',
      count: '+',
      icon: <MdAddCircle size={30} />,
      iconColor: 'text-blue-500',
      onClick: () => setIsModalOpen(true),
      requiredPermission: PERMISSIONS.CREATE_MATERIAL,
    },
    {
      title: 'View Material',
      count: materialsCount,
      icon: <FaEye size={30} />,
      iconColor: 'text-green-500',
      onClick: () => navigate('/admin/view-material'),
      requiredPermission: PERMISSIONS.VIEW_MATERIALS,
    },
    {
      title: 'Material Request',
      count: '22',
      icon: <IoDocumentText size={30} />,
      iconColor: 'text-yellow-500',
      onClick: () => navigate('/admin/material-requests'),
      requiredPermission: PERMISSIONS.VIEW_MATERIAL_REQUESTS,
    },
    {
      title: 'Pending Material Request',
      count: '0',
      icon: <MdPendingActions size={30} />,
      iconColor: 'text-orange-500',
      onClick: () => navigate('/admin/pending-material-requests'),
      requiredPermission: PERMISSIONS.MANAGE_MATERIAL_REQUESTS,
    },
    {
      title: 'Material Consumption',
      count: '0',
      icon: <TbReportAnalytics size={30} />,
      iconColor: 'text-purple-500',
      onClick: () => navigate('/admin/material-consumption'),
      requiredPermission: PERMISSIONS.VIEW_MATERIAL_CONSUMPTION,
    },
    {
      title: 'Store',
      count: '4',
      icon: <FaStore size={30} />,
      iconColor: 'text-pink-500',
      onClick: () => navigate('/admin/store-data'),
      requiredPermission: PERMISSIONS.MANAGE_STORE,
    },
  ];

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
        <div className="text-red-500">Error loading data: {error}</div>
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

  // Filter cards based on permissions
  const visibleCards = cards.filter((card) =>
    hasPermission(card.requiredPermission)
  );

  return (
    <div className="w-full h-screen flex">
      <div className="main-content w-full h-full overflow-y-scroll">
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Material Dashboard
          </h1>
        </div>

        {/* cards-section */}
        <div className="cards-sec w-full p-8">
          <div className="cards-sec-inner w-full flex flex-wrap gap-4 justify-center">
            {visibleCards.map((card, index) => (
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

        {isModalOpen && hasPermission(PERMISSIONS.CREATE_MATERIAL) && (
          <AddMaterialModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchMaterialsCount}
          />
        )}
      </div>
    </div>
  );
};

export default MaterialDashboard;
