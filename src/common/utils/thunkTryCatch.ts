import { AppDispatchType, AppRootStateType } from "app/store";
import { ResponseType } from "common/types/common.types";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { appActions } from "app/app-reducer";
import { handleServerNetworkError } from "common/utils/error.utils";

export const thunkTryCatch = async (
  thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatchType, null | ResponseType>,
  logic: Function
) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.appSetLoadingStatus("loading"));
  try {
    return await logic();
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.appSetLoadingStatus("idle"));
  }
};
