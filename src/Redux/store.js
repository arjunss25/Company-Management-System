import { configureStore } from '@reduxjs/toolkit';
import companiesReducer from './SuperAdminSlice/companiesSlice';

export const store = configureStore({
  reducer: {
    companies: companiesReducer,
  },
});

export default store; 