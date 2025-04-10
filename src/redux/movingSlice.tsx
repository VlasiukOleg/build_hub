import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { PayloadAction } from '@reduxjs/toolkit';

import { calculateMovingFee } from '@/utils/calculateMovingFee';

const elevators = [
  {
    name: 'Пасажирський ліфт',
    label: 'passenger',
  },
  { name: 'Вантажний ліфт', label: 'cargo' },
  { name: 'Без ліфта', label: 'nolift' },
];

const buildings = [
  {
    name: 'Новий дім/Хрущевка',
    label: 'new',
  },
  { name: 'Сталінка/Царський', label: 'old' },
];

export const recalculateMovingFee = createAsyncThunk(
  'moving/recalculateMovingFee',
  async (_, { getState }) => {
    const state = getState() as RootState;

    const { elevator, distance, floor, building } = state.moving;

    const movingFee = calculateMovingFee(
      elevator,
      distance,
      building,
      Number(floor)
    );

    return movingFee;
  }
);

const movingSlice = createSlice({
  name: 'moving',
  initialState: {
    movingPrice: 0,
    isMovingPriceAddToOrder: true,
    floor: '1',
    test: 'Hello',
    elevator: elevators[0].label,
    building: buildings[0].label,
    distance: 20,
  },
  reducers: {
    setMovingFloor(state, action) {
      state.floor = action.payload;
    },
    setMovingElevator(state, action) {
      state.elevator = action.payload;
    },
    setMovingBuilding(state, action) {
      state.building = action.payload;
    },
    setMovingDistance(state, action) {
      state.distance = action.payload;
    },
    setMovingCost(state, action) {
      state.movingPrice = action.payload;
    },
    toggleMovingPriceToOrder(state) {
      state.isMovingPriceAddToOrder = !state.isMovingPriceAddToOrder;
    },
  },
  // extraReducers: builder => {
  //   builder.addCase(
  //     recalculateMovingFee.fulfilled,
  //     (state, action: PayloadAction<number>) => {
  //       state.movingPrice = action.payload;
  //     }
  //   );
  // },
});

export const {
  setMovingCost,
  toggleMovingPriceToOrder,
  setMovingBuilding,
  setMovingDistance,
  setMovingElevator,
  setMovingFloor,
} = movingSlice.actions;
export const movingReducer = movingSlice.reducer;
