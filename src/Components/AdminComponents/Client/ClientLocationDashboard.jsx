import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';
import TokenService from '../../../Config/tokenService';
import AddClientModal from './AddClientModal';
import AddLocationModal from './AddLocationModal';
import { MdAddCircle } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';

const ClientLocationDashboard = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const { loading, error, hasPermission } = usePermissions();
  const userRole = TokenService.getUserRole();
  const isSuperAdmin = userRole === 'SuperAdmin';
  const isAdmin = userRole === 'Admin';

  // Define client/location related permissions
  const clientLocationPermissions = [
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.LIST_CLIENTS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.DELETE_CLIENT,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.LIST_LOCATIONS,
    PERMISSIONS.CREATE_LOCATION,
    PERMISSIONS.EDIT_LOCATION,
    PERMISSIONS.DELETE_LOCATION,
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.MANAGE_LOCATIONS,
  ];

  // Helper function to check if user has any of the required permissions
  const hasAnyRequiredPermission = (permissions) => {
    // SuperAdmin and Admin should have access to everything
    if (isSuperAdmin || isAdmin) return true;

    // Check if user has any of the specified permissions
    return permissions.some((permission) => hasPermission(permission));
  };

  // Check if user has any client/location-related permission
  const hasAnyClientLocationPermission = clientLocationPermissions.some(
    (permission) => hasPermission(permission)
  );

  const handleAddClient = (clientData) => {
    setClients((prevClients) => [...prevClients, clientData]);
    setIsClientModalOpen(false);
  };

  const handleAddLocation = (locationData) => {
    setLocations((prevLocations) => [...prevLocations, locationData]);
    setIsLocationModalOpen(false);
  };

  // Filter cards based on permissions
  const clientCards = [
    {
      title: 'Add Client',
      count: '+',
      icon: <MdAddCircle className="text-blue-500 text-2xl" />,
      onClick: () => setIsClientModalOpen(true),
      requiredPermissions: [PERMISSIONS.CREATE_CLIENT],
    },
    {
      title: 'View Clients',
      count: clients.length,
      icon: <AiOutlineEye className="text-green-500 text-2xl" />,
      onClick: () => navigate('/admin/clients'),
      requiredPermissions: [PERMISSIONS.VIEW_CLIENTS, PERMISSIONS.LIST_CLIENTS],
    },
  ];

  const locationCards = [
    {
      title: 'Add Location',
      count: '+',
      icon: <MdAddCircle className="text-purple-500 text-2xl" />,
      onClick: () => setIsLocationModalOpen(true),
      requiredPermissions: [PERMISSIONS.CREATE_LOCATION],
    },
    {
      title: 'View Locations',
      count: locations.length,
      icon: <AiOutlineEye className="text-indigo-500 text-2xl" />,
      onClick: () => navigate('/admin/locations'),
      requiredPermissions: [PERMISSIONS.VIEW_LOCATIONS, PERMISSIONS.LIST_LOCATIONS],
    },
  ];

  // Filter cards based on permissions
  const visibleClientCards = clientCards.filter((card) =>
    hasAnyRequiredPermission(card.requiredPermissions)
  );

  const visibleLocationCards = locationCards.filter((card) =>
    hasAnyRequiredPermission(card.requiredPermissions)
  );

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

  // Redirect if no permissions at all
  if (!isSuperAdmin && !isAdmin && !hasAnyClientLocationPermission) {
    navigate('/unauthorized');
    return null;
  }

  return (
    <div className="w-full flex">
      <div className="main-content w-full">
        <div className="title-sec w-full h-[12vh] flex items-center justify-center px-8">
          <h1 className="text-[1.8rem] font-semibold text-gray-800">
            Client/Location Dashboard
          </h1>
        </div>

        {/* Client Section */}
        {visibleClientCards.length > 0 && (
          <div className="px-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Client Management
            </h2>
            <div className="cards-sec-inner w-full flex flex-wrap gap-4">
              {visibleClientCards.map((card, idx) => (
                <div
                  key={idx}
                  className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                           group relative overflow-hidden transition-all duration-300"
                  onClick={card.onClick}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6">
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
              Location Management
            </h2>
            <div className="cards-sec-inner w-full flex flex-wrap gap-4">
              {visibleLocationCards.map((card, idx) => (
                <div
                  key={idx}
                  className="card bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 w-[240px] h-[210px] cursor-pointer
                           group relative overflow-hidden transition-all duration-300"
                  onClick={card.onClick}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6">
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

        {/* Add Tooltip component */}
        <Tooltip
          id="permission-tooltip"
          place="top"
          className="!bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
        />
      </div>
    </div>
  );
};

export default ClientLocationDashboard;
