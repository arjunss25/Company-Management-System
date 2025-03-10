import axiosInstance from '../Config/axiosInstance';

export const generateQuotationNumber = async () => {
  try {
    const response = await axiosInstance.get('/generate-quotation-no/');
    return response.data.data; 
  } catch (error) {
    console.error('Error generating quotation number:', error);
    throw error;
  }
};