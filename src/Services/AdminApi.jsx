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

  // terms & conditions

  addTermsAndConditions: async (termsData) => {
    try {
      const response = await axiosInstance.post('/add-termsandconditions/', {
        title: termsData.title,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding terms and conditions:', error);
      throw error;
    }
  },

  listTermsAndConditions: async () => {
    try {
      const response = await axiosInstance.get('/list-termsandcondition/');
      return response.data;
    } catch (error) {
      console.error('Error fetching terms and conditions:', error);
      throw error;
    }
  },

  editTermsAndConditions: async (termId, title) => {
    try {
      const response = await axiosInstance.patch(
        `/edit-delete-terms/${termId}/`,
        {
          title: title,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating terms and conditions:', error);
      throw error;
    }
  },

  deleteTermsAndConditions: async (termId) => {
    try {
      const response = await axiosInstance.delete(
        `/edit-delete-terms/${termId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting terms and conditions:', error);
      throw error;
    }
  },

  // Payment Terms API endpoints
  addPaymentTerms: async (termsData) => {
    try {
      const response = await axiosInstance.post('/paymentCreate/', {
        name: termsData.title,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding payment terms:', error);
      throw error;
    }
  },

  listPaymentTerms: async () => {
    try {
      const response = await axiosInstance.get('/paymentGet/');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment terms:', error);
      throw error;
    }
  },

  editPaymentTerms: async (termId, title) => {
    try {
      const response = await axiosInstance.patch(`/payment-edit/${termId}/`, {
        name: title,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating payment terms:', error);
      throw error;
    }
  },

  deletePaymentTerms: async (termId) => {
    try {
      const response = await axiosInstance.delete(`/payment-delete/${termId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting payment terms:', error);
      throw error;
    }
  },

  // Completion and Delivery Terms API endpoints
  addCompletionTerms: async (termsData) => {
    try {
      const response = await axiosInstance.post('/completioncreateget/', {
        delivery: termsData.title,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding completion terms:', error);
      throw error;
    }
  },

  listCompletionTerms: async () => {
    try {
      const response = await axiosInstance.get('/completioncreateget/');
      return response.data;
    } catch (error) {
      console.error('Error fetching completion terms:', error);
      throw error;
    }
  },

  editCompletionTerms: async (termId, title) => {
    try {
      const response = await axiosInstance.patch(`/completionedit/${termId}/`, {
        delivery: title,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating completion terms:', error);
      throw error;
    }
  },

  deleteCompletionTerms: async (termId) => {
    try {
      const response = await axiosInstance.delete(
        `/completiondelete/${termId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting completion terms:', error);
      throw error;
    }
  },

  // Quotation Validity Terms API endpoints
  addQuotationTerms: async (termsData) => {
    try {
      const response = await axiosInstance.post('/quotationpostget/', {
        validity: termsData.title,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding quotation validity terms:', error);
      throw error;
    }
  },

  listQuotationTerms: async () => {
    try {
      const response = await axiosInstance.get('/quotationpostget/');
      return response.data;
    } catch (error) {
      console.error('Error fetching quotation validity terms:', error);
      throw error;
    }
  },

  editQuotationTerms: async (termId, title) => {
    try {
      const response = await axiosInstance.patch(
        `/quotation-edit-delete/${termId}/`,
        {
          validity: title,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating quotation validity terms:', error);
      throw error;
    }
  },

  deleteQuotationTerms: async (termId) => {
    try {
      const response = await axiosInstance.delete(
        `/quotation-edit-delete/${termId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting quotation validity terms:', error);
      throw error;
    }
  },

  // Warranty Terms API endpoints
  addWarrantyTerms: async (termsData) => {
    try {
      const response = await axiosInstance.post('/warrantypost/', {
        warranty: termsData.title,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding warranty terms:', error);
      throw error;
    }
  },

  listWarrantyTerms: async () => {
    try {
      const response = await axiosInstance.get('/warrantypost/');
      return response.data;
    } catch (error) {
      console.error('Error fetching warranty terms:', error);
      throw error;
    }
  },

  editWarrantyTerms: async (termId, title) => {
    try {
      const response = await axiosInstance.patch(
        `/warrantyeditdelete/${termId}/`,
        {
          warranty: title,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating warranty terms:', error);
      throw error;
    }
  },

  deleteWarrantyTerms: async (termId) => {
    try {
      const response = await axiosInstance.delete(
        `/warrantyeditdelete/${termId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting warranty terms:', error);
      throw error;
    }
  },

  // Terms and Conditions Count APIs
  getGeneralTermsCount: async () => {
    try {
      const response = await axiosInstance.get('/count-termsandcondition/');
      return response.data;
    } catch (error) {
      console.error('Error fetching general terms count:', error);
      throw error;
    }
  },

  getPaymentTermsCount: async () => {
    try {
      const response = await axiosInstance.get('/payment-count/');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment terms count:', error);
      throw error;
    }
  },

  getWarrantyTermsCount: async () => {
    try {
      const response = await axiosInstance.get('/warranty-count/');
      return response.data;
    } catch (error) {
      console.error('Error fetching warranty terms count:', error);
      throw error;
    }
  },

  getQuotationTermsCount: async () => {
    try {
      const response = await axiosInstance.get('/quotation-count/');
      return response.data;
    } catch (error) {
      console.error('Error fetching quotation terms count:', error);
      throw error;
    }
  },

  getCompletionTermsCount: async () => {
    try {
      const response = await axiosInstance.get('/completion-count/');
      return response.data;
    } catch (error) {
      console.error('Error fetching completion terms count:', error);
      throw error;
    }
  },

  // Client Management APIs
  getClientList: async () => {
    try {
      const response = await axiosInstance.get('/clientGet/');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  updateClient: async (clientId, clientData) => {
    try {
      const response = await axiosInstance.patch(
        `/client-update/${clientId}/`,
        {
          company_id: clientData.company_id,
          clientName: clientData.clientName,
          address: clientData.address,
          terms: clientData.terms,
          payment: clientData.payment,
          attentions: clientData.attentions.map((att) => ({
            id: att.id,
            name: att.name,
          })),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  createClient: async (clientData) => {
    try {
      const response = await axiosInstance.post('/clientCreate/', {
        clientName: clientData.clientName,
        address: clientData.address,
        terms: clientData.termsAndConditions,
        payment: clientData.paymentTerms,
        attentions: clientData.attention.map((name) => ({ name })),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  deleteClient: async (clientId) => {
    try {
      const response = await axiosInstance.delete(
        `/client-delete/${clientId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Add searchTerms function
  searchTerms: async (searchTerm) => {
    try {
      const response = await axiosInstance.get(`/search-terms/${searchTerm}/`);
      return response.data;
    } catch (error) {
      console.error('Error searching terms:', error);
      throw error;
    }
  },

  // Add searchPaymentTerms function
  searchPaymentTerms: async (searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `/search-payment/${searchTerm}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching payment terms:', error);
      throw error;
    }
  },

  // Rate Card APIs
  addRateCard: async (rateCardData) => {
    try {
      const response = await axiosInstance.post('/add-ratecard/', rateCardData);
      return response.data;
    } catch (error) {
      console.error('Error adding rate card:', error);
      throw error;
    }
  },

  listRateCards: async () => {
    try {
      const response = await axiosInstance.get(
        '/list-ratecard/'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching rate cards:', error);
      throw error;
    }
  },

  editRateCard: async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `/edit-delete-ratecard/${id}/`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error editing rate card:', error);
      throw error;
    }
  },

  deleteRateCard: async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/edit-delete-ratecard/${id}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting rate card:', error);
      throw error;
    }
  },
};
