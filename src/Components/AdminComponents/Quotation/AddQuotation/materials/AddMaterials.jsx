import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import {
  addQuotationMaterial,
  fetchQuotationMaterials,
} from '../../../../../store/slices/quotationProductsSlice';
import { selectQuotationId } from '../../../../../store/slices/quotationSlice';
import {
  getMaterialsList,
  getUnits,
  getBuildingNumbers,
  editMaterial,
  deleteMaterial,
} from '../../../../../Services/QuotationApi';
import { IoIosArrowDown } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';
import SearchableDropdown from '../../../../Common/SearchableDropdown';

const AddMaterials = () => {
  const dispatch = useDispatch();
  const quotationId = useSelector(selectQuotationId);
  const materials = useSelector((state) => state.quotationProducts.materials);
  const loading = useSelector((state) => state.quotationProducts.loading);
  const [materialsList, setMaterialsList] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [buildingNumbers, setBuildingNumbers] = useState([]);
  const [buildingsLoading, setBuildingsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    materialMode: 'Applicable',
    materialName: '',
    under: '',
    quantity: '',
    BuildingNo: '',
    unit: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Add these new state variables
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: '',
    message: '',
  });

  // Add new state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  useEffect(() => {
    if (quotationId) {
      dispatch(fetchQuotationMaterials(quotationId));
    }
  }, [quotationId, dispatch]);

  // Fetch materials and units
  useEffect(() => {
    const fetchData = async () => {
      setMaterialsLoading(true);
      setUnitsLoading(true);
      try {
        const [materials, units] = await Promise.all([
          getMaterialsList(),
          getUnits(),
        ]);
        setMaterialsList(materials);
        setUnitsList(units);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setMaterialsLoading(false);
        setUnitsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add this useEffect to fetch building numbers
  useEffect(() => {
    const fetchBuildingNumbers = async () => {
      if (quotationId) {
        setBuildingsLoading(true);
        try {
          const numbers = await getBuildingNumbers(quotationId);
          setBuildingNumbers(
            numbers.map((building) => ({
              id: building.id,
              name: building.building_number.toString(),
            }))
          );
        } catch (error) {
          console.error('Error fetching building numbers:', error);
        } finally {
          setBuildingsLoading(false);
        }
      }
    };

    fetchBuildingNumbers();
  }, [quotationId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter materials based on search term
  const filteredMaterials = materialsList.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle material selection
  const handleMaterialSelect = (materialId, materialName) => {
    setFormData((prev) => ({
      ...prev,
      materialName: materialId,
    }));
    setSearchTerm(materialName);
    setIsDropdownOpen(false);
  };

  // Get selected material name
  const getSelectedMaterialName = () => {
    const material = materialsList.find(
      (m) => m.id === parseInt(formData.materialName)
    );
    return material ? material.name : '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async (material) => {
    setFormData({
      materialMode: material.material_mode,
      materialName: material.material_name,
      under: material.under,
      quantity: material.quantity,
      unit: material.unit,
      BuildingNo: material.building_no,
    });
    setIsEditMode(true);
    setEditIndex(material.id);
    setIsModalOpen(true);
  };

  // Update handleDelete to show confirmation modal
  const handleDelete = (material) => {
    setMaterialToDelete(material);
    setShowDeleteModal(true);
  };

  // Add new function to handle delete confirmation
  const confirmDelete = async () => {
    try {
      await deleteMaterial(materialToDelete.id, quotationId);
      await dispatch(fetchQuotationMaterials(quotationId));
      setStatusMessage({
        type: 'success',
        message: 'Material deleted successfully',
      });
      setShowStatusModal(true);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete material',
      });
      setShowStatusModal(true);
    } finally {
      setShowDeleteModal(false);
      setMaterialToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quotationId) {
      setStatusMessage({
        type: 'error',
        message: 'Please fill work details first to get quotation ID',
      });
      setShowStatusModal(true);
      return;
    }

    const payload = {
      material_mode: formData.materialMode,
      material_name: formData.materialName,
      building_no: formData.BuildingNo || '',
      quantity: formData.quantity || '',
      quotation: quotationId.toString(),
      under: formData.under || '',
      unit: formData.unit || '',
    };

    try {
      if (isEditMode) {
        await editMaterial(editIndex, quotationId, payload);
      } else {
        await dispatch(addQuotationMaterial(payload)).unwrap();
      }

      await dispatch(fetchQuotationMaterials(quotationId));

      setFormData({
        materialMode: 'Applicable',
        materialName: '',
        under: '',
        quantity: '',
        unit: '',
        BuildingNo: '',
      });
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditIndex(null);

      setStatusMessage({
        type: 'success',
        message: isEditMode
          ? 'Material updated successfully'
          : 'Material added successfully',
      });
      setShowStatusModal(true);
    } catch (error) {
      console.error('Failed to handle material:', error);
      setStatusMessage({
        type: 'error',
        message:
          error.response?.data?.message ||
          `Failed to ${isEditMode ? 'update' : 'add'} material`,
      });
      setShowStatusModal(true);
    }
  };

  // Add this function back if it was accidentally removed
  const getMaterialName = (materialId) => {
    const material = materialsList.find((m) => m.id === parseInt(materialId));
    return material ? material.name : materialId;
  };

  // Enhanced table UI
  return (
    <div className="p-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Add Material
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-6"
            >
              <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isEditMode ? 'Edit Material' : 'Add Material'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <SearchableDropdown
                    options={buildingNumbers}
                    value={formData.BuildingNo}
                    onChange={(building) => {
                      setFormData((prev) => ({
                        ...prev,
                        BuildingNo: building.id,
                      }));
                    }}
                    placeholder="Select a building number"
                    isLoading={buildingsLoading}
                    label="Building No"
                  />
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Material Mode
                    </span>
                    <select
                      name="materialMode"
                      value={formData.materialMode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Applicable">Applicable</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                  </label>

                  <SearchableDropdown
                    options={materialsList}
                    value={formData.materialName}
                    onChange={(material) => {
                      setFormData((prev) => ({
                        ...prev,
                        materialName: material.id,
                      }));
                    }}
                    placeholder="Select a material"
                    isLoading={materialsLoading}
                    label="Material Name"
                  />

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Under
                    </span>
                    <input
                      type="text"
                      name="under"
                      value={formData.under}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Quantity
                    </span>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <SearchableDropdown
                    options={unitsList}
                    value={formData.unit}
                    onChange={(unit) => {
                      setFormData((prev) => ({
                        ...prev,
                        unit: unit.id,
                      }));
                    }}
                    placeholder="Select a unit"
                    isLoading={unitsLoading}
                    label="Unit"
                  />
                </div>
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Materials Table */}
      <div className="mt-8 overflow-hidden bg-white rounded-lg shadow">
        <div className="sm:flex sm:items-center sm:justify-between p-4 bg-gray-50">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Materials List
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              A list of all materials added to this quotation
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Material
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Sl. No',
                  'Building No',
                  'Material Mode',
                  'Material Name',
                  'Under',
                  'Quantity',
                  'Unit',
                  'Actions',
                ].map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading materials...</span>
                    </div>
                  </td>
                </tr>
              ) : materials.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No materials added
                  </td>
                </tr>
              ) : (
                materials.map((material, index) => (
                  <tr
                    key={material.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.building_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          material.material_mode === 'Applicable'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {material.material_mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getMaterialName(material.material_name)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.under}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(material)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(material)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <RiDeleteBin6Line size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-6"
            >
              <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Confirm Delete
                  </h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Are you sure you want to delete this material?
                  </p>
                  {materialToDelete && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Material Name:</span>{' '}
                        {getMaterialName(materialToDelete.material_name)}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Building No:</span>{' '}
                        {materialToDelete.building_no}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Quantity:</span>{' '}
                        {materialToDelete.quantity} {materialToDelete.unit}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <RiDeleteBin6Line className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-6"
            >
              <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-xl font-semibold ${
                      statusMessage.type === 'success'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {statusMessage.type === 'success' ? 'Success' : 'Error'}
                  </h3>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">{statusMessage.message}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      statusMessage.type === 'success'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                    } transition-colors`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddMaterials;
