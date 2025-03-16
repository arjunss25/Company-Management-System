import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Config/axiosInstance';

// Add new thunk for fetching products
export const fetchQuotationProducts = createAsyncThunk(
  'quotationProducts/fetchProducts',
  async (quotationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/list-quotation-product/${quotationId}/`
      );
      console.log('Fetched products:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch products' }
      );
    }
  }
);

export const addQuotationProduct = createAsyncThunk(
  'quotationProducts/addQuotationProduct',
  async (formData, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log('=== Sending FormData to API ===');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axiosInstance.post(
        '/add-quotation-product/',
        formData
      );
      console.log('API Response:', response.data);

      // After successfully adding the product, fetch updated list
      const quotationId = formData.get('quotation');
      if (quotationId) {
        dispatch(fetchQuotationProducts(quotationId));
      }

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
    products: [], // Will store the array of option groups
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Product cases
      .addCase(addQuotationProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuotationProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addQuotationProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Products cases
      .addCase(fetchQuotationProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Store the array of option groups
      })
      .addCase(fetchQuotationProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quotationProductsSlice.reducer;
