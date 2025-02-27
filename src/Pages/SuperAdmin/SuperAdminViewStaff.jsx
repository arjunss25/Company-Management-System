import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TbArrowBackUp } from "react-icons/tb";
import EditStaffProfile from '../../Components/SuperadminComponents/EditStaffProfile';
import { SuperadminApi } from '../../Services/SuperadminApi';
import Spinner from '../../Components/Common/Spinner';
import Modal from '../../Components/Common/Modal';
import { FaUsersRays } from "react-icons/fa6";

const SuperAdminViewStaff = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRights, setUserRights] = useState({
    canEdit: true,
    canDelete: true,
  });
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchStaffList = async () => {
    try {
      setLoading(true);
      const response = await SuperadminApi.getStaffListByCompany(companyId);
      setStaffList(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch staff list');
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchStaffList();
    }
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }
  // Add empty state handler
  if (!staffList || staffList.length === 0) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <div className="main-content w-full h-full overflow-y-auto p-6">
          <div className=" mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                Staff Management
                <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
              </h1>

              <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <button
                onClick={() => navigate('/superadmin/company-management')}
                className="flex items-center gap-2 bg-blue-500 px-5 py-1 rounded-full text-white hover:shadow-sm transition-colors"
              >
                <TbArrowBackUp className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
            </div>

            {/* Empty State Message */}
            <div className="bg-white rounded-xl shadow-sm p-8 text-center w-full">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 p-8 rounded-full bg-[#DFDFDF]">
                <FaUsersRays  className='text-[2rem]'/>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Staff Members Found
                </h3>
                <p className="text-gray-600 max-w-md">
                  There are currently no staff members registered for this
                  company. New staff members will appear here once they are
                  added.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const handleEdit = (staffId) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (staff) {
      const convertDate = (dateString) => {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
      };

      const formattedStaff = {
        id: staff.id,
        staffName: staff.staff_name,
        companyName: staff.company_name,
        abbreviation: staff.abbrevation,
        role: staff.role,
        username: staff.username,
        password: staff.password,
        dateOfRegistration: convertDate(staff.date_of_registration),
        phoneNumber: staff.number,
        photo: staff.image,
        photoPreview: staff.image ? `http://82.29.160.146${staff.image}` : null,
      };
      setSelectedStaff(formattedStaff);
    }
  };

  const handleEditSuccess = () => {
    // Refresh the staff list after successful edit
    fetchStaffList();
    setSelectedStaff(null); // Close the modal
  };

  const handleDelete = (staff) => {
    setStaffToDelete(staff);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;

    try {
      await SuperadminApi.deleteStaff(staffToDelete.id, companyId);
      setSuccessMessage('Staff deleted successfully!');
      await fetchStaffList(); // Refresh the list
      // Show success message in modal for 2 seconds before closing
      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setStaffToDelete(null);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error deleting staff:', error);
      setError('Failed to delete staff. Please try again.');
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="main-content w-full h-full overflow-y-auto p-6">
        {/* Back button and header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Staff List
              <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
            </h1>

            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <button
                onClick={() => navigate('/superadmin/company-management')}
                className="flex items-center gap-2 bg-blue-500 px-5 py-1 rounded-full text-white hover:shadow-sm transition-colors"
              >
                <TbArrowBackUp className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>


          </div>
        </div>

        {/* Staff List Table */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Sl.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Staff Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date Of Registration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffList.map((staff, index) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {staff.staff_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {staff.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {staff.date_of_registration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <Link
                        to=""
                        className="inline-flex items-center px-3 py-1.5 border border-yellow-500 text-yellow-500 bg-white rounded-md hover:bg-yellow-500 hover:text-white transition-colors duration-200"
                      >
                        User Rights
                      </Link>
                      {userRights.canEdit && (
                        <button
                          onClick={() => handleEdit(staff.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-green-500 text-green-500 bg-white rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200"
                        >
                          Edit
                        </button>
                      )}
                      {userRights.canDelete && (
                        <button
                          onClick={() => handleDelete(staff)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-500 text-red-500 bg-white rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setError(null);
            setSuccessMessage('');
          }}
        >
          <div className="p-6">
            {!successMessage && !error && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                  Confirm Delete
                </h3>
                <p className="text-center text-gray-600 mb-2">
                  Are you sure you want to delete staff member:
                </p>
                <p className="text-center font-semibold text-gray-800 mb-1">
                  {staffToDelete?.staff_name}
                </p>
                <p className="text-center text-gray-600 mb-6">
                  from company {staffToDelete?.company_name}?
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {successMessage && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  {successMessage}
                </h3>
              </div>
            )}

            {error && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  {error}
                </h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </Modal>

        {/* Edit Staff Modal */}
        {selectedStaff && (
          <EditStaffProfile
            staff={selectedStaff}
            onClose={() => setSelectedStaff(null)}
            onEditSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default SuperAdminViewStaff;
