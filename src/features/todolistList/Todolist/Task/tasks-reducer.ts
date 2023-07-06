import { TasksStateType } from "app/App";
import { handleServerAppError, handleServerNetworkError } from "common/utils/error.utils";
import { appActions } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todosThunk } from "features/todolistList/todolists-reducer";
import { createAppAsyncThunk } from "common/utils/createAppAsynkThunk";
import { taskApi, TaskType, UpdateTaskModelType } from "features/todolistList/Todolist/Task/task.api";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums/common.enums";

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
      });
  },
});

const fetchTasksTC = createAppAsyncThunk<{ tasks: TaskType[]; todoId: string }, string>(
  "tasks/fetchTasksTC",
  async (todoId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.appSetLoadingStatus("loading"));
    try {
      const res = await taskApi.getTasks(todoId);
      const tasks = res.data.items;
      dispatch(appActions.appSetLoadingStatus("succeeded"));
      return { tasks, todoId };
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

const removeTaskTC = createAppAsyncThunk<{ taskId: string; todoId: string }, { todoId: string; taskId: string }>(
  "tasks/removeTaskTC",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todoId, taskId } = arg;

    dispatch(appActions.appSetLoadingStatus("loading"));
    dispatch(taskActions.entityTaskStatus({ todoId, taskId, entityTaskStatus: true }));
    try {
      const res = await taskApi.delTask(todoId, taskId);
      if (res.data.resultCode === 0) {
        dispatch(appActions.appSetLoadingStatus("succeeded"));
        return { taskId, todoId };
      } else {
        handleServerAppError(res, dispatch);
        return rejectWithValue(null);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(taskActions.entityTaskStatus({ todoId, taskId, entityTaskStatus: false }));
    }
  }
);

const addTaskTC = createAppAsyncThunk<{ todoId: string; task: TaskType }, { todoId: string; title: string }>(
  "tasks/addTaskTC",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todoId, title } = arg;
    dispatch(appActions.appSetLoadingStatus("loading"));

    try {
      const res = await taskApi.addTask(todoId, title);
      if (res.data.resultCode === ResultCode.COMPLETED) {
        dispatch(appActions.appSetLoadingStatus("succeeded"));
        return { todoId, task: res.data.data.item };
      } else {
        handleServerAppError(res, dispatch);
        return rejectWithValue(null);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);
export const changeTaskTC = createAppAsyncThunk<
  { domainModal: FlexType; todoId: string; taskId: string },
  { domainModal: FlexType; todoId: string; taskId: string }
>("tasks/changeTaskTC", async (arg, thankAPI) => {
  const { dispatch, getState, rejectWithValue } = thankAPI;

  try {
    dispatch(appActions.appSetLoadingStatus("loading"));
    const task = getState().tasks[arg.todoId].find((t) => t.id === arg.taskId);
    if (!task) {
      console.warn("Task not found in the state");
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
      dispatch(appActions.appSetLoadingStatus("succeeded"));
      return arg;
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
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
