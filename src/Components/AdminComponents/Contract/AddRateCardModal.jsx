import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminApi } from '../../../Services/AdminApi';
import { IoChevronDown } from 'react-icons/io5';

const AddRateCardModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    rateCardName: '',
    client: '',
    location: '',
    opexCapex: 'Applicable',
  });

  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchClient, setSearchClient] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '',
    message: '',
  });

  useEffect(() => {
    const fetchClientsAndLocations = async () => {
      try {
        const clientResponse = await AdminApi.getClientList();
        const locationResponse = await AdminApi.listLocations();

        if (Array.isArray(clientResponse.data)) {
          setClients(clientResponse.data);
        } else {
          console.error('Client list is not an array:', clientResponse);
          setClients([]);
        }

        if (Array.isArray(locationResponse.data)) {
          setLocations(locationResponse.data);
        } else {
          console.error('Location list is not an array:', locationResponse);
          setLocations([]);
        }
      } catch (error) {
        console.error('Error fetching clients or locations:', error);
        setClients([]);
        setLocations([]);
      }
    };

    fetchClientsAndLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredClients = clients.filter((client) =>
    client.clientName.toLowerCase().includes(searchClient.toLowerCase())
  );

  const filteredLocations = locations.filter((location) =>
    location.location_name.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const toggleClientDropdown = () => {
    setIsClientDropdownOpen(!isClientDropdownOpen);
    if (isLocationDropdownOpen) setIsLocationDropdownOpen(false);
  };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    if (isClientDropdownOpen) setIsClientDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      card_name: formData.rateCardName,
      client: formData.client,
      location: formData.location,
      opex_capex: formData.opexCapex,
    };

    try {
      const response = await AdminApi.addRateCard(payload);
      if (response.status === 'Success') {
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Rate card added successfully',
        });
        setFormData({
          rateCardName: '',
          client: '',
          location: '',
          opexCapex: 'Applicable',
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to add rate card');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to add rate card';
      setNotification({
        isOpen: true,
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      rateCardName: '',
      client: '',
      location: '',
      opexCapex: 'Applicable',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-50"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Rate Card</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Rate Card Name:
              </label>
              <input
                type="text"
                name="rateCardName"
                value={formData.rateCardName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Rate Card Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Opex/Capex:
              </label>
              <select
                name="opexCapex"
                value={formData.opexCapex}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="Applicable">Applicable</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Client:
              </label>
              <div className="relative">
                <div
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer flex justify-between items-center"
                  onClick={toggleClientDropdown}
                >
                  <span>
                    {clients.find((client) => client.id === formData.client)
                      ?.clientName || 'Select Client'}
                  </span>
                  <IoChevronDown
                    className={`transform transition-transform ${
                      isClientDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {isClientDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search clients..."
                        value={searchClient}
                        onChange={(e) => setSearchClient(e.target.value)}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <div
                          key={client.id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              client: client.id,
                            }));
                            setSearchClient('');
                            setIsClientDropdownOpen(false);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                        >
                          {client.clientName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Location:
              </label>
              <div className="relative">
                <div
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer flex justify-between items-center"
                  onClick={toggleLocationDropdown}
                >
                  <span>
                    {locations.find(
                      (location) => location.id === formData.location
                    )?.location_name || 'Select Location'}
                  </span>
                  <IoChevronDown
                    className={`transform transition-transform ${
                      isLocationDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {isLocationDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search locations..."
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredLocations.map((location) => (
                        <div
                          key={location.id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              location: location.id,
                            }));
                            setSearchLocation('');
                            setIsLocationDropdownOpen(false);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                        >
                          {location.location_name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors duration-300"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Notification Modal */}
          {notification.isOpen && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
                <div className="flex flex-col items-center text-center">
                  {notification.type === 'success' ? (
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
                      notification.type === 'success'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {notification.type === 'success' ? 'Success!' : 'Error!'}
                  </h3>
                  <p className="text-gray-600 mb-6">{notification.message}</p>
                  <button
                    onClick={() => {
                      setNotification({ ...notification, isOpen: false });
                      if (notification.type === 'success') {
                        onClose();
                      }
                    }}
                    className={`px-6 py-2 rounded-lg text-white font-medium
                      ${
                        notification.type === 'success'
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-red-500 hover:bg-red-600'
                      }
                      transition-colors duration-200`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddRateCardModal;
