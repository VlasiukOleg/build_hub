import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfigurableMaterial {
  title: string;
  key: string;
  image: string;
  quantity: number;
  price: number;
  volume: number;
  weight: number;
  movingTypeCalculation: string;
}

interface ConfigurableMaterialState {
  configurableMaterial: ConfigurableMaterial[];
}

const initialState: ConfigurableMaterialState = {
  configurableMaterial: [],
};

const configurableMaterialSlice = createSlice({
  name: 'configurableMaterial',
  initialState,
  reducers: {
    addConfigurableMaterial(
      state,
      action: PayloadAction<ConfigurableMaterial>
    ) {
      state.configurableMaterial.push(action.payload);
    },
    updateConfigurableMaterial(state, action) {
      const { materialKey, quantity } = action.payload;
      console.log(materialKey, quantity);
      console.log(state.configurableMaterial);
      state.configurableMaterial = state.configurableMaterial.map(material =>
        material.key === materialKey ? { ...material, quantity } : material
      );
    },
    removeConfigurableMaterial(state, action: PayloadAction<string>) {
      state.configurableMaterial = state.configurableMaterial.filter(
        material => material.key !== action.payload
      );
    },
    clearConfigurableMaterial(state) {
      state.configurableMaterial = [];
    },
  },
});

export const {
  addConfigurableMaterial,
  updateConfigurableMaterial,
  removeConfigurableMaterial,
  clearConfigurableMaterial,
} = configurableMaterialSlice.actions;
export const configurableMaterialReducer = configurableMaterialSlice.reducer;
