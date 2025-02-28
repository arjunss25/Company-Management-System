import React from 'react';
import { AiOutlineFileText } from 'react-icons/ai';
import { FaTools, FaFileContract } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Quotation',
      count: '78',
      icon: <AiOutlineFileText size={30} />,
      iconColor: 'text-blue-500',
      path: '/quotation-dashboard',
    },
    {
      title: 'Rate Contract Work',
      count: '0',
      icon: <FaFileContract size={30} />,
      iconColor: 'text-green-500',
      path: '/contract-dashboard',
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex">

      <div className="main-content w-full md:w-[calc(100%-300px)] h-full overflow-y-scroll">
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Analytics Overview
          </h1>
        </div>

        <div className="cards-sec w-full p-8">
          <div className="cards-sec-inner w-full flex flex-wrap gap-4 justify-center">
            {cards.map((card, index) => (
              <div
                key={index}
                className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                onClick={() => handleCardClick(card.path)}
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

                <div
                  className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-10 
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
