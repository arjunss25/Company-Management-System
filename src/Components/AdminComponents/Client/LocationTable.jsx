import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';
import LocationEditModal from './LocationEditModal';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';

const LocationTable = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // Add dummy location data
  const dummyLocations = [
    'New York City',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
  ];

  const [locations, setLocations] = useState(dummyLocations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedLocation, setEditedLocation] = useState('');

  const handleEdit = (index) => {
    if (hasPermission(PERMISSIONS.EDIT_LOCATION)) {
      setIsModalOpen(true);
      setEditIndex(index);
      setEditedLocation(locations[index]);
    }
  };

  const handleDelete = (index) => {
    if (hasPermission(PERMISSIONS.DELETE_LOCATION)) {
      setLocations((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (hasPermission(PERMISSIONS.EDIT_LOCATION)) {
      const updatedLocations = [...locations];
      updatedLocations[editIndex] = editedLocation;
      setLocations(updatedLocations);
      setIsModalOpen(false);
    }
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
                onClick={() => navigate(-1)}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <IoArrowBack
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Locations
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
                      Sl.No
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
                  {locations.map((location, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={index}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 w-24">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium">
                          {location}
                        </span>
                      </td>
                      <td className="px-8 py-5 space-x-2 flex gap-2">
                        {hasPermission(PERMISSIONS.EDIT_LOCATION) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(index)}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                          >
                            Edit
                          </motion.button>
                        )}
                        {hasPermission(PERMISSIONS.DELETE_LOCATION) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                          >
                            Delete
                          </motion.button>
                        )}
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
        </motion.div>
      </div>

      {isModalOpen && hasPermission(PERMISSIONS.EDIT_LOCATION) && (
        <LocationEditModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editedLocation={editedLocation}
          setEditedLocation={setEditedLocation}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default LocationTable;
