import { createSlice } from '@reduxjs/toolkit';
import catalog from '@/data/catalog.json';

console.log(catalog);

const materialsSlice = createSlice({
  name: 'categories',
  initialState: catalog,
  reducers: {
    changeQuantity(state, action) {
      const { catInd, matInd, slug, value } = action.payload;

      const category = state.find(item => item.id === slug);

      if (category) {
        const { categories } = category;
        const categoryItem = categories[catInd];
        const material = categoryItem?.materials[matInd];

        if (categoryItem && material) {
          material.quantity += Number(value);
        }
      }
    },
    inputChangeQuantity(state, action) {
      const { catInd, matInd, slug, value } = action.payload;

      const category = state.find(item => item.id === slug);

      if (category) {
        const { categories } = category;
        // Проверить существование категории и материала
        const categoryItem = categories[catInd];
        const material = categoryItem?.materials[matInd];

        if (categoryItem && material) {
          console.log(Number(value));
          // Обновить количество материала
          if (value === Number(0)) {
            console.log('Yes');
            console.log(material.quantity);
            material.quantity = Number(0);
          } else {
            console.log(material.quantity);
            material.quantity = Number(value);
          }
        }
      }
    },
    clearQuantity(state, action) {
      const allMaterials = state.flatMap(item => item.categories);

      const groupMaterials = allMaterials.flatMap(
        category => category.materials
      );
      groupMaterials.map(item => (item.quantity = action.payload));
    },
  },
});

export const { changeQuantity, inputChangeQuantity, clearQuantity } =
  materialsSlice.actions;
export const materialsReducer = materialsSlice.reducer;
