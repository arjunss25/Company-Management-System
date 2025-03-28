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

  searchCompanies: async (searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/search-company/${searchTerm}/`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    try {
      const headers =
        data instanceof FormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' };

      const response = await axiosInstance.patch(
        `/edit-delete-company/${id}/`,
        data,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCompany: async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/edit-delete-company/${id}/`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  registerStaff: async (formData) => {
    try {
      const response = await axiosInstance.post('/register-staff/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (data) => {
    try {
      const response = await axiosInstance.post('/otp-verify/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resendOtp: async (data) => {
    try {
      const response = await axiosInstance.post('/otp-resend/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStaffList: async () => {
    try {
      const response = await axiosInstance.get('/StaffList/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStaffListByCompany: async (companyId) => {
    try {
      const response = await axiosInstance.get(
        `/list-staffs-by-company/${companyId}/`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteStaff: async (staffId, companyId) => {
    try {
      const response = await axiosInstance.delete(
        `/edit-delete-staff/${staffId}/`,
        {
          data: { company_id: companyId },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editStaff: async (staffId, formData) => {
    try {
      console.log('API Call Details:');
      console.log('Staff ID:', staffId);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axiosInstance.patch(
        `/edit-delete-staff/${staffId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      throw error;
    }
  },

  changeStaffPassword: async (passwordData) => {
    try {
      const response = await axiosInstance.patch(
        '/staff-change-password/',
        passwordData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCompanyCount: async () => {
    try {
      const response = await axiosInstance.get('/company-count/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generateCompanyTokens: async (companyId) => {
    try {
      const response = await axiosInstance.post('/generate-company-tokens/', {
        company_id: companyId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default SuperadminApi;
