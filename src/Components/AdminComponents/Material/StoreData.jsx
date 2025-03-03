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
  const [selectedTool, setSelectedTool] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedToolForDelete, setSelectedToolForDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [staffError, setStaffError] = useState(null);
  const [assignedToolsList, setAssignedToolsList] = useState([]);
  const [loadingAssignedTools, setLoadingAssignedTools] = useState(false);
  const [assignedToolsError, setAssignedToolsError] = useState(null);
  const [savingStatus, setSavingStatus] = useState({});
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Add fetchStaffList function
  const fetchStaffList = async () => {
    setIsLoadingStaff(true);
    setStaffError(null);
    try {
      const response = await AdminApi.listStaffRole();
      if (response.status === 'Success') {
        // Map the response data to include id property
        const mappedStaffList = response.data.map((staff) => ({
          ...staff,
          id: staff.id, // Using the actual staff ID instead of username
        }));
        setStaffList(mappedStaffList || []);
      } else {
        throw new Error(response.message || 'Failed to fetch staff list');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaffError(error.message || 'Failed to fetch staff list');
    } finally {
      setIsLoadingStaff(false);
    }
  };

  // Add searchStaff function
  const searchStaff = async (searchTerm) => {
    if (!searchTerm.trim()) {
      await fetchStaffList();
      return;
    }

    setIsLoadingStaff(true);
    setStaffError(null);
    try {
      const response = await AdminApi.searchStaffAssignments(searchTerm.trim());
      if (response.status === 'Success') {
        if (response.data && response.data.length > 0) {
          // Map the response data to include id property
          const mappedStaffList = response.data.map((staff) => ({
            ...staff,
            id: staff.id, // Using the actual staff ID instead of username
          }));
          setStaffList(mappedStaffList);
        } else {
          setStaffList([]);
          setStaffError(`No staff found matching "${searchTerm}"`);
        }
      } else {
        setStaffList([]);
        setStaffError('No results found');
      }
    } catch (error) {
      console.error('Error searching staff:', error);
      setStaffError('Failed to search staff. Please try again.');
      setStaffList([]);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  // Add filter function for tools
  const filteredTools = toolsList.filter((tool) =>
    (tool.tool_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = staffList.filter((staff) =>
    (staff.staff_name || '')
      .toLowerCase()
      .includes(staffSearchTerm.toLowerCase())
  );

  // Add these status options
  const statusOptions = [
    { value: '', label: 'Select' },
    { value: 'Temporary Hold', label: 'Temporary Hold' },
    { value: 'Permanent Return', label: 'Permanent Return' },
  ];

  useEffect(() => {
    fetchTools();
    fetchStaffList();
    fetchAssignedTools();
  }, []);

  // Update the debounce effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (staffSearchTerm.trim().length > 0) {
        searchStaff(staffSearchTerm);
      } else {
        fetchStaffList(); // Fetch all staff if search term is empty
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [staffSearchTerm]);

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
          setModalMessage(response.message || 'Tool added successfully!');
          setIsError(false);
          setShowModal(true);
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
        setModalMessage(
          error.message || 'Failed to add tool. Please try again.'
        );
        setIsError(true);
        setShowModal(true);
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

  const handleStatusChange = async (assignmentId, status) => {
    setSelectedAssignment(assignmentId);
    setNewStatus(status);
    setShowStatusConfirmModal(true);
  };

  const handleStatusConfirm = async () => {
    if (!selectedAssignment || !newStatus) return;

    setSavingStatus((prev) => ({ ...prev, [selectedAssignment]: true }));
    try {
      const response = await AdminApi.updateAssignStatus(
        selectedAssignment,
        newStatus
      );
      if (response.status === 'Success') {
        setModalMessage('Status updated successfully!');
        setIsError(false);
        setShowModal(true);
        await fetchAssignedTools(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      setModalMessage(
        error.message || 'Failed to update status. Please try again.'
      );
      setIsError(true);
      setShowModal(true);
    } finally {
      setSavingStatus((prev) => ({ ...prev, [selectedAssignment]: false }));
      setShowStatusConfirmModal(false);
      setSelectedAssignment(null);
      setNewStatus('');
    }
  };

  // Add new function to handle tool selection
  const handleToolSelection = (toolId) => {
    setSelectedTools((prev) => {
      if (prev.includes(toolId)) {
        return prev.filter((id) => id !== toolId);
      }
      return [...prev, toolId];
    });
  };

  // Add function to handle form submission
  const handleAssignTools = async (e) => {
    e.preventDefault();
    if (!selectedStaff || selectedTools.length === 0) {
      setModalMessage('Please select both staff and at least one tool');
      setIsError(true);
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);
      const response = await AdminApi.assignToolsToStaff(
        selectedStaff,
        selectedTools
      );
      if (response.status === 'Success') {
        // Reset form first
        setSelectedStaff('');
        setSelectedTools([]);
        setSearchTerm('');
        setStaffSearchTerm('');
        setIsDropdownOpen(false);
        setIsStaffDropdownOpen(false);

        // Show success message
        setModalMessage('Tools assigned successfully!');
        setIsError(false);
        setShowModal(true);

        // Refresh both lists
        await Promise.all([fetchTools(), fetchAssignedTools()]);
      } else {
        throw new Error(response.message || 'Failed to assign tools');
      }
    } catch (error) {
      console.error('Error assigning tools:', error);
      setModalMessage(
        error.message || 'Failed to assign tools. Please try again.'
      );
      setIsError(true);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setModalMessage('');
    setIsError(false);
  };

  // Add fetchAssignedTools function
  const fetchAssignedTools = async () => {
    setLoadingAssignedTools(true);
    setAssignedToolsError(null);
    try {
      const response = await AdminApi.listAssignedTools();
      if (response.status === 'Success') {
        setAssignedToolsList(response.data || []);
        // Initialize selected status from data
        const initialStatus = {};
        response.data.forEach((item) => {
          initialStatus[item.id] = item.assign_status || '';
        });
        setSelectedStatus(initialStatus);
      } else {
        throw new Error(response.message || 'Failed to fetch assigned tools');
      }
    } catch (error) {
      console.error('Error fetching assigned tools:', error);
      setAssignedToolsError(
        error.message || 'Failed to fetch assigned tools list'
      );
    } finally {
      setLoadingAssignedTools(false);
    }
  };

  // Update the search function
  const handleSearch = async () => {
    if (!selectedStaff || !selectedTool) {
      setModalMessage('Please select both staff and tool to search');
      setIsError(true);
      setShowModal(true);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      // Format the search term exactly as required by the API
      const searchTerm = `${selectedStaff}/${selectedTool}`;
      console.log('Search term:', searchTerm); // Debug log

      const response = await AdminApi.searchToolAssignments(searchTerm);
      console.log('API response:', response); // Debug log

      if (response.status === 'Success') {
        // Update the table with search results
        setAssignedToolsList(response.data || []);

        // Initialize selected status from search results
        const initialStatus = {};
        response.data.forEach((item) => {
          initialStatus[item.id] = item.assign_status || '';
        });
        setSelectedStatus(initialStatus);
      } else {
        throw new Error(response.message || 'Failed to search assignments');
      }
    } catch (error) {
      console.error('Error searching assignments:', error);
      setSearchError(error.message || 'Failed to search assignments');
      // Clear the list on error
      setAssignedToolsList([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Update the staff and tool selection handlers
  const handleStaffSelect = (e) => {
    const staffName = e.target.value;
    console.log('Selected staff:', staffName); // Debug log
    setSelectedStaff(staffName);
    // Clear previous results when selection changes
    setAssignedToolsList([]);
    setSearchError(null);
  };

  const handleToolSelect = (e) => {
    const toolName = e.target.value;
    console.log('Selected tool:', toolName); // Debug log
    setSelectedTool(toolName);
    // Clear previous results when selection changes
    setAssignedToolsList([]);
    setSearchError(null);
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
                <form onSubmit={handleAssignTools} className="space-y-6">
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
                            ? staffList.find((s) => s.id === selectedStaff)
                                ?.staff_name || 'Select Staff'
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
                          <div className="p-2 border-b relative">
                            <input
                              type="text"
                              placeholder="Search staff..."
                              value={staffSearchTerm}
                              onChange={(e) =>
                                setStaffSearchTerm(e.target.value)
                              }
                              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-600 pr-8"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              onClick={() => {
                                setIsStaffDropdownOpen(false);
                                setStaffSearchTerm('');
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <svg
                                className="w-5 h-5 text-gray-500"
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
                            </button>
                          </div>
                          <div className="max-h-48 overflow-y-auto bg-white">
                            {isLoadingStaff ? (
                              <div className="px-4 py-2 text-gray-500 flex items-center justify-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-2 text-blue-500"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                <span>Searching staff...</span>
                              </div>
                            ) : staffError ? (
                              <div className="p-4 text-center">
                                <div className="text-gray-400 mb-2">
                                  <svg
                                    className="w-12 h-12 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M20 12H4M8 16l-4-4 4-4"
                                    />
                                  </svg>
                                </div>
                                <p className="text-gray-600">{staffError}</p>
                                {staffSearchTerm && (
                                  <button
                                    onClick={() => {
                                      setStaffSearchTerm('');
                                      fetchStaffList();
                                    }}
                                    className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                                  >
                                    Clear search and show all staff
                                  </button>
                                )}
                              </div>
                            ) : staffList.length === 0 ? (
                              <div className="p-4 text-center">
                                <div className="text-gray-400 mb-2">
                                  <svg
                                    className="w-12 h-12 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-gray-600">
                                  No staff members found
                                </p>
                                <button
                                  onClick={() => {
                                    setStaffSearchTerm('');
                                    fetchStaffList();
                                  }}
                                  className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                                >
                                  Show all staff
                                </button>
                              </div>
                            ) : (
                              staffList.map((staff) => (
                                <div
                                  key={staff.id}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-700"
                                  onClick={() => {
                                    setSelectedStaff(staff.id);
                                    setIsStaffDropdownOpen(false);
                                    setStaffSearchTerm('');
                                  }}
                                >
                                  <div className="flex items-center space-x-3">
                                    {staff.image && (
                                      <img
                                        src={staff.image}
                                        alt={staff.staff_name}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                    )}
                                    <div>
                                      <div className="font-medium">
                                        {staff.staff_name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {staff.role}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
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
                            ? `${selectedTools.length} tool${
                                selectedTools.length > 1 ? 's' : ''
                              } selected`
                            : 'Select Tools'}
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

                      {/* Selected Tools Display */}
                      {selectedTools.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedTools.map((toolId) => {
                            const tool = toolsList.find((t) => t.id === toolId);
                            return tool ? (
                              <div
                                key={tool.id}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                              >
                                <span>{tool.tool_name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleToolSelection(tool.id)}
                                  className="hover:text-blue-900"
                                >
                                  <svg
                                    className="w-4 h-4"
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
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      {isDropdownOpen && (
                        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100]">
                          <div className="p-2 border-b relative">
                            <input
                              type="text"
                              placeholder="Search tools..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-600 pr-8"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setSearchTerm('');
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <svg
                                className="w-5 h-5 text-gray-500"
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
                            </button>
                          </div>
                          <div className="max-h-48 overflow-y-auto bg-white">
                            {isLoading ? (
                              <div className="px-4 py-2 text-gray-500 flex items-center justify-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-2 text-blue-500"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                <span>Loading tools...</span>
                              </div>
                            ) : listError ? (
                              <div className="p-4 text-center">
                                <div className="text-gray-400 mb-2">
                                  <svg
                                    className="w-12 h-12 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M20 12H4M8 16l-4-4 4-4"
                                    />
                                  </svg>
                                </div>
                                <p className="text-gray-600">{listError}</p>
                                <button
                                  onClick={() => {
                                    setSearchTerm('');
                                    fetchTools();
                                  }}
                                  className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                                >
                                  Retry loading tools
                                </button>
                              </div>
                            ) : filteredTools.length === 0 ? (
                              <div className="p-4 text-center">
                                <div className="text-gray-400 mb-2">
                                  <svg
                                    className="w-12 h-12 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-gray-600">
                                  {searchTerm
                                    ? `No tools found matching "${searchTerm}"`
                                    : 'No tools available'}
                                </p>
                                {searchTerm && (
                                  <button
                                    onClick={() => {
                                      setSearchTerm('');
                                      fetchTools();
                                    }}
                                    className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                                  >
                                    Show all tools
                                  </button>
                                )}
                              </div>
                            ) : (
                              filteredTools.map((tool) => (
                                <div
                                  key={tool.id}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-700"
                                  onClick={() => {
                                    handleToolSelection(tool.id);
                                    setSearchTerm('');
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                                        <FaTools className="h-4 w-4 text-blue-500" />
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          {tool.tool_name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                          {tool.description}
                                        </div>
                                      </div>
                                    </div>
                                    {selectedTools.includes(tool.id) && (
                                      <svg
                                        className="w-5 h-5 text-blue-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Assigning...
                      </div>
                    ) : (
                      'Assign Tools'
                    )}
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
                        <select
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                          value={selectedStaff}
                          onChange={handleStaffSelect}
                        >
                          <option value="">Select Staff</option>
                          {staffList.map((staff) => (
                            <option key={staff.id} value={staff.staff_name}>
                              {staff.staff_name}
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
                        <select
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                          value={selectedTool}
                          onChange={handleToolSelect}
                        >
                          <option value="">Select Tool</option>
                          {toolsList.map((tool) => (
                            <option key={tool.id} value={tool.tool_name}>
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
                      <button
                        onClick={handleSearch}
                        disabled={searchLoading}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {searchLoading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Searching...
                          </>
                        ) : (
                          'Search'
                        )}
                      </button>
                    </div>
                  </div>
                  {searchError && (
                    <div className="text-red-500 text-sm mt-2">
                      {searchError}
                    </div>
                  )}
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
                      {loadingAssignedTools ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center">
                              <svg
                                className="animate-spin h-5 w-5 mr-2 text-blue-500"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Loading assigned tools...
                            </div>
                          </td>
                        </tr>
                      ) : assignedToolsError ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-red-500"
                          >
                            {assignedToolsError}
                            <button
                              onClick={fetchAssignedTools}
                              className="ml-2 text-blue-500 hover:text-blue-700 underline"
                            >
                              Retry
                            </button>
                          </td>
                        </tr>
                      ) : assignedToolsList.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No assigned tools found
                          </td>
                        </tr>
                      ) : (
                        assignedToolsList.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.staff_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.tool_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.tool_description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                value={selectedStatus[item.id] || ''}
                                onChange={(e) =>
                                  handleStatusChange(item.id, e.target.value)
                                }
                                disabled={savingStatus[item.id]}
                              >
                                <option value="">Select Status</option>
                                <option value="Temporary Hold">
                                  Temporary Hold
                                </option>
                                <option value="Permanent Return">
                                  Permanent Return
                                </option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
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
          onClose={handleModalClose}
        />

        {/* Status Change Confirmation Modal */}
        {showStatusConfirmModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-white rounded-3xl w-[400px] p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Status Change
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to change the status to "
                {newStatus === 'Temporary Hold'
                  ? 'Temporary Hold'
                  : 'Permanent Return'}
                "?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowStatusConfirmModal(false);
                    setSelectedAssignment(null);
                    setNewStatus('');
                    // Reset the select value
                    setSelectedStatus((prev) => ({
                      ...prev,
                      [selectedAssignment]: '',
                    }));
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusConfirm}
                  disabled={savingStatus[selectedAssignment]}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {savingStatus[selectedAssignment] ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreData;
