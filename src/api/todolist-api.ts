import axios, {AxiosResponse} from 'axios'
import {logOutTC} from "../features/login/authReducer";

//общие параметры выносим в instance
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        //Чтобы отправлять запросы на изменение данных на сервере (CRUD), нужно добавить свой персональный ‘API-KEY’,
        'API-KEY': '2c9579b3-006a-4fe2-ae79-36894f3fae6b',
    }
})

export const todolistAPI = {
    getTodolists() {
        //методы вызываем у instance и обязательно return данных
        return instance.get<TodolistApiType[]>('todo-lists')
    },
    createTodolist(title: string) {
        //полезную нагрузку передаем вторым параметром в виде {} св-ва 'title' - имя в зависимости от сервера
        return instance.post<ResponseType<{ item: TodolistApiType }>, AxiosResponse<ResponseType<{ item: TodolistApiType }>>, { title: string }>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete <ResponseType<{}>>(`/todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return  instance.put<ResponseType<{}>>(`todo-lists/${todolistId}`, {title: title})

    },
}

export const taskApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, {title})
    },
    delTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType<{}>>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
}

export const loginAPI = {
    login(data: LoginParamsType){                                                   //логинимся
        return instance.post<ResponseType<number>, AxiosResponse<ResponseType<number>>, LoginParamsType>('auth/login', data)
    },
    me(){                                                                           //проверяем или залогинены
        return instance.get<ResponseType<ResponseMeType>>('auth/me')
    },
    logOut(){                                                                       //вылогиниваемся
        return instance.delete<ResponseType<{}>>('/auth/login')
    }
}

//необычная типизация похожих типов
export type ResponseType<D> = {
    fieldsErrors: Array<string>
    messages: Array<string>
    resultCode: number
    data: D
}
export type TodolistApiType = {
    addedDate: string,
    id: string,
    order: number,
    title: string,
}
export enum ResultCode {
    COMPLETED = 0,
    ERROR = 1,
    CAPTCHA= 10
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
    entityTaskStatus?: boolean
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: boolean
}
export type ResponseMeType = {
    id: number,
    email: string,
    login: string
}
