import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { motion } from 'framer-motion';
import UpdateContractModal from './UpdateContractModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import axiosInstance from '../../../Config/axiosInstance';

const AddContract = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState('addContract');
  const [formData, setFormData] = useState({
    client: '',
    location: '',
    rateCard: '',
    contractNo: '',
    validFrom: '',
    validTill: '',
    attachment: null,
  });
  const [errors, setErrors] = useState({});
  const [selectedContract, setSelectedContract] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [rateCards, setRateCards] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients
        const clientsResponse = await axiosInstance.get('/clientGet/');
        setClients(clientsResponse.data.data || []);

        // Fetch locations
        const locationsResponse = await axiosInstance.get('/list-locations/');
        setLocations(locationsResponse.data.data || []);

        // Fetch rate cards
        const rateCardsResponse = await axiosInstance.get('/list-rate-cards/');
        setRateCards(rateCardsResponse.data.data || []);

        // Fetch contracts
        const contractsResponse = await axiosInstance.get('/list-contracts/');
        setContracts(contractsResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'client',
      'location',
      'rateCard',
      'contractNo',
      'validFrom',
      'validTill',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, ' $1')
        } is required`;
      }
    });

    // Validate dates
    if (formData.validFrom && formData.validTill) {
      const fromDate = new Date(formData.validFrom);
      const tillDate = new Date(formData.validTill);
      if (fromDate > tillDate) {
        newErrors.validTill = 'Valid till date must be after valid from date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'attachment' && formData[key]) {
          formDataToSend.append('attachment', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axiosInstance.post(
        '/add-contract/',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'Success') {
        setFormData({
          client: '',
          location: '',
          rateCard: '',
          contractNo: '',
          validFrom: '',
          validTill: '',
          attachment: null,
        });
        // Refresh contracts list if needed
      }
    } catch (error) {
      console.error('Error adding contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const contract = contracts.find((c) => c.id === id);
    setSelectedContract(contract);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id) => {
    setContractToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contractToDelete) return;

    try {
      const response = await axiosInstance.delete(
        `/delete-contract/${contractToDelete}/`
      );
      if (response.data.status === 'Success') {
        // Refresh contracts list if needed
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
    } finally {
      setContractToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="w-full flex">
      <div className="main-content w-full">
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
                onClick={() => navigate('/admin/contract-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Add Contract
              </h1>
            </div>
          </div>

          <div className="accordion-container space-y-6 max-w-5xl mx-auto">
            {/* Add Contract Section */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <button
                className={`w-full p-5 text-left font-medium flex justify-between items-center ${
                  expandedSection === 'addContract'
                    ? 'bg-blue-50 rounded-t-xl'
                    : 'rounded-xl'
                }`}
                onClick={() =>
                  setExpandedSection(
                    expandedSection === 'addContract' ? null : 'addContract'
                  )
                }
              >
                <span className="text-gray-700 text-lg">Add Contract</span>
                <IoIosArrowDown
                  className={`text-gray-400 text-xl transition-transform duration-300 ${
                    expandedSection === 'addContract' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Add Contract Form */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedSection === 'addContract' ? 'block' : 'hidden'
                }`}
              >
                <div className="p-6 border-t">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Client
                        </label>
                        <select
                          name="client"
                          value={formData.client}
                          onChange={handleInputChange}
                          className={`w-full p-3 border ${
                            errors.client ? 'border-red-500' : 'border-gray-200'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                        >
                          <option value="">Select client</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.clientName}
                            </option>
                          ))}
                        </select>
                        {errors.client && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.client}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className={`w-full p-3 border ${
                            errors.location
                              ? 'border-red-500'
                              : 'border-gray-200'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                        >
                          <option value="">Select location</option>
                          {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.location_name}
                            </option>
                          ))}
                        </select>
                        {errors.location && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.location}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Rate Card
                        </label>
                        <select
                          name="rateCard"
                          value={formData.rateCard}
                          onChange={handleInputChange}
                          className={`w-full p-3 border ${
                            errors.rateCard
                              ? 'border-red-500'
                              : 'border-gray-200'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                        >
                          <option value="">Select rate card</option>
                          {rateCards.map((card) => (
                            <option key={card.id} value={card.id}>
                              {card.name}
                            </option>
                          ))}
                        </select>
                        {errors.rateCard && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.rateCard}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Contract No
                        </label>
                        <input
                          type="text"
                          name="contractNo"
                          value={formData.contractNo}
                          onChange={handleInputChange}
                          placeholder="Enter contract number"
                          className={`w-full p-3 border ${
                            errors.contractNo
                              ? 'border-red-500'
                              : 'border-gray-200'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                        />
                        {errors.contractNo && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.contractNo}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Valid From
                        </label>
                        <input
                          type="date"
                          name="validFrom"
                          value={formData.validFrom}
                          onChange={handleInputChange}
                          className={`w-full p-3 border ${
                            errors.validFrom
                              ? 'border-red-500'
                              : 'border-gray-200'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                        />
                        {errors.validFrom && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.validFrom}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Valid Till
                        </label>
                        <input
                          type="date"
                          name="validTill"
                          value={formData.validTill}
                          onChange={handleInputChange}
                          className={`w-full p-3 border ${
                            errors.validTill
                              ? 'border-red-500'
                              : 'border-gray-200'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                        />
                        {errors.validTill && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.validTill}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">
                          Attachment
                        </label>
                        <input
                          type="file"
                          name="attachment"
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            client: '',
                            location: '',
                            rateCard: '',
                            contractNo: '',
                            validFrom: '',
                            validTill: '',
                            attachment: null,
                          });
                          setErrors({});
                        }}
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
                </div>
              </div>
            </div>

            {/* Contracts List Section */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <button
                className={`w-full p-5 text-left font-medium flex justify-between items-center ${
                  expandedSection === 'contractsList'
                    ? 'bg-blue-50 rounded-t-xl'
                    : 'rounded-xl'
                }`}
                onClick={() =>
                  setExpandedSection(
                    expandedSection === 'contractsList' ? null : 'contractsList'
                  )
                }
              >
                <span className="text-gray-700 text-lg">Contracts List</span>
                <IoIosArrowDown
                  className={`text-gray-400 text-xl transition-transform duration-300 ${
                    expandedSection === 'contractsList' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedSection === 'contractsList' ? 'block' : 'hidden'
                }`}
              >
                <div className="p-6 border-t">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contract No
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contracts.map((contract) => (
                          <tr key={contract.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {contract.contractNo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {contract.client}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {contract.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleEdit(contract.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <FiEdit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(contract.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <RiDeleteBin6Line size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <UpdateContractModal
          contract={selectedContract}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedContract(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={() => {
            setIsDeleteModalOpen(false);
            setContractToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default AddContract;
