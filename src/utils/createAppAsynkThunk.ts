import { AppDispatchType, AppRootStateType } from "app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

//сделаем небольшую обертку над createAsyncThunk по примеру из документации
//Благодаря этой обертке мы можем не типизировать ошибку rejectValue, dispatch, state каждый раз.
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatchType;
  rejectValue: null;
}>();