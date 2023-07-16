import React, { FC } from "react";
import { Button } from "@mui/material";
import { TodolistType, todosActions } from "features/todolistList/todolist/model/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";

export type FilterValuesType = "all" | "active" | "completed";
type Props = { todo: TodolistType };

export const FilterButtons: FC<Props> = React.memo(({ todo }) => {
  const dispatch = useAppDispatch();

  const changeFilter = (filter: FilterValuesType) => {
    dispatch(todosActions.changeTodoFilterAC({ todoId: todo.id, filter }));
  };

  return (
    <>
      <Button
        variant={todo.filter === "all" ? "outlined" : "text"}
        onClick={() => changeFilter("all")}
        color={"inherit"}
      >
        {"all"}
      </Button>
      <Button
        variant={todo.filter === "active" ? "outlined" : "text"}
        onClick={() => changeFilter("active")}
        color={"primary"}
        title={"active"}
      >
        {"active"}
      </Button>
      <Button
        variant={todo.filter === "completed" ? "outlined" : "text"}
        onClick={() => changeFilter("completed")}
        color={"secondary"}
      >
        {"completed"}
      </Button>
    </>
  );
});
