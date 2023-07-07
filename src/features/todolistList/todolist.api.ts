import { instance } from "common/api/common.api";
import { AxiosResponse } from "axios";
import { ResponseType } from "common/types/common.types";

export const todolistAPI = {
  getTodolists() {
    //методы вызываем у instance и обязательно return данных
    return instance.get<TodolistApiType[]>("todo-lists");
  },
  createTodolist(title: string) {
    //полезную нагрузку передаем вторым параметром в виде {} св-ва 'title' - имя в зависимости от сервера
    return instance.post<
      ResponseType<{ item: TodolistApiType }>,
      AxiosResponse<ResponseType<{ item: TodolistApiType }>>,
      { title: string }
    >("todo-lists", { title });
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}`);
  },
  updateTodolist(todolistId: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`, { title: title });
  },
};

export type TodolistApiType = {
  addedDate: string;
  id: string;
  order: number;
  title: string;
};
