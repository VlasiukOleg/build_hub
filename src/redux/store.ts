import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { deliveryReducer } from './deliverySlice';
import { materialsReducer } from './materialsSlice';
import { movingReducer } from './movingSlice';
import { additionalMaterialReducer } from './additionalMaterialSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['delivery', 'moving', 'additionalMaterial'],
};

const rootReducer = combineReducers({
  delivery: deliveryReducer,
  categories: materialsReducer,
  moving: movingReducer,
  additionalMaterial: additionalMaterialReducer,
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
