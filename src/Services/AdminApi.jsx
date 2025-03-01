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
};
