import React, { memo, useCallback } from "react";
import { AddItemForm } from "Components/AddItemForm/AddItemForm";
import { EditableSpan } from "Components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TaskRedux } from "./Task/Task";
import { FilterButton } from "./Task/FilterButton";
import { changeTaskTC, FlexType, taskThunk } from "../tasks-reducer";
import { useDispatch } from "react-redux";
import { AppDispatchType } from "app/store";
import { TaskStatuses, TaskType } from "api/todolist-api";
import { RequestStatusType } from "app/app-reducer";
import { todosActions, todosThunk } from "../todolists-reducer";

export type FilterValuesType = "all" | "active" | "completed";
type PropsType = {
  todolistId: string;
  title: string;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
  tasks: TaskType[];
};

export const Todolist = memo((props: PropsType) => {
  const dispatch = useDispatch<AppDispatchType>(); //без типизации <AppDispatchType> будет ругаться при диспатче thunk

  const removeTask = useCallback(
    (id: string) => {
      dispatch(taskThunk.removeTaskTC({ todoId: props.todolistId, taskId: id }));
    },
    [dispatch]
  );

  const addTask = useCallback(
    (title: string) => {
      dispatch(taskThunk.addTaskTC({ todoId: props.todolistId, title }));
    },
    [dispatch]
  );

  const changeTaskStatus = useCallback(
    (taskId: string, isDone: boolean) => {
      const status: TaskStatuses = isDone ? TaskStatuses.Completed : TaskStatuses.New;
      dispatch(taskThunk.changeTaskTC({ taskId, todoId: props.todolistId, domainModal: { status } }));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (taskId: string, title: string) => {
      dispatch(taskThunk.changeTaskTC({ taskId, todoId: props.todolistId, domainModal: { title } }));
    },
    [dispatch]
  );

  const removeTodolist = useCallback(() => {
    dispatch(todosThunk.removeTodoTC(props.todolistId));
  }, [dispatch]);

  const changeTodolistTitle = useCallback(
    (title: string) => {
      dispatch(todosThunk.changeTodoTitleTC({ todoId: props.todolistId, title }));
    },
    [dispatch]
  );

  const changeFilter = useCallback(
    (filter: FilterValuesType) => {
      dispatch(todosActions.changeTodolistFilterAC({ todoId: props.todolistId, filter }));
    },
    [dispatch]
  );

  let tasks = props.tasks;
  if (props.filter === "active") {
    tasks = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.filter === "completed") {
    tasks = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} onChange={changeTodolistTitle} />
        <IconButton onClick={removeTodolist} disabled={props.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={props.entityStatus === "loading"} />
      <div>
        {tasks?.map((t) => {
          return (
            <TaskRedux
              key={t.id}
              task={t}
              todolistId={props.todolistId}
              removeTask={removeTask}
              changeTaskStatus={changeTaskStatus}
              changeTaskTitle={changeTaskTitle}
              entityTaskStatus={t.entityTaskStatus}
            />
          );
        })}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterButton
          variant={props.filter === "all" ? "outlined" : "text"}
          onClick={changeFilter}
          color={"inherit"}
          title={"all"}
        />
        <FilterButton
          variant={props.filter === "active" ? "outlined" : "text"}
          onClick={changeFilter}
          color={"primary"}
          title={"active"}
        />
        <FilterButton
          variant={props.filter === "completed" ? "outlined" : "text"}
          onClick={changeFilter}
          color={"secondary"}
          title={"completed"}
        />
      </div>
    </div>
  );
});
