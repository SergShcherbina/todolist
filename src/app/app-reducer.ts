import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as null | string,
  initialize: false,
};

// slice - редьюсеры создаем с помощью функции createSlice
const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Объект payload. Типизация через PayloadAction
    appSetLoadingStatus: (state, action: PayloadAction<RequestStatusType>) => {
      state.status = action.payload; // логику в подредьюсерах пишем мутабельным образом,
    },
    appSetError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    appInitialize: (state, action: PayloadAction<boolean>) => {
      state.initialize = action.payload;
    },
  },
});

export const appReducer = slice.reducer; // Создаем reducer с помощью slice
export const appActions = slice.actions; // Action creator также достаем с помощью slice
