import { createSlice } from '@reduxjs/toolkit';

const rateCardSlice = createSlice({
  name: 'rateCard',
  initialState: {
    selectedRateCard: null,
  },
  reducers: {
    setSelectedRateCard: (state, action) => {
      state.selectedRateCard = action.payload;
    },
    clearSelectedRateCard: (state) => {
      state.selectedRateCard = null;
    },
  },
});

export const { setSelectedRateCard, clearSelectedRateCard } =
  rateCardSlice.actions;

export default rateCardSlice.reducer;
