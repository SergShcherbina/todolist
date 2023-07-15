import { tasksReducer } from "features/todolistList/tasks/model/tasks-reducer";
import { todosReducer } from "features/todolistList/todolist/model/todolists-reducer";
import { AnyAction, combineReducers } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { appReducer } from "app/model/app-reducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "features/login/model/auth-reducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todos: todosReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>;

// чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
