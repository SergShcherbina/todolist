import { AppDispatchType, AppRootStateType } from "app/model/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseType } from "common/types/common-types";

//сделаем небольшую обертку над createAsyncThunk по примеру из документации
//Благодаря этой обертке мы можем не типизировать ошибку rejectValue, dispatch, state каждый раз.
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatchType;
  rejectValue: null | RejectValueType;
}>();

export type RejectValueType = {
  data: ResponseType;
  showGlobalError: boolean;
};
