import { appActions, RequestStatusType } from "app/model/app-reducer";
import { handleServerAppError } from "common/utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { taskThunk } from "features/todolistList/tasks/model/tasks-reducer";
import { createAppAsyncThunk } from "common/utils/createAppAsynkThunk";
import { todolistApi, TodolistApiType } from "features/todolistList/todolist/api/todolist-api";
import { ResultCode } from "common/enums/common-enums";
import { thunkTryCatch } from "common/utils/thunkTryCatch";
import { FilterValuesType } from "features/todolistList/tasks/ui/FilterButton";

export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const initialState: TodolistType[] = [];

const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearTodos: (state) => {
      state.splice(0);
    },
    changeTodoFilterAC: (state, action: PayloadAction<{ todoId: string; filter: FilterValuesType }>) => {
      state.forEach((tl) => (tl.id === action.payload.todoId ? (tl.filter = action.payload.filter) : tl));
    },
    entityStatusAC: (state, action: PayloadAction<{ todoId: string; entityStatus: RequestStatusType }>) => {
      state.forEach((tl) => (tl.id === action.payload.todoId ? (tl.entityStatus = action.payload.entityStatus) : tl));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setTodosTC.fulfilled, (state, action) => {
        return action.payload.map((td) => ({ ...td, filter: "all", entityStatus: "idle" }));
      })
      .addCase(addTodoTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todo, filter: "all", entityStatus: "idle" });
      })
      .addCase(removeTodoTC.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todoId); //ищем индекс тудулиста в массиве
        state.splice(index, 1); //по индексу удаляем из массива
      })
      .addCase(changeTodoTitleTC.fulfilled, (state, action) => {
        state.forEach((tl) => (tl.id === action.payload.todoId ? (tl.title = action.payload.title) : tl));
      });
  },
});

const setTodosTC = createAppAsyncThunk<TodolistType[], void>("todolist/setTodolistTC", async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;

  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistApi.getTodolists().then();
    const todos = res.data;
    todos.forEach((t) => {
      dispatch(taskThunk.fetchTasksTC(t.id));
    });
    return todos;
  });
});

const addTodoTC = createAppAsyncThunk<{ todo: TodolistApiType }, string>("todos/addTodosTC", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistApi.createTodolist(arg);
    if (res.data.resultCode === ResultCode.COMPLETED) {
      dispatch(appActions.appSetLoadingStatus("succeeded"));
      return { todo: res.data.data.item };
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue(res.data);
    }
  });
});

const removeTodoTC = createAppAsyncThunk<{ todoId: string }, string>(
  "todos/removeTodos",
  async (todoId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.deleteTodolist(todoId);
      if (res.data.resultCode === ResultCode.COMPLETED) {
        dispatch(appActions.appSetLoadingStatus("succeeded"));
        return { todoId };
      } else {
        if (res.data.messages.length > 0) {
          dispatch(appActions.appSetError(res.data.messages[0]));
        } else {
          handleServerAppError(res, dispatch);
          return rejectWithValue(null);
        }
      }
    });
  }
);

export const changeTodoTitleTC = createAppAsyncThunk<
  { todoId: string; title: string },
  { todoId: string; title: string }
>("todos/updateTodoTC", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistApi.updateTodolist(arg.todoId, arg.title);
    if (res.data.resultCode === 0) {
      dispatch(appActions.appSetLoadingStatus("succeeded"));
      return { todoId: arg.todoId, title: arg.title };
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue(null);
    }
  });
});

export const todosReducer = slice.reducer;
export const todosActions = slice.actions;
export const todosThunk = { setTodosTC, removeTodoTC, addTodoTC, changeTodoTitleTC };
