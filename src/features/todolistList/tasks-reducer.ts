import { Dispatch } from "redux";
import { ResultCode, taskApi, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType } from "api/todolist-api";
import { AppRootStateType } from "app/store";
import { TasksStateType } from "app/AppWithRedux";
import { handleServerAppError, handleServerNetworkError } from "utils/error.utils";
import { appActions } from "app/app-reducer";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { todosActions } from "features/todolistList/todolists-reducer";

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
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      state[action.payload.todolistId] = state[action.payload.todolistId].filter(
        (el) => el.id !== action.payload.taskId
      );
    },
    addTask: (state, action: PayloadAction<{ todolistId: string; task: TaskType }>) => {
      state[action.payload.todolistId].unshift(action.payload.task);
    },
    setTasks: (state, action: PayloadAction<{ tasks: TaskType[]; todolistID: string }>) => {
      state[action.payload.todolistID] = action.payload.tasks;
    },
    changeTask: (state, action: PayloadAction<{ taskId: string; model: UpdateTaskModelType; todolistId: string }>) => {
      state[action.payload.todolistId] = state[action.payload.todolistId].map((task) =>
        task.id === action.payload.taskId ? { ...task, ...action.payload.model } : task
      );
    },
    clearTask: (state, action) => {
      return {};
    },
    entityTaskStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; entityTaskStatus: boolean }>
    ) => {
      state[action.payload.todolistId].find((task) =>
        task.id === action.payload.taskId ? (task.entityTaskStatus = action.payload.entityTaskStatus) : task
      );
    },
  },
  //если нужно истользовать action из др slice, помещаем его в extraReducers
  extraReducers: (builder) => {
    builder.addCase(todosActions.removeTodolistAC, (state, action) => {
      state[action.payload.todoId] = []; //при удалении todolist зачищаем массив тасок
    });
  },
});

export const tasksReducer = slice.reducer;
export const taskActions = slice.actions;

export const fetchTasksTC = (todolistID: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    taskApi
      .getTasks(todolistID)
      .then((res) => {
        const tasks = res.data.items;
        dispatch(taskActions.setTasks({ tasks, todolistID }));
        dispatch(appActions.appSetLoadingStatus("succeeded"));
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};
export const removeTaskTC = (todolistId: string, taskId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    dispatch(taskActions.entityTaskStatus({ todolistId, taskId, entityTaskStatus: true }));
    taskApi
      .delTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(taskActions.removeTask({ taskId, todolistId }));
          dispatch(appActions.appSetLoadingStatus("succeeded"));
        } else {
          handleServerAppError(res, dispatch);
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      })
      .finally(() => {
        dispatch(taskActions.entityTaskStatus({ todolistId, taskId, entityTaskStatus: false }));
      });
  };
};
export const addTaskTC = (todolistId: string, title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    taskApi
      .addTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === ResultCode.COMPLETED) {
          dispatch(taskActions.addTask({ todolistId, task: res.data.data.item }));
          dispatch(appActions.appSetLoadingStatus("succeeded"));
        } else {
          handleServerAppError(res, dispatch);
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};

/////////////////////общая санка для смены status & title с типизацией /////////////
type FlexType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export const changeTaskTC = (taskId: string, todolistId: string, data: FlexType) => {
  //типизация getState : () => AppRootStateType
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    const task = getState().tasks[todolistId].find((t) => t.id === taskId);
    if (task) {
      const model: UpdateTaskModelType = {
        title: task.title,
        startDate: task.startDate,
        description: task.description,
        priority: task.priority,
        deadline: task.deadline,
        status: task.status,
        ...data,
      };
      taskApi
        .updateTask(todolistId, taskId, model)
        .then((res) => {
          if (res.data.resultCode === 0) {
            dispatch(taskActions.changeTask({ taskId, model, todolistId }));
            dispatch(appActions.appSetLoadingStatus("succeeded"));
          } else {
            handleServerAppError(res, dispatch);
          }
        })
        .catch((err) => {
          handleServerNetworkError(err, dispatch);
        });
    }
  };
};
