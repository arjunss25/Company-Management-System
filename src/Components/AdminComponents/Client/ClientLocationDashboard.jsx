import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';
import TokenService from '../../../Config/tokenService';

const ClientLocationDashboard = () => {
  const navigate = useNavigate();
  const { loading, hasPermission, userPermissions } = usePermissions();

  // Debug logging
  useEffect(() => {
    const userRole = TokenService.getUserRole();
    console.log('ClientLocationDashboard - Current User Role:', userRole);
    console.log(
      'ClientLocationDashboard - All User Permissions:',
      userPermissions
    );
    console.log('ClientLocationDashboard - Loading State:', loading);
  }, [loading, userPermissions]);

  const clientCards = [
    {
      title: 'Add Client',
      description: 'Create a new client record',
      action: () => navigate('/admin/clients/add'),
      permission: PERMISSIONS.CREATE_CLIENT,
    },
    {
      title: 'View Clients',
      description: 'View and manage existing clients',
      action: () => navigate('/admin/clients'),
      permission: PERMISSIONS.VIEW_CLIENTS,
    },
  ];

  const locationCards = [
    {
      title: 'Add Location',
      description: 'Create a new location',
      action: () => navigate('/admin/locations/add'),
      permission: PERMISSIONS.CREATE_LOCATION,
    },
    {
      title: 'View Locations',
      description: 'View and manage existing locations',
      action: () => navigate('/admin/locations'),
      permission: PERMISSIONS.VIEW_LOCATIONS,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse">Loading permissions...</div>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Log which cards will be displayed
  const visibleClientCards = clientCards.filter((card) => {
    const hasPermissionResult = hasPermission(card.permission);
    console.log(`Checking client card permission for ${card.title}:`, {
      permission: card.permission,
      hasPermission: hasPermissionResult,
    });
    return hasPermissionResult;
  });

  const visibleLocationCards = locationCards.filter((card) => {
    const hasPermissionResult = hasPermission(card.permission);
    console.log(`Checking location card permission for ${card.title}:`, {
      permission: card.permission,
      hasPermission: hasPermissionResult,
    });
    return hasPermissionResult;
  });

  console.log('Visible client cards:', visibleClientCards.length);
  console.log('Visible location cards:', visibleLocationCards.length);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Client Management Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Client Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleClientCards.map((card, index) => (
              <div
                key={index}
                onClick={card.action}
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Management Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Location Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleLocationCards.map((card, index) => (
              <div
                key={index}
                onClick={card.action}
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLocationDashboard;
