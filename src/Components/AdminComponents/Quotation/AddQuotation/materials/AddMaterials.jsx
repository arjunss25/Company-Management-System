import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';

const AddMaterials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    materialMode: '',
    materialName: '',
    under: '',
    quantity: '',
    BuildingNo:'',
    unit: '',
  });
  const [materials, setMaterials] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      materialMode: '',
      materialName: '',
      under: '',
      quantity: '',
      unit: '',
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
                  <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? 'Edit Material' : 'Add Material'}</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                <label className="block">
                    <span className="text-sm font-medium text-gray-700">Building No</span>
                    <select
                      name="BuildingNo"
                      value={formData.BuildingNo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="bd1">10</option>
                      <option value="bd2">15</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Material Mode</span>
                    <select
                      name="materialMode"
                      value={formData.materialMode}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Mode</option>
                      <option value="mode1">Applicable</option>
                      <option value="mode2">Not Applicable</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Material Name</span>
                    <select
                      name="materialName"
                      value={formData.materialName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Name</option>
                      <option value="material1">Material 1</option>
                      <option value="material2">Material 2</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Under</span>
                    <input
                      type="text"
                      name="under"
                      value={formData.under}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Quantity</span>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Unit</span>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Unit</option>
                      <option value="unit1">Unit 1</option>
                      <option value="unit2">Unit 2</option>
                    </select>
                  </label>
                </div>
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
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
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Sl. No</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Building No</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Material Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Under</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Quantity</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Unit</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                  No materials
                </td>
              </tr>
            ) : (
              materials.map((material, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-700">{material.BuildingNo}</td>
                  <td className="px-4 py-2 text-gray-700">{material.materialName}</td>
                  <td className="px-4 py-2 text-gray-700">{material.under}</td>
                  <td className="px-4 py-2 text-gray-700">{material.quantity}</td>
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