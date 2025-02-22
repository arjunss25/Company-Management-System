import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditCompanyModal from './EditCompanyModal';

const CompanyListTable = () => {
  const dummyData = [
    {
      id: 1,
      companyName: 'ABC Corp',
      address: '123 Main St, City, Country',
      description: 'A leading company in the industry.',
      logo: 'LOGO14.png',
      dateOfRegistration: '01-01-2020',
      licenseNumber: 'LIC123456',
    },
    {
      id: 2,
      companyName: 'XYZ Ltd',
      address: '456 Elm St, City, Country',
      description: 'Innovative solutions for modern problems.',
      logo: 'LOGO14.png',
      dateOfRegistration: '15-05-2019',
      licenseNumber: 'LIC654321',
    },
    {
      id: 3,
      companyName: 'XYZ Ltd',
      address: '456 Elm St, City, Country',
      description: 'Innovative solutions for modern problems.',
      logo: 'LOGO14.png',
      dateOfRegistration: '15-05-2019',
      licenseNumber: 'LIC654321',
    },
    // Add more dummy data as needed
  ];

  const [companies, setCompanies] = useState(dummyData);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    const company = companies.find((c) => c.id === id);
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log('Delete company:', id);
    // Implement delete functionality
  };

  const handleViewStaff = (id) => {
    navigate(`/viewstaff/${id}`);
  };

  const handleSave = (updatedCompany) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Sl.No</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Company Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Address</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Logo</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date Of Registration</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">License Number</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Staff Management</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company, index) => (
            <tr key={company.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.companyName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.address}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <img src={company.logo} alt="Logo" className="h-10 w-10 object-cover rounded-full" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.dateOfRegistration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.licenseNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={() => handleViewStaff(company.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-500 text-blue-500 bg-white rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200"
                >
                  View Staff
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <button
                  onClick={() => handleEdit(company.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-500 text-blue-500 bg-white rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-red-500 text-red-500 bg-white rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditCompanyModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default CompanyListTable;