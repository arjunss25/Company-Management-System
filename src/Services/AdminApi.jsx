import axiosInstance from '../Config/axiosInstance';

export const AdminApi = {
  getCompanyLogo: async () => {
    try {
      const response = await axiosInstance.get('/get-company-logo/');
      return response.data;
    } catch (error) {
      console.error('Error fetching company logo:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/get-profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  editProfile: async (formData) => {
    try {
      const response = await axiosInstance.patch('/edit-profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.patch(
        '/change-password/',
        passwordData
      );
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  addLocation: async (locationData) => {
    try {
      const response = await axiosInstance.post('/add-location/', {
        location_name: locationData,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  },

  listLocations: async () => {
    try {
      const response = await axiosInstance.get('/list-locations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  deleteLocation: async (locationId) => {
    try {
      const response = await axiosInstance.delete(
        `/edit-delete-location/${locationId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  },

  editLocation: async (locationId, locationData) => {
    try {
      const response = await axiosInstance.patch(
        `/edit-delete-location/${locationId}/`,
        { location_name: locationData }
      );
      return response.data;
    } catch (error) {
      console.error('Error editing location:', error);
      throw error;
    }
  },

  addMaterial: async (materialName) => {
    try {
      const response = await axiosInstance.post('/add-materials/', {
        name: materialName,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding material:', error);
      throw error;
    }
  },

  listMaterials: async () => {
    try {
      const response = await axiosInstance.get('/list-materials/');
      return response.data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  },

  editMaterial: async (materialId, materialName) => {
    try {
      const response = await axiosInstance.patch(
        `/edit-delete-materials/${materialId}/`,
        {
          name: materialName,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error editing material:', error);
      throw error;
    }
  },

  deleteMaterial: async (materialId) => {
    try {
      const response = await axiosInstance.delete(
        `/edit-delete-materials/${materialId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  },

  getMaterialsCount: async () => {
    try {
      const response = await axiosInstance.get('/materials-count/');
      return response.data;
    } catch (error) {
      console.error('Error fetching materials count:', error);
      throw error;
    }
  },

  addTool: async (toolData) => {
    try {
      const response = await axiosInstance.post('/add-tool/', {
        tool_name: toolData.tool_name,
        description: toolData.description,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding tool:', error);
      throw error;
    }
  },

  listTools: async () => {
    try {
      const response = await axiosInstance.get('/list-tool/');
      return response.data;
    } catch (error) {
      console.error('Error fetching tools:', error);
      throw error;
    }
  },

  editTool: async (toolId, toolData) => {
    try {
      const response = await axiosInstance.patch(
        `/edit-delete-tool/${toolId}/`,
        {
          tool_name: toolData.tool_name,
          description: toolData.description,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating tool:', error);
      throw error;
    }
  },

  deleteTool: async (toolId) => {
    try {
      const response = await axiosInstance.delete(
        `/edit-delete-tool/${toolId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting tool:', error);
      throw error;
    }
  },

  listStaffRole: async () => {
    try {
      const response = await axiosInstance.get('/list-staff-role/');
      return response.data;
    } catch (error) {
      console.error('Error fetching staff list:', error);
      throw error;
    }
  },

  searchStaffAssignments: async (searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/search-staff-assignments/${searchTerm}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching staff assignments:', error);
      throw error;
    }
  },

  assignToolsToStaff: async (staffId, toolIds) => {
    try {
      const response = await axiosInstance.post('/assign-tools-to-staff/', {
        staff_name: staffId,
        tools: toolIds,
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning tools to staff:', error);
      throw error;
    }
  },

  listAssignedTools: async () => {
    try {
      const response = await axiosInstance.get('/assigned-tools-list/');
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned tools list:', error);
      throw error;
    }
  },

  updateAssignStatus: async (assignmentId, status) => {
    try {
      const response = await axiosInstance.patch(
        `/update-assign-status/${assignmentId}/`,
        {
          assign_status: status,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating assignment status:', error);
      throw error;
    }
  },

  searchToolAssignments: async (searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/search-tool-assignments/${searchTerm}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching tool assignments:', error);
      return {
        status: 'Failed',
        message: 'No assignments found',
        data: [],
      };
    }
  },

  deleteAssignment: async (assignmentId) => {
    try {
      const response = await axiosInstance.delete(
        `/delete-assignment/${assignmentId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },
};
