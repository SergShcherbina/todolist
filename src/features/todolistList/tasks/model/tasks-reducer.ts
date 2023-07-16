import { TasksStateType } from "app/ui/App";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todosThunk } from "features/todolistList/todolist/model/todolists-reducer";
import { createAppAsyncThunk } from "common/utils/createAppAsynkThunk";
import { taskApi, TaskType, UpdateTaskModelType } from "features/todolistList/tasks/api/task-api";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums/common-enums";

const initialState: TasksStateType = {
  /*"todolistId1": [
     { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
     { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
     { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
 ],
 "todolistId2": [
     { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
     { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
     { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
         startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
 ]*/
};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTask: (state, action) => {
      return {};
    },
    entityTaskStatus: (state, action: PayloadAction<{ todoId: string; taskId: string; entityTaskStatus: boolean }>) => {
      state[action.payload.todoId].find((task) =>
        task.id === action.payload.taskId ? (task.entityTaskStatus = action.payload.entityTaskStatus) : task
      );
    },
  },
  //если нужно истользовать action из др slice, помещаем его в extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(todosThunk.removeTodoTC.fulfilled, (state, action) => {
        state[action.payload.todoId] = []; //при удалении todolist зачищаем массив тасок
      })
      .addCase(todosThunk.addTodoTC.fulfilled, (state, action) => {
        state[action.payload.todo.id] = []; //при добавлении тудулиста добавляем массив пустых тасок
      })
      .addCase(taskThunk.fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todoId] = action.payload.tasks;
      })
      .addCase(taskThunk.removeTaskTC.fulfilled, (state, action) => {
        state[action.payload.todoId] = state[action.payload.todoId].filter((el) => el.id !== action.payload.taskId);
      })
      .addCase(taskThunk.addTaskTC.fulfilled, (state, action) => {
        state[action.payload.todoId].unshift(action.payload.task);
      })
      .addCase(taskThunk.changeTaskTC.fulfilled, (state, action) => {
        state[action.payload.todoId] = state[action.payload.todoId].map((task) =>
          task.id === action.payload.taskId ? { ...task, ...action.payload.domainModal } : task
        );
      })
      .addMatcher(
        (action) => {
          return action.type.endsWith("removeTaskTC/rejected");
        },
        (state, action) => {
          state[action.meta.arg.todoId].find((task) =>
            task.id === action.meta.arg.taskId ? (task.entityTaskStatus = false) : task
          );
        }
      );
  },
});
const fetchTasksTC = createAppAsyncThunk<{ tasks: TaskType[]; todoId: string }, string>(
  "tasks/fetchTasksTC",
  async (todoId, thunkAPI) => {
    const res = await taskApi.getTasks(todoId);
    const tasks = res.data.items;
    return { tasks, todoId };
  }
);

const removeTaskTC = createAppAsyncThunk<{ taskId: string; todoId: string }, { todoId: string; taskId: string }>(
  "tasks/removeTaskTC",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todoId, taskId } = arg;
    dispatch(taskActions.entityTaskStatus({ todoId, taskId, entityTaskStatus: true }));

    const res = await taskApi.delTask(todoId, taskId);
    if (res.data.resultCode === 0) {
      return { taskId, todoId };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
    }
  }
);

const addTaskTC = createAppAsyncThunk<{ todoId: string; task: TaskType }, { todoId: string; title: string }>(
  "tasks/addTaskTC",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todoId, title } = arg;

    const res = await taskApi.addTask(todoId, title);
    if (res.data.resultCode === ResultCode.COMPLETED) {
      return { todoId, task: res.data.data.item };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false });
    }
  }
);

export const changeTaskTC = createAppAsyncThunk<
  { domainModal: FlexType; todoId: string; taskId: string },
  { domainModal: FlexType; todoId: string; taskId: string }
>("tasks/changeTaskTC", async (arg, thankAPI) => {
  const { dispatch, rejectWithValue } = thankAPI;

  const task = thankAPI.getState().tasks[arg.todoId].find((t) => t.id === arg.taskId);
  if (!task) {
    console.warn("tasks not found in the state");
    return rejectWithValue(null);
  }
  const model: UpdateTaskModelType = {
    title: task.title,
    startDate: task.startDate,
    description: task.description,
    priority: task.priority,
    deadline: task.deadline,
    status: task.status,
    ...arg.domainModal,
  };

  const res = await taskApi.updateTask(arg.todoId, arg.taskId, model);
  if (res.data.resultCode === 0) {
    return arg;
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true });
  }
});

export const tasksReducer = slice.reducer;
export const taskActions = slice.actions;
export const taskThunk = { fetchTasksTC, removeTaskTC, addTaskTC, changeTaskTC };

export type FlexType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
