import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { AdminApi } from '../../../Services/AdminApi';

const UpdateRateCardModal = ({ isOpen, onClose, rateCard }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    clientName: '',
    location: '',
    locationName: '',
    type: '',
  });

  useEffect(() => {
    if (rateCard) {
      setFormData({
        name: rateCard.card_name,
        client: rateCard.client,
        clientName: rateCard.client_name,
        location: rateCard.location,
        locationName: rateCard.location_name,
        type: rateCard.opex_capex,
      });
    }
  }, [rateCard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AdminApi.editRateCard(rateCard.id, {
        card_name: formData.name,
        client: formData.client,
        location: formData.location,
        opex_capex: formData.type,
      });
      onClose();
    } catch (error) {
      console.error('Error updating rate card:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
          >
            {/* Header */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Rate Card Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Rate Card Name :
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

              {/* Client */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Client :
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Location :
                </label>
                <input
                  type="text"
                  value={formData.locationName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Opex & Capex */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Opex & Capex :
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OPEX">Applicable</option>
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
    </AnimatePresence>
  );
};

export default UpdateRateCardModal;
