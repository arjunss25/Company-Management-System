import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';
import AddClientModal from './AddClientModal';
import AddLocationModal from './AddLocationModal';
import { MdAddCircle } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';

const ClientLocationDashboard = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const { loading, error, hasPermission } = usePermissions();

  const handleAddClient = (clientData) => {
    setClients((prevClients) => [...prevClients, clientData]);
    setIsClientModalOpen(false);
  };

  const handleAddLocation = (locationData) => {
    setLocations((prevLocations) => [...prevLocations, locationData]);
    setIsLocationModalOpen(false);
  };

  const clientCards = [
    {
      title: 'Add Client',
      count: '+',
      icon: <MdAddCircle size={30} />,
      iconColor: 'text-blue-500',
      onClick: () => setIsClientModalOpen(true),
      permission: PERMISSIONS.CREATE_CLIENT,
    },
    {
      title: 'View Clients',
      count: clients.length,
      icon: <AiOutlineEye size={30} />,
      iconColor: 'text-green-500',
      onClick: () => navigate('/admin/clients', { state: { clients } }),
      permission: PERMISSIONS.VIEW_CLIENTS,
    },
  ];

  const locationCards = [
    {
      title: 'Add Location',
      count: '+',
      icon: <MdAddCircle size={30} />,
      iconColor: 'text-purple-500',
      onClick: () => setIsLocationModalOpen(true),
      permission: PERMISSIONS.CREATE_LOCATION,
    },
    {
      title: 'View Locations',
      count: locations.length,
      icon: <AiOutlineEye size={30} />,
      iconColor: 'text-indigo-500',
      onClick: () => navigate('/admin/locations', { state: { locations } }),
      permission: PERMISSIONS.VIEW_LOCATIONS,
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
        <div className="text-red-500">Error loading permissions: {error}</div>
      </div>
    );
  }

  // Filter cards based on permissions
  const visibleClientCards = clientCards.filter((card) =>
    hasPermission(card.permission)
  );
  const visibleLocationCards = locationCards.filter((card) =>
    hasPermission(card.permission)
  );

  // If user has no permissions for either clients or locations, show message
  if (visibleClientCards.length === 0 && visibleLocationCards.length === 0) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          You don't have permission to access this section.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex">
      <div className="main-content w-full  h-full">
        <div className="title-sec w-full h-[10vh] flex items-center justify-center px-8">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Client/Location Dashboard
          </h1>
        </div>

        {/* Client Section */}
        {visibleClientCards.length > 0 && (
          <div className="px-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Client
            </h2>
            <div className="cards-sec-inner w-full flex flex-wrap gap-4">
              {visibleClientCards.map((card, index) => (
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

        {/* Location Section */}
        {visibleLocationCards.length > 0 && (
          <div className="px-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Location
            </h2>
            <div className="cards-sec-inner w-full flex flex-wrap gap-4">
              {visibleLocationCards.map((card, index) => (
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

        {/* Modals */}
        {isClientModalOpen && hasPermission(PERMISSIONS.CREATE_CLIENT) && (
          <AddClientModal
            isOpen={isClientModalOpen}
            handleClose={() => setIsClientModalOpen(false)}
            handleAddClient={handleAddClient}
          />
        )}

        {isLocationModalOpen && hasPermission(PERMISSIONS.CREATE_LOCATION) && (
          <AddLocationModal
            isOpen={isLocationModalOpen}
            handleClose={() => setIsLocationModalOpen(false)}
            handleAddLocation={handleAddLocation}
          />
        )}
      </div>
    </div>
  );
};

export default ClientLocationDashboard;
