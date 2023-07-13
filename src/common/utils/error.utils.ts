import { appActions } from "app/app-reducer";
import { Dispatch } from "redux";
import { AxiosError, AxiosResponse } from "axios";
import { ResultCode } from "common/enums/common.enums";
import { ResponseType } from "common/types/common.types";

export const handleServerAppError = <T>(
  res: AxiosResponse<ResponseType<T>>,
  dispatch: Dispatch,
  isShowAppError = true
) => {
  if (isShowAppError) {
    dispatch(appActions.appSetError(res.data.messages.length ? res.data.messages[0] : "error message"));
  }
  dispatch(appActions.appSetLoadingStatus("failed"));
};

export const handleServerNetworkError = (e: unknown | Error, dispatch: Dispatch) => {
  const err = e as Error | AxiosError<{ error: string }>; //типизация ошибки
  dispatch(appActions.appSetError(err.message + " 😠"));
};
