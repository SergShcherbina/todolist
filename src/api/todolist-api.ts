import axios from 'axios'
import {GetTodolists} from "../stories/todolists-api.stories";
import {number, string} from "prop-types";


//общие параметры выносим в instance
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        //Чтобы отправлять запросы на изменение данных на сервере (CRUD), нужно добавить свой персональный ‘API-KEY’,
        'API-KEY': '2c9579b3-006a-4fe2-ae79-36894f3fae6b',
    }
})

//необычная типизация похожих типов
export type ResponseTodolistType<D> = {
    fieldsErrors: Array<string>
    messages: Array<string>
    resultCode: number
    data: D
}
type TodolistApiType = {
    addedDate: string,
    id: string,
    order: number,
    title: string,
}

export const todolistAPI = {
    getTodolists() {
        //методы вызываем у instance и обязательно return данных
        return instance.get<Array<TodolistApiType>>('todo-lists')
    },
    createTodolist(title: string) {
        //полезную нагрузку передаем вторым параметром в виде {} св-ва 'title' в зависимости от сервера
        return instance.post<ResponseTodolistType<{D: TodolistApiType}>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseTodolistType<{}>>(`/todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        const promise = instance.put<ResponseTodolistType<{}>>(`todo-lists/${todolistId}`, {title: title})
            .then(res => {
                return res.data
        })
        return promise
    },
}

export const taskApi = {
    getTasks(todolistId : string ){
        return instance.get(`/todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string){
        return instance.post(`/todo-lists/${todolistId}/tasks`, {title})
    },
    delTask(todolistId: string, taskId: string){
        return instance.delete(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, title: string){
        return instance.put(`/todo-lists/${todolistId}/tasks/${taskId}`, {title})
    }
}
