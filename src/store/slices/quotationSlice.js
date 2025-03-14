import { createSlice } from '@reduxjs/toolkit';

const quotationSlice = createSlice({
  name: 'quotation',
  initialState: {
    id: null,
    quotationNo: null
  },
  reducers: {
    setQuotationDetails: (state, action) => {
      state.id = action.payload.id;
      state.quotationNo = action.payload.quotationNo;
    },
  },
});

export const { setQuotationDetails } = quotationSlice.actions;
export const selectQuotationId = (state) => state.quotation.id;
export default quotationSlice.reducer; 