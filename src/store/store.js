import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companiesReducer from '../Redux/SuperAdminSlice/companiesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    companies: companiesReducer,
  },
});

export default store;
