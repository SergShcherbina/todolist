import { appActions } from "app/app-reducer";
import { Dispatch } from "redux";
import { AxiosError, AxiosResponse } from "axios";
import { ResultCode } from "common/enums/common.enums";
import { ResponseType } from "common/types/common.types";

//джeнериковая функция (динамическая типизация)
export const handleServerAppError = <T>(res: AxiosResponse<ResponseType<T>>, dispatch: Dispatch) => {
  if (res.data.messages.length >= ResultCode.ERROR) {
    dispatch(appActions.appSetError(res.data.messages[0] + "😠"));
  } else {
    dispatch(appActions.appSetError("error message + 😠"));
  }
  dispatch(appActions.appSetLoadingStatus("failed"));
};

export const handleServerNetworkError = (e: unknown | Error, dispatch: Dispatch) => {
  const err = e as Error | AxiosError<{ error: string }>; //типизация ошибки
  dispatch(appActions.appSetError(err.message + " 😠"));
  dispatch(appActions.appSetLoadingStatus("failed"));
};
