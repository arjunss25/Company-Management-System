import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UpdateMaterialModal from './UpdateMaterialModal';

const ViewMaterial = () => {
  const navigate = useNavigate();
  const [materials] = useState([
    { id: 1, material: 'dxdxw' },
    { id: 2, material: 'dxdxw' },
    { id: 3, material: 'ewres' },
    { id: 4, material: 'hgnh' },
    { id: 5, material: 'hhhhh' },
    { id: 6, material: 'rtop' },
    { id: 7, material: 'sdss' },
    { id: 8, material: 'vff' },
    { id: 9, material: 'ywqtetywq'},
  ]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleEdit = (materialId) => {
    const material = materials.find((m) => m.id === materialId);
    setSelectedMaterial(material);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 md:w-[calc(100%-300px)] h-screen overflow-y-auto">
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
                onClick={() => navigate('/material-dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Material Details
              </h1>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 w-24">
                      ID
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">
                      Material Name
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={material.id}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 w-24">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                          {material.material}
                        </span>
                      </td>
                      <td className="px-8 py-5 w-32">
                        <div className="flex items-center space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(material.id)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                          >
                            <FiEdit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(material.id)}
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

            {/* pagination */}
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
        </motion.div>
      </div>

      <UpdateMaterialModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedMaterial(null);
        }}
        material={selectedMaterial}
      />
    </div>
  );
};

export default ViewMaterial;
