import { AppDispatchType, AppRootStateType } from "app/model/store";
import { ResponseType } from "common/types/common-types";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { appActions } from "app/model/app-reducer";
import { handleServerNetworkError } from "common/utils/error-utils";

/**
 * Executes a logic function within a try-catch block and handles server/network errors.
 * @param {BaseThunkAPI<AppRootStateType, any, AppDispatchType, null | ResponseType>} thunkAPI - The thunkAPI object provided by Redux Toolkit.
 * @param {Function} logic - The logic function to be executed within the try block.
 * @returns {Promise<any>} - A Promise that resolves with the result of the logic function or rejects with a null value.
 */

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
