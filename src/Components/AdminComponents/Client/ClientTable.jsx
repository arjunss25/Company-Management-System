import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EditModal from './ClientEditModal';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';

const ClientTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const locationClients = location.state?.clients || [];

  // If there are no clients from location, use the prop clients
  const displayClients = locationClients.length > 0 ? locationClients : [];

  // Add dummy data
  const dummyClients = [
    {
      clientName: 'Tech Solutions Inc',
      address: '123 Innovation Drive, Silicon Valley',
      termsAndConditions: 'Net 30 days',
      attention: ['John Doe', 'Jane Smith'],
    },
    {
      clientName: 'Global Enterprises Ltd',
      address: '456 Business Park, New York',
      termsAndConditions: 'Net 45 days',
      attention: ['Mike Johnson'],
    },
    {
      clientName: 'Digital Dynamics',
      address: '789 Digital Avenue, Austin',
      termsAndConditions: 'Net 60 days',
      attention: ['Sarah Wilson', 'Tom Brown'],
    },
    {
      clientName: 'Innovative Systems',
      address: '321 Tech Boulevard, Seattle',
      termsAndConditions: 'Net 30 days',
      attention: ['Alex Turner'],
    },
  ];

  // Use dummy data directly instead of checking location or props
  const [clientList, setClientList] = useState(dummyClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleEdit = (client) => {
    if (hasPermission(PERMISSIONS.EDIT_CLIENT)) {
      setSelectedClient(client);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (index) => {
    if (hasPermission(PERMISSIONS.DELETE_CLIENT)) {
      const updatedClients = clientList.filter((_, i) => i !== index);
      setClientList(updatedClients);
    }
  };

  const handleSave = (updatedClient) => {
    if (hasPermission(PERMISSIONS.EDIT_CLIENT)) {
      const updatedClients = clientList.map((client) =>
        client.clientName === selectedClient.clientName ? updatedClient : client
      );
      setClientList(updatedClients);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 md:w-[calc(100%-300px)] h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8"
        >
          {/* Header section */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Clients
              </h1>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 w-24">
                      Sl.No
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Client Name
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Address
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Terms & Condition
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientList.map((client, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={index}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 w-24">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium">
                          {client.clientName}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700">{client.address}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700">
                          {client.termsAndConditions}
                        </span>
                      </td>
                      <td className="px-8 py-5 space-x-2 flex gap-2">
                        {hasPermission(PERMISSIONS.EDIT_CLIENT) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(client)}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                          >
                            Edit
                          </motion.button>
                        )}
                        {hasPermission(PERMISSIONS.DELETE_CLIENT) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                          >
                            Delete
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {isModalOpen && hasPermission(PERMISSIONS.EDIT_CLIENT) && (
        <EditModal
          client={selectedClient}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ClientTable;
