import {tasksReducer} from '../features/todolistList/tasks-reducer';
import {todolistsReducer} from '../features/todolistList/todolists-reducer';
import {AnyAction, applyMiddleware, combineReducers, createStore, legacy_createStore} from 'redux';
import thunk, {ThunkDispatch} from "redux-thunk";
import {appReducer} from "./app-reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {authReducer} from "../features/login/authReducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    autch: authReducer
})
// непосредственно создаём store, добавляем applyMiddleware для работы с thunk
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

//типизация dispatch для санок и AC, начиная с 18 react
export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

//для удобства useSelector сразу с типизацией
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
