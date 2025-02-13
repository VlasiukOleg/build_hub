import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfigurableMaterial {
  title: string;
  image: string;
  quantity: number;
  price: number;
  volume: number;
  weight: number;
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
    removeConfigurableMaterial(state, action: PayloadAction<number>) {
      state.configurableMaterial.splice(action.payload, 1);
    },
    clearConfigurableMaterial(state) {
      state.configurableMaterial = [];
    },
  },
});

export const {
  addConfigurableMaterial,
  removeConfigurableMaterial,
  clearConfigurableMaterial,
} = configurableMaterialSlice.actions;
export const configurableMaterialReducer = configurableMaterialSlice.reducer;
