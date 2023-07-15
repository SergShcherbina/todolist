import { appActions } from "app/model/app-reducer";
import { handleServerAppError } from "common/utils/error-utils";
import { createSlice } from "@reduxjs/toolkit";
import { todosActions, todosThunk } from "features/todolistList/todolist/model/todolists-reducer";
import { taskActions } from "features/todolistList/tasks/model/tasks-reducer";
import { createAppAsyncThunk } from "common/utils/createAppAsynkThunk";
import { authApi } from "features/login/api/auth-api";
import { ResultCode } from "common/enums/common-enums";
import { thunkTryCatch } from "common/utils/thunkTryCatch";

const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authThunk.loginTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(authThunk.logOutTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(authThunk.isLoggedAppTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      });
  },
});

const loginTC = createAppAsyncThunk<boolean, { values: { email: string; password: string; rememberMe: boolean } }>(
  "auth/LoginTC",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
      const res = await authApi.login(arg.values);
      if (res.data.resultCode === ResultCode.COMPLETED) {
        dispatch(todosThunk.setTodosTC());
        return true;
      } else {
        const isShowAppError = !res.data.fieldsErrors.length;
        handleServerAppError(res, dispatch, isShowAppError);
        return rejectWithValue(res.data);
      }
    });
  }
);

export const isLoggedAppTC = createAppAsyncThunk<boolean, void>("auth/initializeAppTC", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  return thunkTryCatch(thunkAPI, async () => {
    const res = await authApi.me();
    if (res.data.resultCode === ResultCode.COMPLETED) {
      dispatch(todosThunk.setTodosTC());
      return true;
    } else {
      return rejectWithValue(null);
    }
  }).then((res) => {
    dispatch(appActions.appInitialize(true));
    return res;
  });
});

export const logOutTC = createAppAsyncThunk<boolean, boolean>("auth/LogOutTC", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  return thunkTryCatch(thunkAPI, async () => {
    const res = await authApi.logOut();
    if (res.data.resultCode === ResultCode.COMPLETED) {
      dispatch(todosActions.clearTodos());
      dispatch(taskActions.clearTask({}));
      dispatch(appActions.appSetLoadingStatus("succeeded"));
      return arg;
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue(null);
    }
  });
});

export const authReducer = slice.reducer;
export const authThunk = { loginTC, logOutTC, isLoggedAppTC };
