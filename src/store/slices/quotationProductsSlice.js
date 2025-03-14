import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Config/axiosInstance';

export const addQuotationProduct = createAsyncThunk(
  'quotationProducts/addQuotationProduct',
  async (formData, { rejectWithValue }) => {
    try {
      console.log('=== Sending FormData to API ===');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Don't set headers here, let the interceptor handle it
      const response = await axiosInstance.post(
        '/add-quotation-product/',
        formData
      );

      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.log('API Error:', error);
      if (error.response) {
        console.log('Error Response:', error.response.data);
      }
      return rejectWithValue(
        error.response?.data || { message: 'Failed to add product' }
      );
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
        state.error = null;
      })
      .addCase(addQuotationProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addQuotationProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quotationProductsSlice.reducer;
