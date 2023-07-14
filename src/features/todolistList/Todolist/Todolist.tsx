import React, { memo, useCallback } from "react";
import { AddItemForm } from "common/Components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/Components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Task } from "./Task/Task";
import { FilterButton } from "./Task/FilterButton";
import { taskThunk } from "features/todolistList/Todolist/Task/tasks-reducer";
import { RequestStatusType } from "app/app-reducer";
import { todosActions, todosThunk } from "../todolists-reducer";
import { TaskType } from "features/todolistList/Todolist/Task/task.api";
import { TaskStatuses } from "common/enums/common.enums";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useActions } from "common/hooks/useActions";

export type FilterValuesType = "all" | "active" | "completed";
type PropsType = {
  todolistId: string;
  title: string;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
  tasks: TaskType[];
};

export const Todolist = memo((props: PropsType) => {
  const dispatch = useAppDispatch();
  const { removeTaskTC, addTaskTC, changeTaskTC } = useActions(taskThunk);
  const { changeTodoTitleTC, removeTodoTC } = useActions(todosThunk);

  const removeTask = useCallback((id: string) => {
    removeTaskTC({ todoId: props.todolistId, taskId: id });
  }, []);

  const addTask = useCallback((title: string) => {
    addTaskTC({ todoId: props.todolistId, title });
  }, []);

  const changeTaskStatus = useCallback((taskId: string, isDone: boolean) => {
    const status: TaskStatuses = isDone ? TaskStatuses.Completed : TaskStatuses.New;
    changeTaskTC({ taskId, todoId: props.todolistId, domainModal: { status } });
  }, []);

  const changeTaskTitle = useCallback((taskId: string, title: string) => {
    changeTaskTC({ taskId, todoId: props.todolistId, domainModal: { title } });
  }, []);

  const removeTodolist = useCallback(() => {
    removeTodoTC(props.todolistId);
  }, []);

  const changeTodolistTitle = useCallback((title: string) => {
    changeTodoTitleTC({ todoId: props.todolistId, title });
  }, []);

  const changeFilter = useCallback((filter: FilterValuesType) => {
    dispatch(todosActions.changeTodolistFilterAC({ todoId: props.todolistId, filter }));
  }, []);

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
            <Task
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
