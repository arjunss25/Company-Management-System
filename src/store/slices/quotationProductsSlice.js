import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Config/axiosInstance';

export const addQuotationProduct = createAsyncThunk(
  'quotationProducts/addProduct',
  async (productData, { getState }) => {
    try {
      console.log('Creating FormData for API submission...');
      const formData = new FormData();
      
      // Define all required fields
      const fields = [
        'quotation',
        'heading',
        'description',
        'unit',
        'quantity',
        'unit_price',
        'amount',
        'grand_total',
        'option',
        'brand',
        'location',
        'item_code',
        'work_order_number',
        'reference_number'
      ];

      // Add regular fields to FormData
      fields.forEach(field => {
        const value = productData[field] || '';
        formData.append(field, value);
        console.log(`Adding to FormData - ${field}: "${value}"`);
      });

      // Handle photo separately
      if (productData.photo) {
        formData.append('photo', productData.photo);
        console.log('Adding to FormData - photo:', productData.photo.name);
      } else {
        formData.append('photo', '');
        console.log('Adding to FormData - photo: empty');
      }

      // Verify FormData contents before sending
      console.log('Verifying FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (key === 'photo' && value instanceof File) {
          console.log(`${key}: File - ${value.name}`);
        } else {
          console.log(`${key}: "${value}"`);
        }
      }

      console.log('Sending API request to add quotation product...');
      const response = await axiosInstance.post('/add-quotation-product/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      console.error('Error Response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to add product');
    }
  }
);

const quotationProductsSlice = createSlice({
  name: 'quotationProducts',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addQuotationProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addQuotationProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addQuotationProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default quotationProductsSlice.reducer; 