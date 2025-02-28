import React from 'react';
import { AiOutlineFileText } from 'react-icons/ai';
import { FaTools, FaFileContract } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Client/Location',
      count: '0',
      icon: <AiOutlineFileText size={30} />,
      iconColor: 'text-blue-500',
      path: '/admin/client-location',
    },
    {
      title: 'Rate Contract Work',
      count: '0',
      icon: <FaFileContract size={30} />,
      iconColor: 'text-green-500',
      path: '/admin/contract-dashboard',
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="title-sec w-full py-8 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Analytics Overview
          </h1>
        </div>

        <div className="cards-sec w-full p-8">
          <div className="cards-sec-inner w-full flex flex-wrap gap-6 justify-center">
            {cards.map((card, index) => (
              <div
                key={index}
                className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[280px] h-[220px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                onClick={() => handleCardClick(card.path)}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${card.iconColor} bg-opacity-10`}
                >
                  {card.icon}
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-[2.5rem] font-bold text-gray-800">
                    {card.count}
                  </p>
                </div>

                <div className="title h-[50px] flex items-center">
                  <h2 className="text-gray-600 text-lg font-medium">
                    {card.title}
                  </h2>
                </div>

                <div
                  className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-20 
                              transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
