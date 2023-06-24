import { ResponseType, ResultCode } from "../api/todolist-api";
import { appSetErrorAC, appSetLoadingStatusAC } from "../app/app-reducer";
import { Dispatch } from "redux";
import { AxiosResponse } from "axios";

//джeнериковая функция (динамическая типизация)
export const handleServerAppError = <T>(res: AxiosResponse<ResponseType<T>>, dispatch: Dispatch) => {
  if (res.data.messages.length >= 1) {
    dispatch(appSetErrorAC(res.data.messages[0] + "😠"));
  } else {
    dispatch(appSetErrorAC("error message + 😠"));
  }
  dispatch(appSetLoadingStatusAC("failed"));
};

export const handleServerNetworkError = (err: { message: string }, dispatch: Dispatch) => {
  dispatch(appSetErrorAC(err.message + " 😠"));
  dispatch(appSetLoadingStatusAC("failed"));
};
