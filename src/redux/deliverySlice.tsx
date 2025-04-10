import { createSlice } from '@reduxjs/toolkit';

const deliveryTypeList = [
  {
    name: 'Доставка',
    label: 'delivery',
  },
  {
    name: 'Самовивіз',
    label: 'pickup',
  },
];

const deliverySlice = createSlice({
  name: 'delivery',
  initialState: {
    deliveryType: 'delivery',
    deliveryStorage: '',
    deliveryPrice: 0,
    activeStore: null,
  },
  reducers: {
    setDeliveryType(state, action) {
      state.deliveryType = action.payload;
    },
    setDeliveryStorage(state, action) {
      state.deliveryStorage = action.payload;
    },
    setDeliveryPrice(state, action) {
      state.deliveryPrice = action.payload;
    },
    setActiveStore(state, action) {
      state.activeStore = action.payload;
    },
  },
});

export const {
  setDeliveryType,
  setDeliveryPrice,
  setDeliveryStorage,
  setActiveStore,
} = deliverySlice.actions;
export const deliveryReducer = deliverySlice.reducer;
