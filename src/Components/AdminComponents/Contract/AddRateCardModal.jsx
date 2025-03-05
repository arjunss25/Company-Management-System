import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../../Config/axiosInstance';
import { toast } from 'react-hot-toast';

const AddRateCardModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    rateCardName: '',
    client: '',
    location: '',
    opexCapex: '',
  });
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const clientsResponse = await axiosInstance.get('/clientGet/');
        setClients(clientsResponse.data.data || []);

        // Fetch locations
        const locationsResponse = await axiosInstance.get('/list-locations/');
        setLocations(locationsResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.rateCardName ||
      !formData.client ||
      !formData.location ||
      !formData.opexCapex
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/add-rate-card/', {
        name: formData.rateCardName,
        client_id: formData.client,
        location_id: formData.location,
        opex_capex: formData.opexCapex,
      });

      if (response.data.status === 'Success') {
        toast.success('Rate card added successfully');
        handleReset();
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to add rate card');
      }
    } catch (error) {
      console.error('Error adding rate card:', error);
      toast.error(error.response?.data?.message || 'Failed to add rate card');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      rateCardName: '',
      client: '',
      location: '',
      opexCapex: '',
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
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-50"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add Rate Card</h2>
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
                placeholder="Enter rate card name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Client:
              </label>
              <select
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Location:
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.location_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Opex & Capex:
              </label>
              <select
                name="opexCapex"
                value={formData.opexCapex}
                onChange={handleInputChange}
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select Option</option>
                <option value="opex">Applicable</option>
                <option value="capex">Not Applicable</option>
              </select>
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
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddRateCardModal;
