import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminApi } from '../../../Services/AdminApi';

const UpdateContractModal = ({ isOpen, onClose, contract }) => {
  const [formData, setFormData] = useState({
    client: '',
    location: '',
    rateCard: '',
    contractNo: '',
    validFrom: '',
    validTill: '',
    attachment: null,
  });
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [rateCards, setRateCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const clientResponse = await AdminApi.getClientList();
      const locationResponse = await AdminApi.listLocations();
      const rateCardResponse = await AdminApi.listRateCards();

      setClients(clientResponse.data || []);
      setLocations(locationResponse.data || []);
      setRateCards(rateCardResponse.data || []);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (contract) {
      setFormData({
        client: contract.client,
        location: contract.location,
        rateCard: contract.rateCard,
        contractNo: contract.contract_no,
        validFrom: contract.valid_from || '',
        validTill: contract.valid_till || '',
        attachment: contract.attachment || null,
      });
    }
  }, [contract]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'date') {
      // Convert date from YYYY-MM-DD to DD-MM-YYYY format
      const [year, month, day] = value.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      setFormData((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'file' ? files[0] : value,
      }));
    }
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD for input
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    return dateStr; // Already in DD-MM-YYYY format
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    return `${day}-${month}-${year}`; // Convert to DD-MM-YYYY format
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a FormData object to hold the data
    const formDataObj = new FormData();
    formDataObj.append('client', formData.client);
    formDataObj.append('location', formData.location);
    formDataObj.append('rate_card', formData.rateCard);
    formDataObj.append('contract_no', formData.contractNo);
    formDataObj.append('valid_from', formatDate(formData.validFrom)); // Convert to DD-MM-YYYY
    formDataObj.append('valid_till', formatDate(formData.validTill)); // Convert to DD-MM-YYYY

    // Handle attachment if any
    if (formData.attachment) {
      formDataObj.append('attachment', formData.attachment);
    }

    try {
      // Call the API to update the contract with FormData
      const response = await AdminApi.editContract(contract.id, formDataObj);
      console.log('API Response:', response);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  };

  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Update Contract
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client :
                  </label>
                  <select
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.clientName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location :
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.location_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Card :
                  </label>
                  <select
                    name="rateCard"
                    value={formData.rateCard}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    {rateCards.map((rateCard) => (
                      <option key={rateCard.id} value={rateCard.id}>
                        {rateCard.card_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract No :
                  </label>
                  <input
                    type="text"
                    name="contractNo"
                    value={formData.contractNo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid From :
                  </label>
                  <input
                    type="date"
                    name="validFrom"
                    value={
                      formData.validFrom
                        ? formatDateForInput(formData.validFrom)
                        : ''
                    }
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.validFrom
                      ? formatDateForDisplay(formData.validFrom)
                      : ''}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Till :
                  </label>
                  <input
                    type="date"
                    name="validTill"
                    value={
                      formData.validTill
                        ? formatDateForInput(formData.validTill)
                        : ''
                    }
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.validTill
                      ? formatDateForDisplay(formData.validTill)
                      : ''}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachment :
                </label>
                {formData.attachment && (
                  <span className="text-sm text-gray-500">
                    {formData.attachment.name}
                  </span>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpdateContractModal;
