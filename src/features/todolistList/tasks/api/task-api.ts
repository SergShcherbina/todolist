import { instance } from "common/api/common-api";
import { TaskPriorities, TaskStatuses } from "common/enums/common-enums";
import { ResponseType } from "common/types/common-types";

export const taskApi = {
  getTasks(todoId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todoId}/tasks`);
  },
  addTask(todoId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todoId}/tasks`, { title });
  },
  delTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};

type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
  entityTaskStatus?: boolean;
};
