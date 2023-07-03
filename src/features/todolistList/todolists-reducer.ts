import { ResultCode, todolistAPI, TodolistApiType } from "api/todolist-api";
import { Dispatch } from "redux";
import { appActions, RequestStatusType } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error.utils";
import { AxiosError } from "axios";
import { FilterValuesType } from "./Todolist/Todolist";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

export type RemoveTodolistActionType = {
  type: "REMOVE-TODOLIST";
  id: string;
};
export type AddTodolistActionType = {
  type: "ADD-TODOLIST";
  todo: TodolistApiType;
};
export type ChangeTodolistTitleActionType = {
  type: "CHANGE-TODOLIST-TITLE";
  id: string;
  title: string;
};
export type ChangeTodolistFilterActionType = {
  type: "CHANGE-TODOLIST-FILTER";
  id: string;
  filter: FilterValuesType;
};
export type SetTodolistsAT = ReturnType<typeof todosActions.setTodolistAC>;
// export type EntityStatusAT = ReturnType<typeof entityStatusAC>;
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | SetTodolistsAT;
// | EntityStatusAT;

const initialState: Array<TodolistType> = [];
//
// export const todolistsReducer = (
//   state: Array<TodolistType> = initialState,
//   action: ActionsType
// ): Array<TodolistType> => {
//   switch (action.type) {
//     case "SET-TODOLISTS": {
//       //к полученными тудулистам добавляем filter: 'all', так как с сервера приходит без него
//       return action.todos.map((td) => ({ ...td, filter: "all", entityStatus: "idle" }));
//     }
//     case "REMOVE-TODOLIST": {
//       return state.filter((tl) => tl.id !== action.id);
//     }
//     case "ADD-TODOLIST": {
//       return [{ ...action.todo, filter: "all", entityStatus: "idle" }, ...state];
//     }
//     case "CHANGE-TODOLIST-TITLE": {
//       const todolist = state.find((tl) => tl.id === action.id);
//       if (todolist) {
//         // если нашёлся - изменим ему заголовок
//         todolist.title = action.title;
//       }
//       return [...state];
//     }
//     case "CHANGE-TODOLIST-FILTER": {
//       const todolist = state.find((tl) => tl.id === action.id);
//       if (todolist) {
//         // если нашёлся - изменим ему заголовок
//         todolist.filter = action.filter;
//       }
//       return [...state];
//     }
//     case "ENTITY-STATUS": {
//       return [
//         ...state.map((tl) =>
//           tl.id === action.todolistId
//             ? {
//                 ...tl,
//                 entityStatus: action.entityStatus,
//               }
//             : tl
//         ),
//       ];
//     }
//     default:
//       return state;
//   }
// };
//
// export const todosActions.setTodolistAC = (todos: TodolistApiType[]) => {
//   return { type: "SET-TODOLISTS", todos } as const;
// };
// export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
//   return { type: "REMOVE-TODOLIST", id: todolistId };
// };
// export const addTodolistAC = (todo: TodolistApiType): AddTodolistActionType => {
//   return { type: "ADD-TODOLIST", todo };
// };
// export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
//   return { type: "CHANGE-TODOLIST-TITLE", id: id, title: title };
// };
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
//   return { type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter };
// };
// export const entityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
//   ({ type: "ENTITY-STATUS", todolistId, entityStatus } as const);

const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodolistAC: (state, action: PayloadAction<{ todos: TodolistApiType[] }>) => {
      return action.payload.todos.map((td) => ({ ...td, filter: "all", entityStatus: "idle" }));
    },
    removeTodolistAC: (state, action: PayloadAction<{ todoId: any }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todoId); //ищем индекс тудулиста в массиве
      state.splice(index, 1); //по индексу удаляем из массива
    },
    addTodolistAC: (state, action: PayloadAction<{ todo: TodolistApiType }>) => {
      state.unshift({ ...action.payload.todo, filter: "all", entityStatus: "idle" });
    },
    changeTodolistTitleAC: (state, action: PayloadAction<{ todoId: string; title: string }>) => {
      state.forEach((tl) => (tl.id === action.payload.todoId ? (tl.title = action.payload.title) : tl));
    },
    changeTodolistFilterAC: (state, action: PayloadAction<{ todoId: string; filter: FilterValuesType }>) => {
      state.forEach((tl) => (tl.id === action.payload.todoId ? (tl.filter = action.payload.filter) : tl));
    },
    entityStatusAC: (state, action: PayloadAction<{ todoId: string; entityStatus: RequestStatusType }>) => {
      state.forEach((tl) => (tl.id === action.payload.todoId ? (tl.entityStatus = action.payload.entityStatus) : tl));
    },
  },
});

export const todosReducer = slice.reducer;
export const todosActions = slice.actions;

export const setTodolistTC = () => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    todolistAPI
      .getTodolists()
      .then((res) => {
        dispatch(todosActions.setTodolistAC({ todos: res.data }));
        dispatch(appActions.appSetLoadingStatus("succeeded"));
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch);
      });
  };
};
export const removeTodolistTC = (todoId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.appSetLoadingStatus("loading")); //запуск спиннера загрузки
    dispatch(todosActions.entityStatusAC({ todoId, entityStatus: "loading" })); //диспатчим состояние дизейблим кн удаления
    todolistAPI
      .deleteTodolist(todoId)
      .then((res) => {
        if (res.data.resultCode === ResultCode.COMPLETED) {
          //если с сервера придет полож код(доки API), enum
          dispatch(todosActions.removeTodolistAC({ todoId }));
          dispatch(appActions.appSetLoadingStatus("succeeded"));
        } else {
          //в противном случае (ошибка):
          if (res.data.messages.length > 0) {
            //проверяем наличие сообщения ошибки
            dispatch(appActions.appSetError(res.data.messages[0])); //диспатчим его в компоненту
          } else {
            dispatch(appActions.appSetError("error + 😠")); //диспатчим свой текст ошибки
          }
          dispatch(appActions.appSetLoadingStatus("failed")); //диспатчим состояние загрузки(убираем спиннер)
        }
      })
      .catch((err: AxiosError<ErrType>) => {
        //срабатывает если ошибка с соид-ем инте-та
        dispatch(appActions.appSetError(err.message + " 😠")); //диспатчим сообщение ошибки
        dispatch(appActions.appSetLoadingStatus("failed")); //диспатчим состояние загрузки(убираем спиннер)
      })
      .finally(() => {
        dispatch(todosActions.entityStatusAC({ todoId, entityStatus: "idle" })); //диспатчим состояние раздизейбл кн удаления
      });
  };
};
export const addTodolistTC = (title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    todolistAPI
      .createTodolist(title)
      .then((res) => {
        if (res.data.resultCode === ResultCode.COMPLETED) {
          dispatch(todosActions.addTodolistAC({ todo: res.data.data.item }));
          dispatch(appActions.appSetLoadingStatus("succeeded"));
        } else {
          handleServerAppError(res, dispatch); //вынесли кусок кода в дженериковую ф-ю
        }
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch); //вынесли кусок кода в ф-ю
      });
  };
};
export const updateTodolistTC = (todoId: string, title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.appSetLoadingStatus("loading"));
    todolistAPI
      .updateTodolist(todoId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(todosActions.changeTodolistTitleAC({ todoId, title }));
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

type ErrType = {
  code: number;
  config: number;
  message: string;
  name: string;
  request: any;
  stack: string;
};
