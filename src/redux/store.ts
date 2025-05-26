import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { deliveryReducer } from './deliverySlice';
import { materialsReducer } from './materialsSlice';
import { movingReducer } from './movingSlice';
import { additionalMaterialReducer } from './additionalMaterialSlice';
import { configurableMaterialReducer } from './configurableMaterialSlice';
import { cityReducer } from './citySlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'delivery',
    'moving',
    'additionalMaterial',
    'configurableMaterial',
    'city',
  ],
};

const rootReducer = combineReducers({
  delivery: deliveryReducer,
  categories: materialsReducer,
  moving: movingReducer,
  additionalMaterial: additionalMaterialReducer,
  configurableMaterial: configurableMaterialReducer,
  city: cityReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
