import axiosInstance from '../Config/axiosInstance';

export const SuperadminApi = {
  registerCompany: async (formData) => {
    try {
      const response = await axiosInstance.post(
        '/register-company/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCompanyList: async () => {
    try {
      const response = await axiosInstance.get('/register-company/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`/edit-delete-company/${id}/`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCompany: async (id) => {
    try {
      const response = await axiosInstance.delete(`/edit-delete-company/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default SuperadminApi;
