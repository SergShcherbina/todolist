import { appActions } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "common/utils/error.utils";
import { createSlice } from "@reduxjs/toolkit";
import { todosActions, todosThunk } from "features/todolistList/todolists-reducer";
import { taskActions } from "features/todolistList/Todolist/Task/tasks-reducer";
import { createAppAsyncThunk } from "common/utils/createAppAsynkThunk";
import { authAPI } from "features/login/auth.api";
import { ResultCode } from "common/enums/common.enums";

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
    try {
      dispatch(appActions.appSetLoadingStatus("loading"));
      const res = await authAPI.login(arg.values);
      if (res.data.resultCode === ResultCode.COMPLETED) {
        dispatch(appActions.appSetLoadingStatus("succeeded"));
        dispatch(todosThunk.setTodosTC()); //запрос todos
        return true;
      } else {
        const isShowAppError = !res.data.fieldsErrors.length;
        handleServerAppError(res, dispatch, isShowAppError);
        return rejectWithValue(res.data);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const initializeApp = createAppAsyncThunk<boolean, void>("auth/initializeAppTC", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === ResultCode.COMPLETED) {
      dispatch(todosThunk.setTodosTC()); //запрос todos
      return true; //подтверждение авторизации
    } else {
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.appInitialize(true)); //инициализация приложения
  }
});

export const logOutTC = createAppAsyncThunk<boolean, boolean>("auth/LogOutTC", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.appSetLoadingStatus("loading"));
    const res = await authAPI.logOut();
    if (res.data.resultCode === ResultCode.COMPLETED) {
      dispatch(todosActions.clearTodos()); //зачищаем массив todos
      dispatch(taskActions.clearTask({})); //зачищаем объект тасок
      dispatch(appActions.appSetLoadingStatus("succeeded"));
      return arg;
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunk = { loginTC, logOutTC, isLoggedAppTC: initializeApp };
