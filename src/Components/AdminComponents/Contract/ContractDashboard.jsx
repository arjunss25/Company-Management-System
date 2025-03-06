import React, { useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { BsCheckCircle } from 'react-icons/bs';
import { RiFileList3Line } from 'react-icons/ri';
import { MdOutlinePayments } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AddRateCardModal from './AddRateCardModal';
import AddRateCardItemModal from './AddRateCardItemModal';

const ContractDashboard = () => {
  const navigate = useNavigate();
  const [isRateCardModalOpen, setIsRateCardModalOpen] = useState(false);
  const [isRateCardItemModalOpen, setIsRateCardItemModalOpen] = useState(false);

  const cards = [
    {
      title: 'Add Contract',
      count: '+',
      icon: <MdAddCircle size={30} />,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Active',
      count: '0',
      icon: <BsCheckCircle size={30} />,
      iconColor: 'text-green-500',
    },
    {
      title: 'Expired',
      count: '23',
      icon: <AiOutlineClockCircle size={30} />,
      iconColor: 'text-red-500',
    },
    {
      title: 'Expiring Soon',
      count: '0',
      icon: <AiOutlineClockCircle size={30} />,
      iconColor: 'text-orange-500',
    },
  ];

  const rateCards = [
    {
      title: 'Add Ratecard',
      count: '+',
      icon: <MdOutlinePayments size={30} />,
      iconColor: 'text-purple-500',
    },
    {
      title: 'View Ratecard',
      count: '15',
      icon: <RiFileList3Line size={30} />,
      iconColor: 'text-indigo-500',
    },
  ];

  const rateCardItems = [
    {
      title: 'Add Rate card Item',
      count: '+',
      icon: <MdOutlinePayments size={30} />,
      iconColor: 'text-teal-500',
    },
    {
      title: 'View Rate card Item',
      count: '15',
      icon: <RiFileList3Line size={30} />,
      iconColor: 'text-cyan-500',
    },
  ];

  const handleCardClick = (title) => {
    switch (title) {
      case 'Add Contract':
        navigate('/admin/add-contract');
        break;
      case 'Active':
        navigate('/active-contracts');
        break;
      case 'Expired':
        navigate('/expired-contracts');
        break;
      case 'Expiring Soon':
        navigate('/expiring-soon-contracts');
        break;
      case 'View Ratecard':
        navigate('/admin/view-rate-card');
        break;
      case 'Add Ratecard':
        setIsRateCardModalOpen(true);
        break;
      case 'Add Rate card Item':
        setIsRateCardItemModalOpen(true);
        break;
      case 'View Rate card Item':
        navigate('/admin/view-rate-card-items');
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full flex">

      <div className="main-content w-full">
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Contract Dashboard
          </h1>
        </div>

        {/* Contract Section */}
        <div className="px-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contract
          </h2>
          <div className="cards-sec-inner w-full flex flex-wrap gap-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                onClick={() => handleCardClick(card.title)}
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

        {/* Rate Card Section */}
        <div className="px-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Rate Card
          </h2>
          <div className="cards-sec-inner w-full flex flex-wrap gap-4">
            {rateCards.map((card, index) => (
              <div
                key={index}
                className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                onClick={() => handleCardClick(card.title)}
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

        {/* Rate Card Items Section */}
        <div className="px-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Rate Card Items
          </h2>
          <div className="cards-sec-inner w-full flex flex-wrap gap-4">
            {rateCardItems.map((card, index) => (
              <div
                key={index}
                className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                         group relative overflow-hidden transition-all duration-300"
                onClick={() => handleCardClick(card.title)}
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
      </div>

      <AddRateCardModal
        isOpen={isRateCardModalOpen}
        onClose={() => setIsRateCardModalOpen(false)}
      />
      <AddRateCardItemModal
        isOpen={isRateCardItemModalOpen}
        onClose={() => setIsRateCardItemModalOpen(false)}
      />
    </div>
  );
};

export default ContractDashboard;