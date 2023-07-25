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
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => {
          return action.type.endsWith("/pending");
        },
        (state, action) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => {
          return action.type.endsWith("/fulfilled");
        },
        (state, action) => {
          state.status = "succeeded";
        }
      )
      .addMatcher(
        (action) => {
          return action.type.endsWith("/rejected");
        },
        (state, action) => {
          state.status = "failed";
          const { payload, error } = action;
          if (payload) {
            if (payload.showGlobalError) {
              state.error = payload.data.messages.length ? payload.data.messages[0] : "Some error occurred";
            }
          } else {
            state.error = error.message ? error.message : "Some error occurred";
          }
        }
      );
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
//test//
