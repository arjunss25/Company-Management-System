import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import EditStaffProfile from '../../Components/SuperadminComponents/EditStaffProfile';
import { SuperadminApi } from '../../Services/SuperadminApi';
import Spinner from '../../Components/Common/Spinner';

const SuperAdminViewStaff = () => {
  const { companyId } = useParams();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRights, setUserRights] = useState({
    canEdit: true,
    canDelete: true,
  });
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        setLoading(true);
        const response = await SuperadminApi.getStaffListByCompany(companyId);
        // Update to use the data array from the response
        setStaffList(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch staff list');
        setStaffList([]);
      } finally {
        setLoading(false);
      }
    };

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
        <div className="main-content w-full md:w-[calc(100%-300px)] h-full overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Staff Management
                <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
              </h1>
            </div>

            {/* Empty State Message */}
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Staff Members Found
                </h3>
                <p className="text-gray-600 max-w-md">
                  There are currently no staff members registered for this company. 
                  New staff members will appear here once they are added.
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
      // Transform the staff data to match the expected format
      const formattedStaff = {
        staffName: staff.staff_name,
        abbreviation: staff.abbreviation,
        companyName: staff.company_name,
        role: staff.role,
        username: staff.username,
        dateOfRegistration: staff.date_of_registration,
        phoneNumber: staff.phone_number,
        photoPreview: staff.photo ? `http://82.29.160.146${staff.photo}` : null,
      };
      setSelectedStaff(formattedStaff);
    }
  };

  const handleDelete = (staffId) => {
    console.log(`Delete staff with ID: ${staffId}`);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <div className="main-content w-full md:w-[calc(100%-300px)] h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Staff Management
              <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
            </h1>
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
                            onClick={() => handleDelete(staff.id)}
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
        </div>
      </div>
      {selectedStaff && (
        <EditStaffProfile
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
};

export default SuperAdminViewStaff;
