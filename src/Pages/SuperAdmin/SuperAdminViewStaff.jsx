import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import EditStaffModal from '../../Components/SuperadminComponents/EditStaffModal';


const SuperAdminViewStaff = () => {
  const { companyId } = useParams(); // Get companyId from URL
  const [staffList, setStaffList] = useState([]);
  const [userRights, setUserRights] = useState({
    canEdit: true,
    canDelete: true,
  });
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    // Simulated staff data - later this will be replaced with API call
    const fetchedStaffData = [
      {
        id: 1,
        name: 'John Doe',
        role: 'Nurse',
        registrationDate: '2023-01-15',
      },
      {
        id: 2,
        name: 'Jane Smith',
        role: 'Admin',
        registrationDate: '2022-07-21',
      },
      {
        id: 3,
        name: 'David Johnson',
        role: 'Nurse',
        registrationDate: '2023-03-01',
      },
    ];

    setStaffList(fetchedStaffData);
  }, [companyId]);

  const handleEdit = (staffId) => {
    const staff = staffList.find((s) => s.id === staffId);
    setSelectedStaff(staff);
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
                        {staff.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.registrationDate}
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
        <EditStaffModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
};

export default SuperAdminViewStaff;
