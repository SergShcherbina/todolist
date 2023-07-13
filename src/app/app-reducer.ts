import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as null | string,
  initialize: false,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    appSetLoadingStatus: (state, action: PayloadAction<RequestStatusType>) => {
      state.status = action.payload;
    },
    appSetError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    appInitialize: (state, action: PayloadAction<boolean>) => {
      state.initialize = action.payload;
    },
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
