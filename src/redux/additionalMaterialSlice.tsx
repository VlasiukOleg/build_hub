import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdditionalMaterial {
  id: string;
  title: string;
  quantity: number;
  price: number;
  volume: number;
  weight: number;
  movingTypeCalculation: string;
  measure: string;
}

interface AdditionalMaterialState {
  additionalMaterial: AdditionalMaterial[];
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
    addAdditionalMaterial(state, action: PayloadAction<AdditionalMaterial>) {
      state.additionalMaterial.push(action.payload);
    },
    updateAdditionalMaterial(state, action) {
      const { materialId, quantity } = action.payload;
      state.additionalMaterial = state.additionalMaterial.map(material =>
        material.id === materialId ? { ...material, quantity } : material
      );
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
  updateAdditionalMaterial,
} = additionalMaterialSlice.actions;
export const additionalMaterialReducer = additionalMaterialSlice.reducer;
