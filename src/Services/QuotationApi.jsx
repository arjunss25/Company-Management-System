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
export const getAttentionsApplicable = async (clientId) => {
  try {
    const response = await axiosInstance.get(
      `/list-attentions-applicable/${clientId}/`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching attentions:', error);
    throw error;
  }
};

// site in charge list
export const getStaffList = async () => {
  try {
    const response = await axiosInstance.get('/list-staffs/');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching staff list:', error);
    throw error;
  }
};

// wcr attachment
export const uploadWCRAttachment = async (quotationNo, wcrAttachment) => {
  try {
    const formData = new FormData();
    formData.append('quotation_no', quotationNo);
    formData.append('wcr_attachment', wcrAttachment);

    const response = await axiosInstance.post('/upload-wcr/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// register sales person
export const registerStaff = async (formData) => {
  try {
    const response = await axiosInstance.post(
      '/register-staff-by-admin/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error registering staff:', error);
    throw error;
  }
};

// work details form submission
export const addQuotationWorkDetails = async (payload) => {
  try {
    const response = await axiosInstance.post(
      '/add-quotation-work-details/',
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error adding quotation work details:', error);
    throw error;
  }
};

// Get units list
export const getUnits = async () => {
  try {
    const response = await axiosInstance.get('/list-units/');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching units:', error);
    throw error;
  }
};

// Quotation Validity Terms
export const listQuotationValidityTerms = async () => {
  try {
    const response = await axiosInstance.get('/quotationpostget/');
    return response.data;
  } catch (error) {
    console.error('Error fetching quotation validity terms:', error);
    throw error;
  }
};

export const addQuotationValidityTerm = async (validityTerm) => {
  try {
    const response = await axiosInstance.post('/quotationpostget/', {
      validity: validityTerm,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding quotation validity term:', error);
    throw error;
  }
};

// Warranty Terms
export const listWarrantyTerms = async () => {
  try {
    const response = await axiosInstance.get('/warrantypost/');
    return response.data;
  } catch (error) {
    console.error('Error fetching warranty terms:', error);
    throw error;
  }
};

export const addWarrantyTerm = async (warrantyTerm) => {
  try {
    const response = await axiosInstance.post('/warrantypost/', {
      warranty: warrantyTerm,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding warranty term:', error);
    throw error;
  }
};

// Get materials list
export const getMaterialsList = async () => {
  try {
    const response = await axiosInstance.get('/list-materials/');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching materials list:', error);
    throw error;
  }
};
