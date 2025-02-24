import React, { useState, useEffect } from 'react';
import { SuperadminApi } from '../../Services/SuperadminApi';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import ConfirmationModal from '../Common/ConfirmationModal';
import EditStaffModal from './EditStaffModal';

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await SuperadminApi.getStaffList();
      if (response.status === 'Success') {
        setStaffList(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff list:', error);
      setError('Failed to load staff list');
      setLoading(false);
    }
  };

  const handleDeleteClick = (staff) => {
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const response = await SuperadminApi.deleteStaff(
        staffToDelete.id,
        staffToDelete.company_id
      );
      if (response.status === 'Success') {
        setStaffList((prevList) =>
          prevList.filter((staff) => staff.id !== staffToDelete.id)
        );
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert(error.response?.data?.message || 'Failed to delete staff member');
    } finally {
      setDeleteLoading(false);
      setStaffToDelete(null);
    }
  };

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
  };

  const handleEditClose = (wasUpdated = false) => {
    setShowEditModal(false);
    setSelectedStaff(null);
    if (wasUpdated) {
      fetchStaffList(); 
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-3">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abbreviation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff, index) => (
                <tr
                  key={staff.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {staff.image ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover transform hover:scale-110 transition-transform duration-200"
                          src={`http://82.29.160.146${staff.image}`}
                          alt={staff.staff_name}
                        />
                      ) : (
                        <IoPersonCircleOutline className="h-10 w-10 text-gray-400" />
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {staff.staff_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {staff.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 transform hover:scale-105 transition-transform duration-200">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.abbrevation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.date_of_registration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(staff)}
                      className="text-blue-600 bg-blue-100 p-2 rounded-sm hover:text-blue-900 mr-4"
                    >
                      <AiFillEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(staff)}
                      className="text-red-600 bg-red-100 p-2 rounded-sm hover:text-red-900"
                    >
                      <MdDelete className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {staffList.length === 0 && (
          <div
            className="text-center py-12"
            style={{
              animation: 'fadeIn 0.5s ease-out',
            }}
          >
            <IoPersonCircleOutline className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Staff</h3>
            <p className="mt-1 text-sm text-gray-500">
              No staff members have been added yet.
            </p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setStaffToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${staffToDelete?.staff_name}? This action cannot be undone.`}
        loading={deleteLoading}
      />

      <EditStaffModal
        isOpen={showEditModal}
        staffData={selectedStaff}
        onClose={handleEditClose}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default StaffList;
