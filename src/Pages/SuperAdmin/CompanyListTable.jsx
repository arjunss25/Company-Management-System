import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EditCompanyModal from './EditcompanyModal';
import Spinner from '../../Components/Common/Spinner';
import { CgSearch } from "react-icons/cg";
import Modal, { ErrorModal, SuccessModal } from '../../Components/Common/Modal';
import {
  fetchCompanies,
  updateCompany,
  deleteCompany,
  setSelectedCompany,
  searchCompanies,
} from '../../Redux/SuperAdminSlice/companiesSlice';
import { useDebounce } from '../../Hooks/useDebounce';

const CompanyListTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Move all useSelector hooks to the top level
  const {
    items: companies,
    status,
    error,
  } = useSelector((state) => state.companies);
  
  // Ensure companies is always an array
  const companyList = Array.isArray(companies) ? companies : [];
  
  const selectedCompany = useSelector(
    (state) => state.companies.selectedCompany
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearch) {
      dispatch(searchCompanies(debouncedSearch));
    } else {
      dispatch(fetchCompanies());
    }
  }, [debouncedSearch, dispatch]);

  const handleEdit = async (updatedData) => {
    try {
      const resultAction = await dispatch(
        updateCompany({ id: selectedCompany.id, data: updatedData })
      );

      if (updateCompany.fulfilled.match(resultAction)) {
        setSuccessMessage('Company updated successfully!');
        setShowSuccessModal(true);
        setIsModalOpen(false);
        dispatch(fetchCompanies()); // Refresh the list
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDelete = (id) => {
    const company = companies.find((c) => c.id === id);
    setCompanyToDelete(company);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;

    try {
      const resultAction = await dispatch(deleteCompany(companyToDelete.id));
      if (deleteCompany.fulfilled.match(resultAction)) {
        setSuccessMessage('Company deleted successfully!');
        setShowSuccessModal(true);
      }
    } finally {
      setIsDeleteModalOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleEditClick = (company) => {
    dispatch(setSelectedCompany(company));
    setIsModalOpen(true);
  };

  const handleViewStaff = (id) => {
    navigate(`/superadmin/viewstaff/${id}`);
  };
  const handleSave = (updatedCompany) => {
    dispatch(setSelectedCompany(updatedCompany));
  };

  if (status === 'loading') {
    return (
      <div className="main-container">
        <div className="mb-6">
          <div className="relative w-[40vw]">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-12 py-3 lg:py-3.5 rounded-xl
                       bg-white/80 backdrop-blur-md shadow-md
                       border border-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       focus:border-transparent focus:shadow-lg
                       text-gray-700 placeholder-gray-400
                       transition-all duration-200 ease-in-out"
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <CgSearch className="text-gray-400 text-xl" />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="main-container">
        <div className="mb-6">
          <div className="relative w-[40vw]">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-12 py-3 lg:py-3.5 rounded-xl
                       bg-white/80 backdrop-blur-md shadow-md
                       border border-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       focus:border-transparent focus:shadow-lg
                       text-gray-700 placeholder-gray-400
                       transition-all duration-200 ease-in-out"
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <CgSearch className="text-gray-400 text-xl" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow p-8">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-600 text-center">
            We couldn't find any companies matching your search. Please try a different search term.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="main-container w-full ">
        <div className="mb-6">
          <div className="relative w-[40vw]">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-12 py-3 lg:py-3.5 rounded-xl
                       bg-white/80 backdrop-blur-md shadow-md
                       border border-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       focus:border-transparent focus:shadow-lg
                       text-gray-700 placeholder-gray-400
                       transition-all duration-200 ease-in-out"
            />
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <CgSearch className="text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow w-[70vw]">
          <table className=" divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Sl.No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Company Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Address
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Logo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date Of Registration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  License Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Abbreviation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Staff Management
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companyList.map((company, index) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.company_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <img
                      src={company.logo_image?.startsWith('http') 
                        ? company.logo_image 
                        : `http://82.29.160.146${company.logo_image}`}
                      alt={`${company.company_name} Logo`}
                      className="h-10 w-10 object-cover rounded-full"
                      onError={(e) => {
                        e.target.src = '/default-logo.png';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.registration_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.license_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.abbrevation}
                  </td>
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
                      onClick={() => handleEditClick(company)}
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
        </div>

        <EditCompanyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          company={selectedCompany}
          onSave={handleEdit}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="p-6">
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
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete {companyToDelete?.company_name}?
              This action cannot be undone.
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
          </div>
        </Modal>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message={successMessage}
        />

        <ErrorModal
          isOpen={!!error}
          onClose={() => dispatch(fetchCompanies())}
          message={error}
        />
      </div>
    </>
  );
};

export default CompanyListTable;
