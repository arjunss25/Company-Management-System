import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companiesReducer from '../Redux/SuperAdminSlice/companiesSlice';
import rateCardReducer from './slices/rateCardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    companies: companiesReducer,
    rateCard: rateCardReducer,
  },
});

export default store;
