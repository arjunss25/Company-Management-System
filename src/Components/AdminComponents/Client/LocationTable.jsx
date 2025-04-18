import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import LocationEditModal from './LocationEditModal';
import usePermissions, { PERMISSIONS } from '../../../Hooks/userPermission';
import { AdminApi } from '../../../Services/AdminApi';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  locationName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Delete Location
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete "{locationName}"? This action cannot
            be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`px-4 py-2 rounded-lg ${
                isDeleting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white transition-colors duration-200`}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LocationTable = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // Reset scroll position immediately
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedLocation, setEditedLocation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    locationIndex: null,
    locationName: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const locationsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLocations();
  }, [currentPage]);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const response = await AdminApi.listLocations({
        page: currentPage,
        page_size: locationsPerPage,
      });

      if (response.status === 'Success') {
        setLocations(response.data || []);
        // Calculate total pages based on total count from API
        const totalCount =
          parseInt(response.total_count) || response.data.length;
        setTotalPages(Math.ceil(totalCount / locationsPerPage));
      } else {
        setError('Failed to fetch locations');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch locations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (index) => {
    if (hasPermission(PERMISSIONS.EDIT_LOCATION)) {
      setIsModalOpen(true);
      setEditIndex(index);
      setEditedLocation(locations[index].location_name);
    }
  };

  const handleDelete = (index) => {
    if (!hasPermission(PERMISSIONS.DELETE_LOCATION)) return;

    setDeleteConfirmation({
      isOpen: true,
      locationIndex: index,
      locationName: locations[index].location_name,
    });
  };

  const handleConfirmDelete = async () => {
    const index = deleteConfirmation.locationIndex;
    if (index === null) return;

    const locationId = locations[index].id;
    if (!locationId) {
      setDeleteError('Invalid location ID');
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const response = await AdminApi.deleteLocation(locationId);
      if (response.status === 'Success') {
        setLocations((prev) => prev.filter((_, i) => i !== index));
        setDeleteConfirmation({
          isOpen: false,
          locationIndex: null,
          locationName: '',
        });
      } else {
        setDeleteError('Failed to delete location');
      }
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || 'Failed to delete location'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!hasPermission(PERMISSIONS.EDIT_LOCATION)) return;

    const locationId = locations[editIndex].id;
    if (!locationId) {
      setEditError('Invalid location ID');
      return;
    }

    try {
      setIsEditing(true);
      setEditError(null);

      const response = await AdminApi.editLocation(locationId, editedLocation);
      if (response.status === 'Success') {
        const updatedLocations = [...locations];
        updatedLocations[editIndex] = {
          ...updatedLocations[editIndex],
          location_name: editedLocation,
        };
        setLocations(updatedLocations);
        setIsModalOpen(false);
      } else {
        setEditError('Failed to update location');
      }
    } catch (error) {
      setEditError(
        error.response?.data?.message || 'Failed to update location'
      );
    } finally {
      setIsEditing(false);
    }
  };

  // Calculate pagination values
  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = locations.slice(
    indexOfFirstLocation,
    indexOfLastLocation
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push({
        number: i,
        key: `page-${i}`,
      });
    }
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchLocations}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1 md:w-[calc(100%-300px)]">
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
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate(-1);
                }}
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
                  {currentLocations.map((location, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      key={location.id || index}
                      className="group hover:bg-blue-50/50 transition-colors duration-300"
                    >
                      <td className="px-8 py-5 w-24">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {indexOfFirstLocation + index + 1}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-gray-700 font-medium">
                          {location.location_name}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-4 justify-center">
                          <motion.button
                            data-tooltip-id="action-tooltip"
                            data-tooltip-content={
                              !hasPermission(PERMISSIONS.EDIT_LOCATION)
                                ? "You don't have permission to edit locations"
                                : ''
                            }
                            whileHover={
                              hasPermission(PERMISSIONS.EDIT_LOCATION)
                                ? { scale: 1.1 }
                                : {}
                            }
                            whileTap={
                              hasPermission(PERMISSIONS.EDIT_LOCATION)
                                ? { scale: 0.95 }
                                : {}
                            }
                            onClick={() => handleEdit(index)}
                            disabled={!hasPermission(PERMISSIONS.EDIT_LOCATION)}
                            className={`p-2 rounded-lg transition-colors duration-300 ${
                              hasPermission(PERMISSIONS.EDIT_LOCATION)
                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <FiEdit size={18} />
                          </motion.button>

                          <motion.button
                            data-tooltip-id="action-tooltip"
                            data-tooltip-content={
                              !hasPermission(PERMISSIONS.DELETE_LOCATION)
                                ? "You don't have permission to delete locations"
                                : ''
                            }
                            whileHover={
                              hasPermission(PERMISSIONS.DELETE_LOCATION)
                                ? { scale: 1.1 }
                                : {}
                            }
                            whileTap={
                              hasPermission(PERMISSIONS.DELETE_LOCATION)
                                ? { scale: 0.95 }
                                : {}
                            }
                            onClick={() => handleDelete(index)}
                            disabled={
                              !hasPermission(PERMISSIONS.DELETE_LOCATION)
                            }
                            className={`p-2 rounded-lg transition-colors duration-300 ${
                              hasPermission(PERMISSIONS.DELETE_LOCATION)
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <MdDelete size={18} />
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

            {locations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No locations found</p>
              </div>
            )}

            {deleteError && (
              <div className="px-8 py-4 bg-red-50 border-t border-red-200">
                <p className="text-red-600 text-sm">{deleteError}</p>
              </div>
            )}

            {/* Pagination */}
            {locations.length > 0 && (
              <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page.key}
                      onClick={() => setCurrentPage(page.number)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                        currentPage === page.number
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {page.number}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPages || 1, prev + 1)
                      )
                    }
                    disabled={currentPage === (totalPages || 1)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                      currentPage === (totalPages || 1)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
          isEditing={isEditing}
          editError={editError}
        />
      )}

      {/* Add DeleteConfirmationModal */}
      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <DeleteConfirmationModal
            isOpen={deleteConfirmation.isOpen}
            onClose={() =>
              setDeleteConfirmation({
                isOpen: false,
                locationIndex: null,
                locationName: '',
              })
            }
            onConfirm={handleConfirmDelete}
            locationName={deleteConfirmation.locationName}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationTable;
