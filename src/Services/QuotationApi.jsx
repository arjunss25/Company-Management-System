import axiosInstance from '../Config/axiosInstance';


// quotation number generation
export const generateQuotationNumber = async () => {
  try {
    const response = await axiosInstance.get('/generate-quotation-no/');
    return response.data.data; 
  } catch (error) {
    console.error('Error generating quotation number:', error);
    throw error;
  }
};

// project-manager get
export const getSalesPersons = async () => {
    try {
      const response = await axiosInstance.get('/list-sales-person/');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching sales persons:', error);
      throw error;
    }
  };


// job no
export const generateJobNumber = async (pmId) => {
    try {
      const response = await axiosInstance.get(`/generate-job-no/${pmId}/`);
      return response.data.data;
    } catch (error) {
      console.error('Error generating job number:', error);
      throw error;
    }
  };


// client list
export const getClients = async () => {
  try {
    const response = await axiosInstance.get('/clientGet/');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

// location list
export const getLocations = async () => {
  try {
    const response = await axiosInstance.get('/list-locations/');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

// attention to list
export const getAttentions = async (clientId) => {
  try {
    const response = await axiosInstance.get(`/list-attentions-applicable/${clientId}/`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching attentions:', error);
    throw error;
  }
};