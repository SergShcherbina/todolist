import { loginAPI, ResultCode } from "api/todolist-api";
import { appActions } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error.utils";
import { createSlice } from "@reduxjs/toolkit";
import { todosActions } from "features/todolistList/todolists-reducer";
import { taskActions } from "features/todolistList/tasks-reducer";
import { createAppAsyncThunk } from "utils/createAppAsynkThunk";

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
      .addCase(authThunk.initializeAppTC.fulfilled, (state, action) => {
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
      const res = await loginAPI.login(arg.values);
      if (res.data.resultCode === ResultCode.COMPLETED) {
        dispatch(appActions.appSetLoadingStatus("succeeded"));
        return true;
      } else {
        handleServerAppError(res, dispatch);
        return rejectWithValue(null);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const initializeAppTC = createAppAsyncThunk<boolean, boolean>("auth/initializeAppTC", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.appSetLoadingStatus("loading"));
    const res = await loginAPI.me();
    debugger;
    if (res.data.resultCode === ResultCode.COMPLETED) {
      dispatch(appActions.appSetLoadingStatus("succeeded"));
      return true;
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.appInitialize(arg));
  }
});

export const logOutTC = createAppAsyncThunk<boolean, boolean>("auth/LogOutTC", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.appSetLoadingStatus("loading"));
    const res = await loginAPI.logOut();
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
export const authThunk = { loginTC, logOutTC, initializeAppTC };

// export const loginTC = (data: LoginParamsType) => {
//   return (dispatch: AppDispatchType) => {
//     dispatch(appActions.appSetLoadingStatus("loading"));
//     loginAPI
//       .login(data)
//       .then((res) => {
//         if (res.data.resultCode === ResultCode.COMPLETED) {
//           dispatch(authActions.login(true));
//           // dispatch(appActions.appSetLoadingStatus("succeeded"));
//           dispatch(appActions.appSetLoadingStatus("succeeded"));
//         } else {
//           handleServerAppError(res, dispatch);
//         }
//       })
//       .catch((err) => {
//         handleServerNetworkError(err, dispatch);
//       });
//   };
// };

//эту санку мы отправляем после каждой перезагрузки, чтобы проверить или авторизованны
// export const initializeAppTC = () => {
//   return (dispatch: AppDispatchType) => {
//     dispatch(appActions.appSetLoadingStatus("loading"));
//     loginAPI
//       .me()
//       .then((res) => {
//         if (res.data.resultCode === ResultCode.COMPLETED) {
//           dispatch(authActions.login(true));
//           dispatch(appActions.appSetLoadingStatus("succeeded"));
//         } else {
//           handleServerAppError(res, dispatch);
//         }
//       })
//       .catch((err) => {
//         handleServerNetworkError(err, dispatch);
//       })
//       .finally(() => {
//         dispatch(appActions.appInitialize(true)); //инициализация приложения
//       });
//   };
// };
// export const logOutTC = () => {
//     return (dispatch: AppDispatchType) => {
//         dispatch(appActions.appSetLoadingStatus("loading"));
//         loginAPI
//             .logOut()
//             .then((res) => {
//                 if (res.data.resultCode === ResultCode.COMPLETED) {
//                     dispatch(authActions.login(false)); //вылогиниваемся
//                     dispatch(todosActions.clearTodos()); //зачищаем массив todos
//                     dispatch(taskActions.clearTask({})); //зачищаем объект тасок
//                     dispatch(appActions.appSetLoadingStatus("succeeded"));
//                 } else {
//                     handleServerAppError(res, dispatch);
//                 }
//             })
//             .catch((err) => {
//                 handleServerNetworkError(err, dispatch);
//             });
//     };
// };
