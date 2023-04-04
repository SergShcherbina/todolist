import {TodoListType} from "../App";
import {v1} from "uuid";

export type ActionsType =
    AddTodolistAT |
    RemoveTodolistAT |
    ChangeTodolistTitleAT |
    ChangeTodolistFilterAT

//[key: string] : any                              //заглушка на любой случай в action

export type AddTodolistAT = {
    type: 'ADD-TODOLIST'
    title: string
}
export type RemoveTodolistAT = {
    type: 'REMOVE_TODOLIST'
    id: string
}
export type ChangeTodolistTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
export type ChangeTodolistFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: string
}

//reduser функция, которая меняет стор и стейт иммутабельно
export const todolistsReducer = (state: Array<TodoListType>, action: ActionsType) => {
    switch (action.type) {
        case 'ADD-TODOLIST':
            const newTodolistId = v1();
            const newTodolist: TodoListType = {id: newTodolistId, title: action.title, filter: 'all'}
            return [...state, newTodolist]
        case 'REMOVE_TODOLIST':
            return state.filter(td => td.id !== action.id)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        default:
            throw new Error("ОЩИБКА")
    }
}

//actinCreater создает action на основе вх данных(тип задаем тут остальное принимаем)
export const RemoveTodolistAC = (todolistId: string): RemoveTodolistAT => {
    return {type: 'REMOVE_TODOLIST', id: todolistId}
}
export const AddTodolistAC = (title: string): AddTodolistAT => {
    return {type: 'ADD-TODOLIST', title}
}
export const ChangeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleAT => {
    return {type: "CHANGE-TODOLIST-TITLE", id: id, title: title}
}
export const ChangeTodolistFilterAC = (id: string, filter: string): ChangeTodolistFilterAT => {
    return {type: "CHANGE-TODOLIST-FILTER", id, filter}
}