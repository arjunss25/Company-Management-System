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

const MaterialDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialsCount, setMaterialsCount] = useState('...');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    },
    {
      title: 'View Material',
      count: materialsCount,
      icon: <FaEye size={30} />,
      iconColor: 'text-green-500',
    },
    {
      title: 'Material Request',
      count: '22',
      icon: <IoDocumentText size={30} />,
      iconColor: 'text-yellow-500',
    },
    {
      title: 'Pending Material Request',
      count: '0',
      icon: <MdPendingActions size={30} />,
      iconColor: 'text-orange-500',
    },
    {
      title: 'Material Consumption',
      count: '0',
      icon: <TbReportAnalytics size={30} />,
      iconColor: 'text-purple-500',
    },
    {
      title: 'Store',
      count: '4',
      icon: <FaStore size={30} />,
      iconColor: 'text-pink-500',
    },
  ];

  const handleCardClick = (title) => {
    if (title === 'Add New Material') {
      setIsModalOpen(true);
    } else if (title === 'View Material') {
      navigate('/admin/view-material');
    } else if (title === 'Material Request') {
      navigate('/admin/material-requests');
    } else if (title === 'Pending Material Request') {
      navigate('/admin/pending-material-requests');
    } else if (title === 'Material Consumption') {
      navigate('/admin/material-consumption');
    } else if (title === 'Store') {
      navigate('/admin/store-data');
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* main-content */}
      <div className="main-content w-full h-full overflow-y-scroll">
        {/* title */}
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8 ">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Material Dashboard
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-8 mb-4">
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* cards-section */}
        <div className="cards-sec w-full p-8">
          <div className="cards-sec-inner w-full flex flex-wrap gap-4 justify-center">
            {cards.map((card, index) => (
              <div
                key={index}
                className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                onClick={() => handleCardClick(card.title)}
              >
                {/* Icon container */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${card.iconColor}`}
                >
                  {card.icon}
                </div>

                {/* Content */}
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

                {/* Hover background effect */}
                <div
                  className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-10 
                              transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        <AddMaterialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchMaterialsCount} // Refresh count after adding new material
        />
      </div>
    </div>
  );
};

export default MaterialDashboard;
