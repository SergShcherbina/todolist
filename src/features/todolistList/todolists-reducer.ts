import { ResultCode, todolistAPI, TodolistApiType } from "api/todolist-api";
import { Dispatch } from "redux";
import { appActions, RequestStatusType } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error.utils";
import { FilterValuesType } from "./Todolist/Todolist";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasksTC } from "features/todolistList/tasks-reducer";
import { createAppAsyncThunk } from "utils/createAppAsynkThunk";

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
    changeTodolistFilterAC: (state, action: PayloadAction<{ todoId: string; filter: FilterValuesType }>) => {
      state.forEach((tl) => (tl.id === action.payload.todoId ? (tl.filter = action.payload.filter) : tl));
    },
    entityStatusAC: (state, action: PayloadAction<{ todoId: string; entityStatus: RequestStatusType }>) => {
      state.forEach((tl) => (tl.id === action.payload.todoId ? (tl.entityStatus = action.payload.entityStatus) : tl));
    },
  },
  extraReducers: (builder) => {
    //синтаксис при использовании thunk созданных с помощью createAsyncThunk
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

//thunk RTK используя createAsyncThunk
//АРГУМЕНТЫ: 1 - prefix (имя slice и название санки в виде строки), //2 - callback (условно наша старая санка)
const setTodosTC = createAppAsyncThunk("todolist/setTodolist", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.appSetLoadingStatus("loading"));

  try {
    const res = await todolistAPI.getTodolists();
    const todos = res.data;
    dispatch(appActions.appSetLoadingStatus("succeeded"));
    todos.forEach((t) => {
      dispatch(fetchTasksTC(t.id));
    });
    return todos;
  } catch (err: any) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

//ТИПИЗАЦИЯ: 1что возвращает thunk, 2что приходит в thunk, 3возвращаемая ошибка в rejectWithValue
//так как обернули в createAppAsyncThunk третий параметр типизируется по умолчанию
const addTodoTC = createAppAsyncThunk<{ todo: TodolistApiType }, string>("todos/addTodos", async (arg, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi; //thunkAPI обязательный арг из RTK
  dispatch(appActions.appSetLoadingStatus("loading"));
  try {
    const res = await todolistAPI.createTodolist(arg);

    if (res.data.resultCode === ResultCode.COMPLETED) {
      dispatch(appActions.appSetLoadingStatus("succeeded"));
      return { todo: res.data.data.item }; //ОБЯЗАТЕЛЬНО ВОЗВРАЩАЕМ ДАННЫЕ
    } else {
      handleServerAppError(res, dispatch); //вынесли кусок кода в дженериковую ф-ю
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch); //вынесли кусок кода в ф-ю
    return rejectWithValue(null); //возвращаем ошибку, упакованную в rejectWithValue
  } //точнее возвращаем null так как ошибки обрабатываем в ф-и handleServerNetworkError
});

const removeTodoTC = createAppAsyncThunk<{ todoId: string }, string>(
  "todos/removeTodos",
  async (todoId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.appSetLoadingStatus("loading")); //запуск спиннера загрузки
    dispatch(todosActions.entityStatusAC({ todoId, entityStatus: "loading" })); //диспатчим состояние дизейблим кн удаления

    try {
      const res = await todolistAPI.deleteTodolist(todoId);
      if (res.data.resultCode === ResultCode.COMPLETED) {
        //если с сервера придет полож код(доки API), enum
        dispatch(appActions.appSetLoadingStatus("succeeded"));
        return { todoId };
      } else {
        //в противном случае (ошибка):
        if (res.data.messages.length > 0) {
          //проверяем наличие сообщения ошибки
          dispatch(appActions.appSetError(res.data.messages[0])); //диспатчим его в компоненту
        } else {
          dispatch(appActions.appSetError("error + 😠")); //диспатчим свой текст ошибки
        }
        dispatch(appActions.appSetLoadingStatus("failed")); //диспатчим состояние загрузки(убираем спиннер)
        return rejectWithValue(null);
      }
    } catch (err: any) {
      // срабатывает если ошибка с соид-ем инте-та
      dispatch(appActions.appSetError(err.message + " 😠")); //диспатчим сообщение ошибки
      dispatch(appActions.appSetLoadingStatus("failed")); //диспатчим состояние загрузки(убираем спиннер)
      return rejectWithValue(null);
    } finally {
      dispatch(todosActions.entityStatusAC({ todoId, entityStatus: "idle" })); //диспатчим состояние раздизейбл кн удаления
    }
  }
);

export const changeTodoTitleTC = createAppAsyncThunk<
  { todoId: string; title: string },
  { todoId: string; title: string }
>("todos/updateTodoTc", async (arg, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  dispatch(appActions.appSetLoadingStatus("loading"));

  try {
    const res = await todolistAPI.updateTodolist(arg.todoId, arg.title);
    if (res.data.resultCode === 0) {
      dispatch(appActions.appSetLoadingStatus("succeeded"));
      return { todoId: arg.todoId, title: arg.title };
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const todosReducer = slice.reducer;
export const todosActions = slice.actions;
export const todosThunk = { setTodosTC, removeTodoTC, addTodoTC: addTodoTC, changeTodoTitleTC };
