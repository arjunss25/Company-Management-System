import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MaterialRequestDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  

  // Dummy data for the table
  const materialDetails = [
    {
      id: 1,
      slNo: '1',
      refNo: 'REF-001',
    },
    {
      id: 2,
      slNo: '2',
      refNo: 'REF-002',
    },
    {
      id: 3,
      slNo: '3',
      refNo: 'REF-003',
    },
  ];

  const handleView = (id) => console.log('View clicked for:', id);
  const handleEdit = (id) => console.log('Edit clicked for:', id);
  const handleDelete = (id) => console.log('Delete clicked for:', id);

  return (
    <div className="flex h-screen bg-gray-100">

      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with Back Button and Title */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 mr-4"
            >
              <IoArrowBack size={20} className="mr-2" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Material Request Details
            </h1>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-8 py-5 text-left text-sm font-medium text-gray-600 tracking-wider">
                      Sl.No
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-medium text-gray-600 tracking-wider">
                      Ref No
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-medium text-gray-600 tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {materialDetails.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-900">
                        {item.slNo}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-900">
                        {item.refNo}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleView(item.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                            title="View"
                          >
                            <FaEye size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(item.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                            title="Delete"
                          >
                            <FaTrash size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MaterialRequestDetails;
