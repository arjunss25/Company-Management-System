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
};
