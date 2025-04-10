import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdditionalMaterial {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  volume: number;
  weight: number;
  movingTypeCalculation: string;
  measure: string;
}

interface AdditionalMaterialState {
  additionalMaterial: AdditionalMaterial[];
}

const initialState: AdditionalMaterialState = {
  additionalMaterial: [],
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
    removeAdditionalMaterial(state, action: PayloadAction<string>) {
      state.additionalMaterial = state.additionalMaterial.filter(
        material => material.id !== action.payload
      );
    },
    clearAdditionalMaterial(state) {
      state.additionalMaterial = [];
    },
  },
});

export const {
  addAdditionalMaterial,
  removeAdditionalMaterial,
  clearAdditionalMaterial,
  updateAdditionalMaterial,
} = additionalMaterialSlice.actions;
export const additionalMaterialReducer = additionalMaterialSlice.reducer;
