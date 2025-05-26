import { createSlice } from '@reduxjs/toolkit';

const citySlice = createSlice({
  name: 'city',
  initialState: {
    city: '',
  },
  reducers: {
    setCity(state, action) {
      state.city = action.payload;
    },
  },
});

export const { setCity } = citySlice.actions;
export const cityReducer = citySlice.reducer;
