import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Material {
  title: string;
  quantity: string;
  price: string;
}

interface AdditionalMaterialState {
  additionalMaterial: Material[];
  isAdditionalMaterialAddToOrder: boolean;
}

const initialState: AdditionalMaterialState = {
  additionalMaterial: [],
  isAdditionalMaterialAddToOrder: false,
};

const additionalMaterialSlice = createSlice({
  name: 'additionalMaterial',
  initialState,
  reducers: {
    addAdditionalMaterial(state, action: PayloadAction<Material>) {
      state.additionalMaterial.push(action.payload);
    },
    removeAdditionalMaterial(state, action: PayloadAction<number>) {
      state.additionalMaterial.splice(action.payload, 1);
    },
    clearAdditionalMaterial(state) {
      state.additionalMaterial = [];
    },
    toggleAdditionalPriceAddToOrder(state) {
      state.isAdditionalMaterialAddToOrder =
        !state.isAdditionalMaterialAddToOrder;
    },
  },
});

export const {
  addAdditionalMaterial,
  removeAdditionalMaterial,
  clearAdditionalMaterial,
  toggleAdditionalPriceAddToOrder,
} = additionalMaterialSlice.actions;
export const additionalMaterialReducer = additionalMaterialSlice.reducer;
