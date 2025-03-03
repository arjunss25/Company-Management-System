import React, { useState, useEffect } from 'react';
import { FaTools, FaList, FaUsersCog, FaCheckCircle } from 'react-icons/fa';
import { IoIosArrowDown, IoIosInformationCircle } from 'react-icons/io';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { AdminApi } from '../../../Services/AdminApi';
import AddToolModal from './AddToolModal';
import EditToolModal from './EditToolModal';
import SuccessModal from './SuccessModal';

const StoreData = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState('addTools');
  const [toolName, setToolName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [expandedDescription, setExpandedDescription] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedTools, setSelectedTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toolsList, setToolsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listError, setListError] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedToolForDelete, setSelectedToolForDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Dummy data for the table
  const staffList = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Michael Brown' },
    { id: 4, name: 'Emily Davis' },
    { id: 5, name: 'Robert Wilson' },
  ];

  // Add filter function for tools
  const filteredTools = toolsList.filter((tool) =>
    (tool.tool_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(staffSearchTerm.toLowerCase())
  );

  // Add this new dummy data for assigned tools
  const assignedToolsList = [
    {
      id: 1,
      staffName: 'John Smith',
      toolName: 'Hammer',
    },
    {
      id: 2,
      staffName: 'Sarah Johnson',
      toolName: 'Power Drill',
    },
    {
      id: 3,
      staffName: 'Michael Brown',
      toolName: 'Measuring Tape',
    },
    {
      id: 4,
      staffName: 'Emily Davis',
      toolName: 'Wrench Set',
    },
  ];

  // Add these status options
  const statusOptions = [
    { value: '', label: 'Select' },
    { value: 'temporary_hold', label: 'Temporary Hold' },
    { value: 'permanent_return', label: 'Permanent Return' },
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setIsLoading(true);
    setListError(null);
    try {
      const response = await AdminApi.listTools();
      if (response.status === 'Success') {
        setToolsList(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch tools');
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      setListError(error.message || 'Failed to fetch tools. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!toolName.trim()) {
      newErrors.toolName = 'Tool name is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await AdminApi.addTool({
          tool_name: toolName,
          description: description,
        });

        if (response.status === 'Success') {
          setSuccessMessage(response.message || 'Tool added successfully!');
          setShowSuccess(true);
          // Reset form
          setToolName('');
          setDescription('');
          setErrors({});
          // Refresh tools list
          fetchTools();
        } else {
          throw new Error(response.message || 'Failed to add tool');
        }
      } catch (error) {
        console.error('Error adding tool:', error);
        setErrors({
          submit: error.message || 'Failed to add tool. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  const handleEdit = (id) => {
    const tool = toolsList.find((t) => t.id === id);
    if (tool) {
      setSelectedTool(tool);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSuccess = (message) => {
    setModalMessage(message);
    setIsError(false);
    setShowModal(true);
    fetchTools();
  };

  const handleEditError = (message) => {
    setModalMessage(message);
    setIsError(true);
    setShowModal(true);
  };

  const handleDelete = async (tool) => {
    setSelectedToolForDelete(tool);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedToolForDelete) return;

    setLoading(true);
    setErrors({});
    try {
      const response = await AdminApi.deleteTool(selectedToolForDelete.id);
      setShowDeleteConfirm(false);
      setSelectedToolForDelete(null);

      if (response.status === 'Success') {
        setSuccessMessage(response.message || 'Tool deleted successfully!');
        setShowSuccess(true);
        await fetchTools(); // Refresh the tools list
      } else {
        throw new Error(response.message || 'Failed to delete tool');
      }
    } catch (error) {
      console.error('Error deleting tool:', error);
      setSuccessMessage(
        error.message || 'Failed to delete tool. Please try again.'
      );
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleStatusChange = (itemId, newStatus) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [itemId]: newStatus,
    }));
    // You can add your API call here to update the status
    console.log(`Status updated for item ${itemId} to ${newStatus}`);
  };

  return (
    <div className="w-full flex">
      <div className="main-content w-full h-full p-4">
        <div className="title-sec w-full h-[12vh] flex items-center px-8">
          <div className="flex items-center space-x-8 w-full">
            <button
              onClick={() => navigate('/admin/material-dashboard')}
              className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <IoArrowBack
                size={20}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <h1 className="text-[1.8rem] font-semibold text-gray-800">
              Store Management
            </h1>
          </div>
        </div>

        <div className="accordion-container space-y-6 max-w-3xl mx-auto">
          {/* Add Tools Section */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <button
              className={`w-full p-5 text-left font-medium flex justify-between items-center ${
                expandedSection === 'addTools'
                  ? 'bg-blue-50 rounded-t-xl'
                  : 'rounded-xl'
              }`}
              onClick={() => toggleSection('addTools')}
            >
              <div className="flex items-center gap-3">
                <FaTools className="text-blue-500 text-xl" />
                <span className="text-gray-700 text-lg">Add Tools</span>
              </div>
              <IoIosArrowDown
                className={`text-gray-400 text-xl transition-transform duration-300 ease-in-out ${
                  expandedSection === 'addTools' ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedSection === 'addTools' ? 'block' : 'hidden'
              }`}
            >
              <div className="p-6 border-t bg-white rounded-b-xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block mb-2 text-gray-600 font-medium">
                      Tool Name
                    </label>
                    <input
                      type="text"
                      value={toolName}
                      onChange={(e) => setToolName(e.target.value)}
                      placeholder="Enter tool name"
                      className={`w-full p-3 border ${
                        errors.toolName ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                    />
                    {errors.toolName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.toolName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-600 font-medium">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter tool description"
                      rows="3"
                      className={`w-full p-3 border ${
                        errors.description
                          ? 'border-red-500'
                          : 'border-gray-200'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200 font-medium ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Adding Tool...' : 'Save Tool'}
                  </button>
                </form>
                {errors.submit && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {errors.submit}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* List Tools Section */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <button
              className={`w-full p-5 text-left font-medium flex justify-between items-center ${
                expandedSection === 'listTools'
                  ? 'bg-blue-50 rounded-t-xl'
                  : 'rounded-xl'
              }`}
              onClick={() => toggleSection('listTools')}
            >
              <div className="flex items-center gap-3">
                <FaList className="text-green-500 text-xl" />
                <span className="text-gray-700 text-lg">List Tools</span>
              </div>
              <IoIosArrowDown
                className={`text-gray-400 text-xl transition-transform duration-300 ease-in-out ${
                  expandedSection === 'listTools' ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedSection === 'listTools' ? 'block' : 'hidden'
              }`}
            >
              <div className="p-6 border-t">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading tools...</p>
                  </div>
                ) : listError ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-2">Error loading tools</div>
                    <p className="text-gray-600">{listError}</p>
                    <button
                      onClick={fetchTools}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Sl.No
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Tool Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {toolsList.map((tool, index) => (
                          <tr
                            key={tool.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 mr-4">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FaTools className="h-5 w-5 text-blue-500" />
                                  </div>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {tool.tool_name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600 max-w-md">
                                <div
                                  className={`${
                                    expandedDescription === tool.id
                                      ? ''
                                      : 'line-clamp-2'
                                  }`}
                                >
                                  {tool.description}
                                </div>
                                {tool.description &&
                                  tool.description.length > 100 && (
                                    <button
                                      onClick={() =>
                                        setExpandedDescription(
                                          expandedDescription === tool.id
                                            ? null
                                            : tool.id
                                        )
                                      }
                                      className="inline-flex items-center gap-1 mt-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                    >
                                      <span className="text-sm">
                                        {expandedDescription === tool.id
                                          ? 'Show Less'
                                          : 'Read More'}
                                      </span>
                                      <IoIosArrowDown
                                        className={`text-blue-500 transition-transform duration-300 ${
                                          expandedDescription === tool.id
                                            ? 'rotate-180'
                                            : 'rotate-0'
                                        }`}
                                      />
                                    </button>
                                  )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                              <button
                                onClick={() => handleEdit(tool.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-blue-500 text-blue-500 bg-white rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200"
                              >
                                <span className="text-sm">Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(tool)}
                                className="inline-flex items-center px-3 py-1.5 border border-red-500 text-red-500 bg-white rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
                              >
                                <span className="text-sm">Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Empty State */}
                    {toolsList.length === 0 && (
                      <div className="text-center py-12">
                        <FaTools className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No tools
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by creating a new tool.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assign Tools Section */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <button
              className={`w-full p-5 text-left font-medium flex justify-between items-center ${
                expandedSection === 'assignTools'
                  ? 'bg-blue-50 rounded-t-xl'
                  : 'rounded-xl'
              }`}
              onClick={() => toggleSection('assignTools')}
            >
              <div className="flex items-center gap-3">
                <FaUsersCog className="text-yellow-500 text-xl" />
                <span className="text-gray-700 text-lg">Assign Tools</span>
              </div>
              <IoIosArrowDown
                className={`text-gray-400 text-xl transition-transform duration-300 ease-in-out ${
                  expandedSection === 'assignTools' ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                expandedSection === 'assignTools' ? 'block' : 'hidden'
              }`}
            >
              <div className="p-6 border-t">
                <form className="space-y-6">
                  <div className="relative">
                    <label className="block mb-2 text-gray-600 font-medium">
                      Staff Name
                    </label>
                    <div className="relative">
                      <div
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer flex justify-between items-center bg-white"
                        onClick={() => {
                          setIsStaffDropdownOpen(!isStaffDropdownOpen);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="text-gray-500">
                          {selectedStaff
                            ? staffList.find(
                                (s) => s.id === parseInt(selectedStaff)
                              )?.name
                            : 'Select Staff'}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isStaffDropdownOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {isStaffDropdownOpen && (
                        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100]">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Search staff..."
                              value={staffSearchTerm}
                              onChange={(e) =>
                                setStaffSearchTerm(e.target.value)
                              }
                              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-600"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto bg-white">
                            {filteredStaff.map((staff) => (
                              <div
                                key={staff.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-700"
                                onClick={() => {
                                  setSelectedStaff(staff.id.toString());
                                  setIsStaffDropdownOpen(false);
                                  setStaffSearchTerm('');
                                }}
                              >
                                {staff.name}
                              </div>
                            ))}
                            {filteredStaff.length === 0 && (
                              <div className="px-4 py-2 text-gray-500">
                                No staff found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block mb-2 text-gray-600 font-medium">
                      Tools
                    </label>
                    <div className="relative">
                      <div
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer flex justify-between items-center bg-white"
                        onClick={() => {
                          setIsDropdownOpen(!isDropdownOpen);
                          setIsStaffDropdownOpen(false);
                        }}
                      >
                        <span className="text-gray-500">
                          {selectedTools.length > 0
                            ? toolsList.find(
                                (t) => t.id === parseInt(selectedTools)
                              )?.tool_name
                            : 'No tools selected'}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isDropdownOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {isDropdownOpen && (
                        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100]">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Search tools..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-600"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto bg-white">
                            {filteredTools.map((tool) => (
                              <div
                                key={tool.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-700"
                                onClick={() => {
                                  setSelectedTools(tool.id.toString());
                                  setIsDropdownOpen(false);
                                  setSearchTerm('');
                                }}
                              >
                                {tool.tool_name}
                              </div>
                            ))}
                            {filteredTools.length === 0 && (
                              <div className="px-4 py-2 text-gray-500">
                                No tools found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200 font-medium"
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Assigned Status Section */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div
              className={`w-full p-5 text-left font-medium flex justify-between items-center cursor-pointer ${
                expandedSection === 'assignedStatus'
                  ? 'bg-blue-50 rounded-t-xl'
                  : 'rounded-xl'
              }`}
              onClick={() => toggleSection('assignedStatus')}
            >
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-purple-500 text-xl" />
                <span className="text-gray-700 text-lg">Assigned Status</span>
              </div>
              <IoIosArrowDown
                className={`text-gray-400 text-xl transition-transform duration-300 ease-in-out ${
                  expandedSection === 'assignedStatus'
                    ? 'rotate-180'
                    : 'rotate-0'
                }`}
              />
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedSection === 'assignedStatus' ? 'block' : 'hidden'
              }`}
            >
              <div className="p-6 border-t">
                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block mb-2 text-gray-600 font-medium">
                        Staff Name
                      </label>
                      <div className="relative">
                        <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none">
                          <option value="">Select Staff</option>
                          {staffList.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                              {staff.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <IoIosArrowDown className="text-gray-400 text-xl" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block mb-2 text-gray-600 font-medium">
                        Tool Name
                      </label>
                      <div className="relative">
                        <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none">
                          <option value="">Select Tool</option>
                          {toolsList.map((tool) => (
                            <option key={tool.id} value={tool.id}>
                              {tool.tool_name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <IoIosArrowDown className="text-gray-400 text-xl" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                        Search
                      </button>
                    </div>
                  </div>
                </div>

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
                          Tool Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignedToolsList.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.staffName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.toolName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                              value={selectedStatus[item.id] || item.status}
                              onChange={(e) =>
                                handleStatusChange(item.id, e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                            >
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddToolModal
          isOpen={isAddToolModalOpen}
          onClose={() => setIsAddToolModalOpen(false)}
          onSuccess={() => {
            // Refresh your tools list or update counts
            fetchTools();
          }}
        />

        <EditToolModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTool(null);
          }}
          tool={selectedTool}
          onSuccess={handleEditSuccess}
          onError={handleEditError}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-white rounded-3xl w-[400px] p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "
                {selectedToolForDelete?.tool_name}"? This action cannot be
                undone.
              </p>
              {errors.delete && (
                <p className="text-red-500 text-sm mb-4">{errors.delete}</p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedToolForDelete(null);
                    setErrors({});
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        <SuccessModal
          isOpen={showModal}
          message={modalMessage}
          isError={isError}
          onClose={() => {
            setShowModal(false);
            setModalMessage('');
            setIsError(false);
          }}
        />
      </div>
    </div>
  );
};

export default StoreData;
