import { tasksReducer } from "features/todolistList/Todolist/Task/tasks-reducer";
import { todosReducer } from "features/todolistList/todolists-reducer";
import { AnyAction, combineReducers } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "features/login/authReducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todos: todosReducer,
  app: appReducer,
  auth: authReducer,
});

// создаём store, applyMiddleware для работы с thunk включен в configureStore
export const store = configureStore({
  reducer: rootReducer,
});

// типизация в соответствии с документацией RTK
export type AppRootStateType = ReturnType<typeof store.getState>;

//типизация dispatch для санок и AC, начиная с 18 react
export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>;

//для удобства useSelector сразу с типизацией
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
