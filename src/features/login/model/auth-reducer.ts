import { appActions } from "app/model/app-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { todosActions, todosThunk } from "features/todolistList/todolist/model/todolists-reducer";
import { taskActions } from "features/todolistList/tasks/model/tasks-reducer";
import { createAppAsyncThunk } from "common/utils/createAppAsynkThunk";
import { authApi } from "features/login/api/auth-api";
import { ResultCode } from "common/enums/common-enums";

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

    const res = await authApi.login(arg.values);
    if (res.data.resultCode === ResultCode.COMPLETED) {
      dispatch(todosThunk.setTodosTC());
      return true;
    } else {
      const isShowAppError = !res.data.fieldsErrors.length;
      return rejectWithValue({ data: res.data, showGlobalError: isShowAppError });
    }
  }
);

export const isLoggedAppTC = createAppAsyncThunk<boolean, void>("auth/initializeAppTC", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  const res = await authApi.me();
  dispatch(appActions.appInitialize(true));

  if (res.data.resultCode === ResultCode.COMPLETED) {
    dispatch(todosThunk.setTodosTC());
    return true;
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true });
  }
});

export const logOutTC = createAppAsyncThunk<boolean, boolean>("auth/LogOutTC", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  const res = await authApi.logOut();
  if (res.data.resultCode === ResultCode.COMPLETED) {
    dispatch(todosActions.clearTodos());
    dispatch(taskActions.clearTask({}));
    dispatch(appActions.appSetLoadingStatus("succeeded"));
    return arg;
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true });
  }
});

export const authReducer = slice.reducer;
export const authThunk = { loginTC, logOutTC, isLoggedAppTC };
