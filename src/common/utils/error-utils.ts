import { appActions } from "app/model/app-reducer";
import { Dispatch } from "redux";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseType } from "common/types/common-types";

/**
 * Handles server errors and sets the app error and loading status in the Redux store.
 * @template T - The type of the response data.
 * @param {AxiosResponse<ResponseType<T>>} res - The response object received from the server.
 * @param {Dispatch} dispatch - The dispatch function from Redux.
 * @param {boolean} [isShowAppError=true] - Indicates whether to show the app error message. Defaults to true.
 */
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
  const err = e as Error | AxiosError<{ error: string }>; //error typing
  dispatch(appActions.appSetError(err.message + " 😠"));
};
