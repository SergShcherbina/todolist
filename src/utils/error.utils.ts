import { ResponseType, ResultCode } from "api/todolist-api";
import { appActions } from "app/app-reducer";
import { Dispatch } from "redux";
import { AxiosResponse } from "axios";

//джeнериковая функция (динамическая типизация)
export const handleServerAppError = <T>(res: AxiosResponse<ResponseType<T>>, dispatch: Dispatch) => {
  if (res.data.messages.length >= ResultCode.ERROR) {
    dispatch(appActions.appSetError(res.data.messages[0] + "😠"));
  } else {
    dispatch(appActions.appSetError("error message + 😠"));
  }
  dispatch(appActions.appSetLoadingStatus("failed"));
};

export const handleServerNetworkError = (err: { message: string }, dispatch: Dispatch) => {
  dispatch(appActions.appSetError(err.message + " 😠"));
  dispatch(appActions.appSetLoadingStatus("failed"));
};
