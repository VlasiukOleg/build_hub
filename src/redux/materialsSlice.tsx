import { createSlice } from '@reduxjs/toolkit';

import catalog from '@/data/catalog.json';

import { Material } from '@/@types';

const loadFromLocalStorage = () => {
  try {
    const storedData = localStorage.getItem('selectedMaterials');
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error loading selected materials from localStorage', error);
    return [];
  }
};

const saveToLocalStorage = (materials: Material[]) => {
  const selectedMaterials = materials.filter(material => material.quantity > 0);
  localStorage.setItem('selectedMaterials', JSON.stringify(selectedMaterials));
};

const materialsSlice = createSlice({
  name: 'categories',
  initialState: catalog.map(category => ({
    ...category,
    categories: category.categories.map(subcategory => ({
      ...subcategory,
      materials: subcategory.materials.map(material => {
        const savedMaterial = loadFromLocalStorage().find(
          (item: Material) => item.id === material.id
        );
        if (savedMaterial) {
          return { ...material, quantity: savedMaterial.quantity };
        }
        return material;
      }),
    })),
  })),
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
          saveToLocalStorage(
            state.flatMap(item => item.categories).flatMap(cat => cat.materials)
          );
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
            console.log(material.quantity);
            material.quantity = Number(0);
          } else {
            console.log(material.quantity);
            material.quantity = Number(value);
          }
          {
            saveToLocalStorage(
              state
                .flatMap(item => item.categories)
                .flatMap(cat => cat.materials)
            );
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
      localStorage.removeItem('selectedMaterials');
    },
  },
});

export const { changeQuantity, inputChangeQuantity, clearQuantity } =
  materialsSlice.actions;
export const materialsReducer = materialsSlice.reducer;
