import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SuperadminApi } from '../../Services/SuperadminApi';

// Async thunks
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await SuperadminApi.getCompanyList();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch companies');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // data is now expected to be FormData
      const response = await SuperadminApi.updateCompany(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update company');
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id, { rejectWithValue }) => {
    try {
      await SuperadminApi.deleteCompany(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete company');
    }
  }
);

export const searchCompanies = createAsyncThunk(
  'companies/searchCompanies',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await SuperadminApi.searchCompanies(searchTerm);
      return response.data;
    } catch (error) {
      // Check if it's a 404 "Not Found" error
      if (error.response?.status === 404) {
        // Return empty array instead of rejecting
        return [];
      }
      return rejectWithValue(error.response?.data || 'Failed to search companies');
    }
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState: {
    items: [],
    status: 'idle', 
    error: null,
    selectedCompany: null,
  },
  reducers: {
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update Company
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (company) => company.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      // Delete Company
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (company) => company.id !== action.payload
        );
        state.error = null;
      })
      // Search Companies
      .addCase(searchCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // If the response is an empty array (no results found), keep the status as succeeded
        state.items = action.payload;
        state.error = null;
      })
      .addCase(searchCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedCompany } = companiesSlice.actions;
export default companiesSlice.reducer; 