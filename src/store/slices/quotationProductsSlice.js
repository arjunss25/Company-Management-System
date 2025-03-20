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

export const addQuotationMaterial = createAsyncThunk(
  'quotationProducts/addQuotationMaterial',
  async (materialData, { rejectWithValue }) => {
    try {
      // Format the payload with snake_case keys to match API requirements
      const payload = {
        material_mode: materialData.material_mode,
        material_name: materialData.material_name,
        building_no: materialData.building_no,
        quantity: materialData.quantity,
        quotation: materialData.quotation,
        under: materialData.under,
        unit: materialData.unit,
      };

      console.log('Sending payload:', payload); // For debugging

      const response = await axiosInstance.post(
        '/add-quotation-materials/',
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Error response:', error.response?.data); // For debugging
      return rejectWithValue(
        error.response?.data || { message: 'Failed to add material' }
      );
    }
  }
);

// Add new thunk for fetching materials
export const fetchQuotationMaterials = createAsyncThunk(
  'quotationProducts/fetchMaterials',
  async (quotationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/list-quotation-materials/${quotationId}/`
      );
      console.log('Fetched materials:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch materials' }
      );
    }
  }
);

export const deleteQuotationProduct = createAsyncThunk(
  'quotationProducts/deleteQuotationProduct',
  async ({ quotationId, productId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/edit-delete-quotation-products/${quotationId}/${productId}/`
      );
      console.log('Delete product response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to delete product' }
      );
    }
  }
);

export const updateQuotationProduct = createAsyncThunk(
  'quotationProducts/updateQuotationProduct',
  async (
    { quotationId, productId, formData },
    { rejectWithValue, dispatch }
  ) => {
    try {
      console.log('=== Sending Update FormData to API ===');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axiosInstance.patch(
        `/edit-delete-quotation-products/${quotationId}/${productId}/`,
        formData
      );
      console.log('API Update Response:', response.data);

      // After successfully updating the product, fetch updated list
      if (quotationId) {
        dispatch(fetchQuotationProducts(quotationId));
      }

      return response.data;
    } catch (error) {
      console.log('API Update Error:', error);
      if (error.response) {
        console.log('Error Response:', error.response.data);
      }
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update product' }
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
    materials: [],
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
      })
      .addCase(addQuotationMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuotationMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materials.push(action.payload);
      })
      .addCase(addQuotationMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add cases for fetching materials
      .addCase(fetchQuotationMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchQuotationMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete product cases
      .addCase(deleteQuotationProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuotationProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteQuotationProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update product cases
      .addCase(updateQuotationProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuotationProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateQuotationProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quotationProductsSlice.reducer;
