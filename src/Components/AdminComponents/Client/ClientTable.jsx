import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EditModal from './ClientEditModal';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';
import { AdminApi } from '../../../Services/AdminApi';

// Notification Modal Component
const NotificationModal = ({ isOpen, type, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          {type === 'success' ? (
            <svg
              className="w-16 h-16 text-green-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-16 h-16 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          <h3
            className={`text-xl font-semibold mb-2 ${
              type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {type === 'success' ? 'Success!' : 'Error!'}
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              type === 'success'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            } transition-colors duration-200`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg
              className="w-full h-full text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Delete Client
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{clientName}</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium disabled:opacity-50 flex items-center"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ClientTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for clients
  const [clientList, setClientList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    clientId: null,
    clientName: '',
    isDeleting: false,
  });
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
  });

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await AdminApi.getClientList();
      if (response.status === 'Success') {
        setClientList(response.data);
      } else {
        setError('Failed to fetch clients');
      }
    } catch (error) {
      setError('Error fetching clients: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (client) => {
    if (hasPermission(PERMISSIONS.EDIT_CLIENT)) {
      setSelectedClient(client);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (client) => {
    if (hasPermission(PERMISSIONS.DELETE_CLIENT)) {
      setDeleteModal({
        isOpen: true,
        clientId: client.id,
        clientName: client.clientName,
        isDeleting: false,
      });
    }
  };

  const handleDelete = async () => {
    if (!hasPermission(PERMISSIONS.DELETE_CLIENT)) return;

    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      const response = await AdminApi.deleteClient(deleteModal.clientId);

      if (response.status === 'Success') {
        const updatedClients = clientList.filter(
          (client) => client.id !== deleteModal.clientId
        );
        setClientList(updatedClients);
        setDeleteModal({
          isOpen: false,
          clientId: null,
          clientName: '',
          isDeleting: false,
        });
        // Show success notification
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Client deleted successfully!',
        });
      } else {
        throw new Error(response.message || 'Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      // Show error notification
      setNotification({
        isOpen: true,
        type: 'error',
        message: `Failed to delete client: ${error.message}`,
      });
    } finally {
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleSave = async (updatedClient) => {
    if (hasPermission(PERMISSIONS.EDIT_CLIENT)) {
      try {
        const formattedClient = {
          company_id: updatedClient.company_id || selectedClient.company_id,
          clientName: updatedClient.clientName,
          address: updatedClient.address,
          terms: updatedClient.terms,
          payment: updatedClient.payment,
          attentions: (
            updatedClient.attentions || selectedClient.attentions
          ).map((att) => ({
            id: att.id,
            name: att.name,
          })),
        };

        const response = await AdminApi.updateClient(
          selectedClient.id,
          formattedClient
        );

        if (response.status === 'Success') {
          const updatedClients = clientList.map((client) =>
            client.id === selectedClient.id ? response.data : client
          );
          setClientList(updatedClients);
          setIsModalOpen(false);
        } else {
          throw new Error(response.message || 'Failed to update client');
        }
      } catch (error) {
        console.error('Error updating client:', error);
        // You might want to show an error notification here
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1 md:w-[calc(100%-300px)]">
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
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600 w-16">
                      Sl.No
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Client Name
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Address
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Terms
                    </th>
                    {/* <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Payment
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">
                      Attention
                    </th> */}
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600 w-32">
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
                      key={client.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700 font-medium">
                          {client.clientName}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700">{client.address}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700">{client.terms}</span>
                      </td>
                      {/* <td className="px-6 py-5">
                        <span className="text-gray-700">{client.payment}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-700">
                          {client.attentions.map((att) => att.name).join(', ')}
                        </span>
                      </td> */}
                      <td className="px-6 py-5 space-x-2 flex gap-2">
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
                            onClick={() => handleDeleteClick(client)}
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

            {/* Pagination - can be implemented when API supports it */}
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

      {/* Edit Modal */}
      {isModalOpen && hasPermission(PERMISSIONS.EDIT_CLIENT) && (
        <EditModal
          client={selectedClient}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleDelete}
        clientName={deleteModal.clientName}
        isDeleting={deleteModal.isDeleting}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        message={notification.message}
        onClose={handleCloseNotification}
      />
    </div>
  );
};

export default ClientTable;
