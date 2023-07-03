import { loginAPI, LoginParamsType, ResultCode } from "api/todolist-api";
import { appActions } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error.utils";
import { AppDispatchType } from "app/store";

const initialState = {
  isLoggedIn: false,
};

type InitialStateType = typeof initialState;
type AuthActionType = LoginAT;

export const authReducer = (state: InitialStateType = initialState, action: AuthActionType) => {
  switch (action.type) {
    case "AUTH/LOGIN": {
      return { ...state, isLoggedIn: action.isLoggedIn };
    }
    default: {
      return state;
    }
  }
};
type LoginAT = ReturnType<typeof loginAC>;

export const loginAC = (isLoggedIn: boolean) => ({ type: "AUTH/LOGIN", isLoggedIn });

export const loginTC = (data: LoginParamsType) => {
  return (dispatch: AppDispatchType) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    loginAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === ResultCode.COMPLETED) {
          dispatch(loginAC(true));
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
          dispatch(loginAC(true));
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
          dispatch(loginAC(false)); //вылогиниваемся
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
