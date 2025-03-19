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

// Add Terms and Conditions to Quotation
export const addQuotationTerms = async (payload) => {
  try {
    const response = await axiosInstance.patch(
      '/add-terms-paymentsapi/',
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error adding quotation terms:', error);
    throw error;
  }
};

// Add narration to quotation
export const addNarration = async (payload) => {
  try {
    const response = await axiosInstance.post('/add-narration/', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding narration:', error);
    throw error;
  }
};

// Get building numbers
export const getBuildingNumbers = async (quotationId) => {
  try {
    const response = await axiosInstance.get(`/list-building/${quotationId}/`);
    return response.data.data.building_numbers;
  } catch (error) {
    console.error('Error fetching building numbers:', error);
    throw error;
  }
};

// Add photo report
export const addPhotoReport = async (formData) => {
  try {
    const response = await axiosInstance.post('/add-photo-report/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding photo report:', error);
    throw error;
  }
};

// Edit material
export const editMaterial = async (materialId, quotationId, payload) => {
  try {
    const response = await axiosInstance.patch(
      `/edit-delete-materials/${quotationId}/${materialId}/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error editing material:', error);
    throw error;
  }
};

// Delete material
export const deleteMaterial = async (materialId, quotationId) => {
  try {
    const response = await axiosInstance.delete(
      `/edit-delete-materials/${quotationId}/${materialId}/`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};

// Edit photo report
export const editPhotoReport = async (reportId, quotationId, formData) => {
  try {
    const response = await axiosInstance.patch(
      `/edit-delete-photo-report/${quotationId}/${reportId}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing photo report:', error);
    throw error;
  }
};

// Delete photo report
export const deletePhotoReport = async (reportId, quotationId) => {
  try {
    const response = await axiosInstance.delete(
      `/edit-delete-photo-report/${quotationId}/${reportId}/`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting photo report:', error);
    throw error;
  }
};
// Get photo reports
export const getPhotoReports = async (quotationId) => {
  try {
    const response = await axiosInstance.get(
      `/list-photo-report/${quotationId}/`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching photo reports:', error);
    throw error;
  }
};

// Export photo report functions
export const exportPhotoReportPDF = async (quotationId) => {
  try {
    const response = await axiosInstance.get(
      `/export-quotation-photo-report/pdf/${quotationId}/`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error exporting photo report as PDF:', error);
    throw error;
  }
};

export const exportPhotoReportExcel = async (quotationId) => {
  try {
    const response = await axiosInstance.get(
      `/export-quotation-photo-report/excel/${quotationId}/`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error exporting photo report as Excel:', error);
    throw error;
  }
};

export const exportPhotoReportWord = async (quotationId) => {
  try {
    const response = await axiosInstance.get(
      `/export-quotation-photo-report/word/${quotationId}/`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error exporting photo report as Word:', error);
    throw error;
  }
};

// Attachment APIs
export const addAttachment = async (formData) => {
  try {
    const response = await axiosInstance.post('/add-attachment/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding attachment:', error);
    throw error;
  }
};

export const getAttachments = async (quotationId) => {
  try {
    const response = await axiosInstance.get(
      `/list-attachment/${quotationId}/`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching attachments:', error);
    throw error;
  }
};

export const editAttachment = async (quotationId, attachmentId, formData) => {
  try {
    const response = await axiosInstance.patch(
      `/edit-delete-attachments/${quotationId}/${attachmentId}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing attachment:', error);
    throw error;
  }
};

export const deleteAttachment = async (quotationId, attachmentId) => {
  try {
    const response = await axiosInstance.delete(
      `/edit-delete-attachments/${quotationId}/${attachmentId}/`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting attachment:', error);
    throw error;
  }
};
