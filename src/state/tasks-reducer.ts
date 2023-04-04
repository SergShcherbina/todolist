import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistAT, RemoveTodolistAC, RemoveTodolistAT} from "./todolist-reducer";

export type RemoveTaskAT = {
    type: 'REMOVE-TASK'
    todolistId: string
    taskId: string
}
export type AddTaskAT = {
    type: 'ADD-TASK'
    title: string
    todolistId: string
}
//способ создания action type с помощью Return Type из вызова функции
type OnChangeStatusCheckedAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTitleTaskAT = ReturnType<typeof changeTaskTitleAC>

type ActionType =
    RemoveTaskAT
    | AddTaskAT
    | OnChangeStatusCheckedAT
    | ChangeTitleTaskAT
    | AddTodolistAT                              // импортированный AC
    | RemoveTodolistAT;                          // импортированный AC

export const tasksReducer = (state: TasksStateType, action: ActionType): TasksStateType => {
    switch(action.type) {
        case 'ADD-TASK':
            const newTasks = { id: v1(), title: action.title, isDone: false };
            return {...state, [action.todolistId]: [newTasks, ...state[action.todolistId]]}
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId]
                .filter(tl => tl.id !== action.taskId)}
        case 'CHANGE-TASK-CHECKED':
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(el => el.id === action.taskId ? { ...el, isDone: action.isDone } : el)}
        case 'CHANGE-TASK-TITLE':
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(el => el.id === action.taskId ? { ...el, title: action.newTitle } : el)}

        //прогоняем чужой Action для этого reducer
        case 'ADD-TODOLIST':
            return {...state, [action.title] : []}
        case 'REMOVE_TODOLIST':
            // return { [action.id] : [] , ...rest} = {...state}   удаление с помощью деструктуризации
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        default:
            return {...state}
    }
}

//если АС типизируем вручную, тогда возвращаемое зн тоже типизируем
export const addTaskAC = (title: string, todolistId: string): AddTaskAT => {
    return {type: 'ADD-TASK', title, todolistId}
}
export const removeTasksAC = ( todolistId: string, taskId: string): RemoveTaskAT => {
    return {type: 'REMOVE-TASK', todolistId, taskId}
}
//если АС создаем с пом ReturnType, тогда добавляем as const
export const changeTaskStatusAC =
    (todolistId: string, taskId: string, isDone: boolean) => {
        return {type: 'CHANGE-TASK-CHECKED', todolistId, taskId, isDone} as const
    }
export const changeTaskTitleAC =
    (todolistId: string, taskId: string, newTitle: string) => {
        return {type: 'CHANGE-TASK-TITLE', todolistId, taskId, newTitle} as const
    }