import React, { useState, useEffect, useRef } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { motion } from 'framer-motion';
import UpdateContractModal from './UpdateContractModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { AdminApi } from '../../../Services/AdminApi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import SuccessModal from './SuccessModal';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const AddContract = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [expandedSection, setExpandedSection] = useState('addContract');
  const [formData, setFormData] = useState({
    client: '',
    location: '',
    rateCard: '',
    contractNo: '',
    validFrom: '',
    validTill: '',
    attachments: [],
  });
  const [errors, setErrors] = useState({});
  const [selectedContract, setSelectedContract] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchClient, setSearchClient] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [rateCards, setRateCards] = useState([]);
  const [searchRateCard, setSearchRateCard] = useState('');
  const [isRateCardDropdownOpen, setIsRateCardDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [navigationTimer, setNavigationTimer] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 10;

  useEffect(() => {
    const fetchClientsAndLocationsAndRateCards = async () => {
      try {
        const clientResponse = await AdminApi.getClientList();
        const locationResponse = await AdminApi.listLocations();
        const rateCardResponse = await AdminApi.listRateCards();
        const contractsResponse = await AdminApi.listContracts();

        setClients(clientResponse.data || []);
        setLocations(locationResponse.data || []);
        setRateCards(rateCardResponse.data || []);
        setContracts(contractsResponse.data || []);
      } catch (error) {
        console.error(
          'Error fetching clients, locations, rate cards, or contracts:',
          error
        );
      }
    };

    fetchClientsAndLocationsAndRateCards();
  }, []);

  useEffect(() => {
    if (isSuccessModalOpen) {
      const timer = setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccessModalOpen]);

  useEffect(() => {
    if (isFailureModalOpen) {
      const timer = setTimeout(() => {
        setIsFailureModalOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFailureModalOpen]);

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

  const handleAddAttachment = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const newAttachments = Array.from(files);
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (index) => {
    if (attachments.length > 1) {
      setAttachments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formDataObj = new FormData();

        // Append basic contract details
        formDataObj.append('client', formData.client);
        formDataObj.append('location', formData.location);
        formDataObj.append('rate_card', formData.rateCard);
        formDataObj.append('contract_no', formData.contractNo);
        formDataObj.append('valid_from', formatDate(formData.validFrom));
        formDataObj.append('valid_till', formatDate(formData.validTill));

        // Append attachments with the correct field name
        attachments.forEach((file) => {
          if (file instanceof File) {
            formDataObj.append('attachments[]', file);
          }
        });

        // Log FormData entries for debugging
        for (let pair of formDataObj.entries()) {
          console.log('FormData Entry:', pair[0], pair[1]);
        }

        const response = await AdminApi.addContract(formDataObj);
        console.log('API Response:', response);

        if (response.status === 'Success') {
          setFormData({
            client: '',
            location: '',
            rateCard: '',
            contractNo: '',
            validFrom: '',
            validTill: '',
            attachments: [],
          });
          setAttachments([]);
          setModalMessage('Contract added successfully!');
          setIsSuccessModalOpen(true);

          const timer = setTimeout(() => {
            navigate('/admin/contract-dashboard');
          }, 3000);

          setNavigationTimer(timer);
        }
      } catch (error) {
        console.error(
          'Error adding contract:',
          error.response ? error.response.data : error.message
        );
        setModalMessage('Error adding contract. Please try again.');
        setIsFailureModalOpen(true);
      }
    }
  };

  const handleEdit = async (contractId) => {
    if (hasPermission(PERMISSIONS.EDIT_CONTRACT)) {
      const contract = contracts.find((c) => c.id === contractId);
      if (contract) {
        setSelectedContract(contract);
        setIsUpdateModalOpen(true);
      }
    }
  };

  const handleDelete = (contractId) => {
    if (hasPermission(PERMISSIONS.DELETE_CONTRACT)) {
      setContractToDelete(contractId);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (contractToDelete && hasPermission(PERMISSIONS.DELETE_CONTRACT)) {
      try {
        const response = await AdminApi.deleteContract(contractToDelete);
        if (response.status === 'Success') {
          setContracts((prev) =>
            prev.filter((contract) => contract.id !== contractToDelete)
          );
          setIsDeleteModalOpen(false);
          setContractToDelete(null);
        } else {
          console.error('Failed to delete contract');
        }
      } catch (error) {
        console.error('Error deleting contract:', error);
      }
    }
  };

  const handleBack = () => {
    navigate('/contract-dashboard');
  };

  const filteredClients = clients.filter((client) =>
    client.clientName.toLowerCase().includes(searchClient.toLowerCase())
  );

  const filteredLocations = locations.filter((location) =>
    location.location_name.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const filteredRateCards = rateCards.filter(
    (rateCard) =>
      rateCard.card_name &&
      rateCard.card_name.toLowerCase().includes(searchRateCard.toLowerCase())
  );

  const toggleClientDropdown = () => {
    setIsClientDropdownOpen(!isClientDropdownOpen);
    if (isLocationDropdownOpen) setIsLocationDropdownOpen(false);
  };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    if (isClientDropdownOpen) setIsClientDropdownOpen(false);
  };

  const toggleRateCardDropdown = () => {
    setIsRateCardDropdownOpen(!isRateCardDropdownOpen);
  };

  const handleAddAttachmentField = () => {
    setAttachments((prev) => [...prev, { file: null }]);
  };

  const handleAttachmentChange = (index, e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setAttachments((prev) => {
        const newAttachments = [...prev];
        newAttachments[index] = files[0];
        return newAttachments;
      });
    }
  };

  const handleContinue = () => {
    if (navigationTimer) {
      clearTimeout(navigationTimer);
    }
    setIsSuccessModalOpen(false);

    navigate('/admin/contract-dashboard');
  };

  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = contracts.slice(
    indexOfFirstContract,
    indexOfLastContract
  );
  const totalPages = Math.ceil(contracts.length / contractsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                        <div className="relative">
                          <div
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 cursor-pointer flex justify-between items-center"
                            onClick={toggleClientDropdown}
                          >
                            <span>
                              {clients.find(
                                (client) => client.id === formData.client
                              )?.clientName || 'Select Client'}
                            </span>
                            <IoIosArrowDown
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
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                                  placeholder="Search clients..."
                                  value={searchClient}
                                  onChange={(e) =>
                                    setSearchClient(e.target.value)
                                  }
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
                        <div className="relative">
                          <div
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 cursor-pointer flex justify-between items-center"
                            onClick={toggleLocationDropdown}
                          >
                            <span>
                              {locations.find(
                                (location) => location.id === formData.location
                              )?.location_name || 'Select Location'}
                            </span>
                            <IoIosArrowDown
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
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                                  placeholder="Search locations..."
                                  value={searchLocation}
                                  onChange={(e) =>
                                    setSearchLocation(e.target.value)
                                  }
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
                        <div className="relative">
                          <div
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 cursor-pointer flex justify-between items-center"
                            onClick={toggleRateCardDropdown}
                          >
                            <span>
                              {rateCards.find(
                                (rateCard) => rateCard.id === formData.rateCard
                              )?.card_name || 'Select Rate Card'}
                            </span>
                            <IoIosArrowDown
                              className={`transform transition-transform ${
                                isRateCardDropdownOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                          {isRateCardDropdownOpen && (
                            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                              <div className="p-2 border-b">
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                                  placeholder="Search rate cards..."
                                  value={searchRateCard}
                                  onChange={(e) =>
                                    setSearchRateCard(e.target.value)
                                  }
                                />
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                {filteredRateCards.map((rateCard) => (
                                  <div
                                    key={rateCard.id}
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        rateCard: rateCard.id,
                                      }));
                                      setSearchRateCard('');
                                      setIsRateCardDropdownOpen(false);
                                    }}
                                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                                  >
                                    {rateCard.card_name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
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

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Attachments
                        </label>
                        {attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 border border-gray-300 rounded-md p-2"
                          >
                            <input
                              type="file"
                              onChange={(e) => handleAttachmentChange(index, e)}
                              className="border-0 p-2 flex-1"
                            />
                            {attachments.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAttachment(index)}
                                className="text-red-500 hover:underline flex items-center"
                              >
                                <MdDeleteForever size={20} className="mr-1" />
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddAttachmentField}
                          className="flex items-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                        >
                          <IoMdAddCircleOutline size={20} className="mr-1" />
                          Add Attachment
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* List Contract Section */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <button
                className={`w-full p-5 text-left font-medium flex justify-between items-center ${
                  expandedSection === 'listContract'
                    ? 'bg-blue-50 rounded-t-xl'
                    : 'rounded-xl'
                }`}
                onClick={() =>
                  setExpandedSection(
                    expandedSection === 'listContract' ? null : 'listContract'
                  )
                }
              >
                <span className="text-gray-700 text-lg">List Contract</span>
                <IoIosArrowDown
                  className={`text-gray-400 text-xl transition-transform duration-300 ${
                    expandedSection === 'listContract' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  expandedSection === 'listContract' ? 'block' : 'hidden'
                }`}
              >
                <div className="relative bg-white rounded-b-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                          <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 w-24">
                            Contract No
                          </th>
                          <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                            Client
                          </th>
                          <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                            Location
                          </th>
                          <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 w-32">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentContracts.map((contract, index) => (
                          <motion.tr
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            key={contract.id}
                            className="group hover:bg-blue-50/50 transition-colors duration-300"
                          >
                            <td className="px-8 py-5">
                              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                                {contract.contract_no}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                                {clients.find(
                                  (client) => client.id === contract.client
                                )?.clientName || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                                {locations.find(
                                  (location) =>
                                    location.id === contract.location
                                )?.location_name || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center space-x-4">
                                <motion.button
                                  data-tooltip-id="action-tooltip"
                                  data-tooltip-content={
                                    !hasPermission(PERMISSIONS.EDIT_CONTRACT)
                                      ? "You don't have permission to edit contracts"
                                      : ''
                                  }
                                  whileHover={
                                    hasPermission(PERMISSIONS.EDIT_CONTRACT)
                                      ? { scale: 1.1 }
                                      : {}
                                  }
                                  whileTap={
                                    hasPermission(PERMISSIONS.EDIT_CONTRACT)
                                      ? { scale: 0.95 }
                                      : {}
                                  }
                                  onClick={() => handleEdit(contract.id)}
                                  disabled={
                                    !hasPermission(PERMISSIONS.EDIT_CONTRACT)
                                  }
                                  className={`p-2 rounded-lg transition-colors duration-300 ${
                                    hasPermission(PERMISSIONS.EDIT_CONTRACT)
                                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  <FiEdit size={18} />
                                </motion.button>

                                <motion.button
                                  data-tooltip-id="action-tooltip"
                                  data-tooltip-content={
                                    !hasPermission(PERMISSIONS.DELETE_CONTRACT)
                                      ? "You don't have permission to delete contracts"
                                      : ''
                                  }
                                  whileHover={
                                    hasPermission(PERMISSIONS.DELETE_CONTRACT)
                                      ? { scale: 1.1 }
                                      : {}
                                  }
                                  whileTap={
                                    hasPermission(PERMISSIONS.DELETE_CONTRACT)
                                      ? { scale: 0.95 }
                                      : {}
                                  }
                                  onClick={() => handleDelete(contract.id)}
                                  disabled={
                                    !hasPermission(PERMISSIONS.DELETE_CONTRACT)
                                  }
                                  className={`p-2 rounded-lg transition-colors duration-300 ${
                                    hasPermission(PERMISSIONS.DELETE_CONTRACT)
                                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  <RiDeleteBin6Line size={18} />
                                </motion.button>
                              </div>

                              <Tooltip
                                id="action-tooltip"
                                place="top"
                                className="!bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                              />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {contracts.length > contractsPerPage && (
                    <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Showing {indexOfFirstContract + 1} to{' '}
                        {Math.min(indexOfLastContract, contracts.length)} of{' '}
                        {contracts.length} contracts
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-lg border ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                          } transition-all duration-300`}
                        >
                          Previous
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                            } transition-all duration-300`}
                          >
                            {pageNumber}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded-lg border ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                          } transition-all duration-300`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <UpdateContractModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedContract(null);
        }}
        contract={selectedContract}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setContractToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Contract"
        message="Are you sure you want to delete this contract? This action cannot be undone."
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={modalMessage}
        onContinue={handleContinue}
      />
      <SuccessModal
        isOpen={isFailureModalOpen}
        onClose={() => setIsFailureModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default AddContract;
