import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { motion } from 'framer-motion';
import UpdateContractModal from './UpdateContractModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

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

  // Dummy data for contracts list
  const contracts = [
    { id: 1, contractNo: '30', client: 'Divya M', location: 'asdsa' },
    { id: 2, contractNo: '28', client: 'Adwaith K', location: 'asdsa' },
    { id: 3, contractNo: 'saS', client: 'Divya M', location: 'asdsa' },
    { id: 4, contractNo: '122', client: 'Divya M', location: 'asdsa' },
    { id: 5, contractNo: '15', client: 'Divya M', location: 'asdsa' },
    { id: 6, contractNo: '13', client: 'Adwaith K', location: 'Djnjs' },
    { id: 7, contractNo: '56', client: 'Divya M', location: 'Djnjs' },
    { id: 8, contractNo: '19', client: 'Adwaith K', location: 'Djnjs' },
  ];

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
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

  const handleConfirmDelete = () => {
    if (contractToDelete) {
      console.log('Deleting contract:', contractToDelete);
      // Add your delete logic here
      // After successful deletion, you might want to refresh your contracts list
    }
    setContractToDelete(null);
  };

  const handleBack = () => {
    navigate('/contract-dashboard');
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex">

      <div className="main-content w-full md:w-[calc(100%-300px)] h-full overflow-y-scroll">
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
                onClick={() => navigate('/contract-dashboard')}
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
                          {/* Add your client options here */}
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
                          {/* Add your location options here */}
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
                          {/* Add your rate card options here */}
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

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Attachment
                        </label>
                        <div className="flex items-center space-x-2">
                          <label className="w-full flex items-center px-4 py-2 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-all">
                            <span className="text-sm text-gray-500">
                              Choose file
                            </span>
                            <input
                              type="file"
                              name="attachment"
                              onChange={handleInputChange}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            -
                          </button>
                        </div>
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
                        {contracts.map((contract, index) => (
                          <motion.tr
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            key={contract.id}
                            className="group hover:bg-blue-50/50 transition-colors duration-300"
                          >
                            <td className="px-8 py-5">
                              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                                {contract.contractNo}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                                {contract.client}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                                {contract.location}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center space-x-4">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEdit(contract.id)}
                                  className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                                >
                                  <FiEdit size={18} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(contract.id)}
                                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                                >
                                  <RiDeleteBin6Line size={18} />
                                </motion.button>
                              </div>
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
    </div>
  );
};

export default AddContract;
