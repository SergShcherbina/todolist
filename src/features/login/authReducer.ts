import { loginAPI, LoginParamsType, ResultCode } from "api/todolist-api";
import { appActions } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error.utils";
import { AppDispatchType } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todosActions } from "features/todolistList/todolists-reducer";
import { taskActions } from "features/todolistList/tasks-reducer";

const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;

export const loginTC = (data: LoginParamsType) => {
  return (dispatch: AppDispatchType) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    loginAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === ResultCode.COMPLETED) {
          dispatch(authActions.login(true));
          // dispatch(appActions.appSetLoadingStatus("succeeded"));
          dispatch(appActions.appSetLoadingStatus("succeeded"));
        } else {
          handleServerAppError(res, dispatch);
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};

//эту санку мы отправляем после каждой перезагрузки, чтобы проверить или авторизованны
export const initializeAppTC = () => {
  return (dispatch: AppDispatchType) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    loginAPI
      .me()
      .then((res) => {
        if (res.data.resultCode === ResultCode.COMPLETED) {
          dispatch(authActions.login(true));
          dispatch(appActions.appSetLoadingStatus("succeeded"));
        } else {
          handleServerAppError(res, dispatch);
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      })
      .finally(() => {
        dispatch(appActions.appInitialize(true)); //инициализация приложения
      });
  };
};
export const logOutTC = () => {
  return (dispatch: AppDispatchType) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    loginAPI
      .logOut()
      .then((res) => {
        if (res.data.resultCode === ResultCode.COMPLETED) {
          dispatch(authActions.login(false)); //вылогиниваемся
          dispatch(todosActions.clearTodos()); //зачищаем массив todos
          dispatch(taskActions.clearTask({})); //зачищаем объект тасок
          dispatch(appActions.appSetLoadingStatus("succeeded"));
        } else {
          handleServerAppError(res, dispatch);
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};
