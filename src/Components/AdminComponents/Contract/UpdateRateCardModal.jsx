import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { AdminApi } from '../../../Services/AdminApi';
import { IoChevronDown } from 'react-icons/io5';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const UpdateRateCardModal = ({ isOpen, onClose, rateCard, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    clientName: '',
    location: '',
    locationName: '',
    type: '',
  });

  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchClient, setSearchClient] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  useEffect(() => {
    const fetchClientsAndLocations = async () => {
      try {
        const clientResponse = await AdminApi.getClientList();
        const locationResponse = await AdminApi.listLocations();

        setClients(clientResponse.data);
        setLocations(locationResponse.data);
      } catch (error) {
        console.error('Error fetching clients or locations:', error);
      }
    };

    fetchClientsAndLocations();
  }, []);

  useEffect(() => {
    if (rateCard) {
      setFormData({
        name: rateCard.card_name,
        client: rateCard.client.toString(),
        clientName: rateCard.client_name,
        location: rateCard.location.toString(),
        locationName: rateCard.location_name,
        type:
          rateCard.opex_capex === 'Not Applicable'
            ? 'Not Applicable'
            : 'Applicable',
      });
    }
  }, [rateCard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      card_name: formData.name,
      client: formData.client,
      location: formData.location,
      opex_capex: formData.type,
    };

    console.log('Payload:', payload);

    try {
      await AdminApi.editRateCard(rateCard.id, payload);
      setSuccessModalOpen(true);
      onUpdate();
      onClose();
    } catch (error) {
      setErrorModalOpen(true);
      console.error(
        'Error updating rate card:',
        error.response ? error.response.data : error.message
      );
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Rate Card
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <IoClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Rate Card Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Rate Card Name:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Client Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Client:
                </label>
                <div className="relative">
                  <div
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer flex justify-between items-center"
                    onClick={toggleClientDropdown}
                  >
                    <span>{formData.clientName || 'Select Client'}</span>
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
                                client: client.id.toString(),
                                clientName: client.clientName,
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

              {/* Location Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Location:
                </label>
                <div className="relative">
                  <div
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer flex justify-between items-center"
                    onClick={toggleLocationDropdown}
                  >
                    <span>{formData.locationName || 'Select Location'}</span>
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
                                location: location.id.toString(),
                                locationName: location.location_name,
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

              {/* Opex & Capex */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Opex & Capex:
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Applicable">Applicable</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Rate card updated successfully!"
      />

      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message="Error updating rate card."
      />
    </AnimatePresence>
  );
};

export default UpdateRateCardModal;
