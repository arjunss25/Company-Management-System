import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companiesReducer from '../Redux/SuperAdminSlice/companiesSlice';
import rateCardReducer from './slices/rateCardSlice';
import quotationProductsReducer from './slices/quotationProductsSlice';
import quotationReducer from './slices/quotationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    companies: companiesReducer,
    rateCard: rateCardReducer,
    quotationProducts: quotationProductsReducer,
    quotation: quotationReducer,
  },
});

export default store;
