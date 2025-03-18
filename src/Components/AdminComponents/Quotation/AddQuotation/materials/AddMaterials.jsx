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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quotationId) {
      alert('Please fill work details first to get quotation ID');
      return;
    }

    const payload = {
      material_mode: 'Not Applicable',
      material_name: formData.materialName,
      building_no: formData.BuildingNo || '',
      quantity: formData.quantity || '',
      quotation: quotationId.toString(),
      under: formData.under || '',
      unit: formData.unit || '',
    };

    try {
      await dispatch(addQuotationMaterial(payload)).unwrap();
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
    } catch (error) {
      console.error('Failed to add material:', error);
      alert(JSON.stringify(error.message || 'Failed to add material', null, 2));
    }
  };

  const handleSave = () => {
    if (isEditMode) {
      const updatedMaterials = materials.map((material, index) =>
        index === editIndex ? formData : material
      );
      setMaterials(updatedMaterials);
      setIsEditMode(false);
      setEditIndex(null);
    } else {
      setMaterials((prev) => [...prev, formData]);
    }
    setFormData({
      materialMode: 'Applicable',
      materialName: '',
      under: '',
      quantity: '',
      unit: '',
      BuildingNo: '',
    });
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    setFormData(materials[index]);
    setIsEditMode(true);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  const getMaterialName = (materialId) => {
    const material = materialsList.find((m) => m.id === parseInt(materialId));
    return material ? material.name : materialId;
  };

  // Add these styles to the dropdown container for smooth animation
  const dropdownAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };

  // Add keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleMaterialChange = (material) => {
    setFormData((prev) => ({
      ...prev,
      materialName: material.id,
    }));
  };

  const handleUnitChange = (unit) => {
    setFormData((prev) => ({
      ...prev,
      unit: unit.id,
    }));
  };

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
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Building No
                    </span>
                    <input
                      type="text"
                      name="BuildingNo"
                      value={formData.BuildingNo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>
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
                    onChange={handleMaterialChange}
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
                    onChange={handleUnitChange}
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

      {/* Materials Table */}
      <div className="mt-8">
        <table className="w-full min-w-[600px] bg-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Sl. No
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Building No
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Material Mode
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Material Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Under
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Quantity
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Unit
              </th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-2 text-center text-gray-500">
                  Loading materials...
                </td>
              </tr>
            ) : materials.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-2 text-center text-gray-500">
                  No materials added
                </td>
              </tr>
            ) : (
              materials.map((material, index) => (
                <tr key={material.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {material.building_no}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {material.material_mode}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {getMaterialName(material.material_name)}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{material.under}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {material.quantity}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{material.unit}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(index)}
                      className="px-2 py-1 text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="px-2 py-1 text-red-600 hover:text-red-800"
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddMaterials;
