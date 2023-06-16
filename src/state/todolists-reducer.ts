import { ResultCode, todolistAPI, TodolistApiType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {
    appSetErrorAC,
    appSetLoadingStatusAC,
    RequestStatusType
} from "../app/app-reducer";
import {FilterValuesType} from "../AppWithRedux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error.utils";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todo: TodolistApiType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}
export type SetTodolistsAT = ReturnType<typeof setTodolistAC>
export type EntityStatusAT = ReturnType<typeof entityStatusAC>
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType,
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsAT
    | EntityStatusAT

const initialState: Array<TodolistType> = []

export const todolistsReducer = (state: Array<TodolistType> = initialState, action: ActionsType): Array<TodolistType> => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            //к полученными тудулистам добавляем filter: 'all', так как с сервера приходит без него
            return action.todos.map(td => ({...td, filter: 'all', entityStatus: 'idle'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todo, filter: 'all', entityStatus: 'idle'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case "ENTITY-STATUS": {
            return [ ...state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus}: tl)]
        }
        default:
            return state;
    }
}

export const setTodolistAC = (todos: TodolistApiType[]) => {
    return { type: 'SET-TODOLISTS', todos } as const
}
export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todo: TodolistApiType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todo}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}
export const entityStatusAC = (todolistId: string, entityStatus: RequestStatusType) => (
    {type: 'ENTITY-STATUS', todolistId, entityStatus} as const)


export const setTodolistTC = () => {
    return (dispatch: Dispatch) => {
        todolistAPI.getTodolists()
            .then(res => {
                dispatch(setTodolistAC(res.data))
            })
            .catch((err)=> {
                handleServerNetworkError(err, dispatch)
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch)=> {
        dispatch(appSetLoadingStatusAC('loading'))                             //запуск спиннера загрузки
        dispatch(entityStatusAC(todolistId, 'loading'))                    //диспатчим состояние дизейблим кн удаления
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                if(res.data.resultCode === ResultCode.COMPLETED ){                    //если с сервера придет полож код(доки API), enum
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(appSetLoadingStatusAC('succeeded'))
                } else {                                                              //в противном случае (ошибка):
                    if((res.data.messages.length > 0)){                               //проверяем наличие сообщения ошибки
                        dispatch(appSetErrorAC(res.data.messages[0]))                 //диспатчим его в компоненту
                    } else {
                        dispatch(appSetErrorAC('error + 😠'))                   //диспатчим свой текст ошибки
                    }
                    dispatch(appSetLoadingStatusAC('failed'))                   //диспатчим состояние загрузки(убираем спиннер)
                }
            })
            .catch((err)=> {                                                          //срабатывает если ошибка с соид-ем инте-та
                dispatch(appSetErrorAC( err.message + ' 😠'))                   //диспатчим сообщение ошибки
                dispatch(appSetLoadingStatusAC('failed'))                      //диспатчим состояние загрузки(убираем спиннер)
            })
            .finally(()=> {
                dispatch(entityStatusAC(todolistId, 'idle'))               //диспатчим состояние раздизейбл кн удаления
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(appSetLoadingStatusAC('loading'))
        todolistAPI.createTodolist(title)
            .then(res => {
                if(res.data.resultCode === ResultCode.COMPLETED ){
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(appSetLoadingStatusAC('succeeded'))
                } else {
                    handleServerAppError(res , dispatch)                              //вынесли кусок кода в дженериковую ф-ю
                }
            })
            .catch((err)=> {
                handleServerNetworkError(err, dispatch)                               //вынесли кусок кода в ф-ю
            })

    }
}
export const updateTodolistTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(appSetLoadingStatusAC('loading'))
        todolistAPI.updateTodolist(todolistId, title)
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(appSetLoadingStatusAC('succeeded'))
            } else {
                handleServerAppError(res , dispatch)
            }
        })
        .catch((err)=> {
            handleServerNetworkError(err, dispatch)
        })

    }
}
