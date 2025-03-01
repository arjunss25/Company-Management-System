import React, { useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { MdPendingActions } from 'react-icons/md';
import { TbReportAnalytics } from 'react-icons/tb';
import { FaStore } from 'react-icons/fa';
import AddMaterialModal from './AddMaterialModal';
import { useNavigate } from 'react-router-dom';

const MaterialDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Add New Material',
      count: '+',
      icon: <MdAddCircle size={30} />,
      iconColor: 'text-blue-500',
    },
    {
      title: 'View Material',
      count: '11',
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
      navigate('/view-material');
    } else if (title === 'Material Request') {
      navigate('/material-requests');
    } else if (title === 'Pending Material Request') {
      navigate('/pending-material-requests');
    } else if (title === 'Material Consumption') {
      navigate('/material-consumption');
    } else if (title === 'Store') {
      navigate('/store-data');
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex">

      {/* main-content */}
      <div className="main-content w-full md:w-[calc(100%-300px)] h-full overflow-y-scroll">
        {/* title */}
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8 ">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Material Dashboard
          </h1>
        </div>

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

                <div className="title h-[50px]  flex items-center">
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
        />
      </div>
    </div>
  );
};

export default MaterialDashboard;
