import React, { useCallback } from "react";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TodolistType, todosThunk } from "features/todolistList/todolist/model/todolists-reducer";
import { useActions } from "common/hooks/useActions";

type Props = {
  todo: TodolistType;
};

export const TodolistTitle: React.FC<Props> = ({ todo }) => {
  const { changeTodoTitleTC, removeTodoTC } = useActions(todosThunk);

  const removeTodoHandler = useCallback(() => {
    removeTodoTC(todo.id);
  }, []);

  const onChangeTodoTitle = useCallback((title: string) => {
    changeTodoTitleTC({ todoId: todo.id, title });
  }, []);
  return (
    <h3>
      <EditableSpan value={todo.title} onChange={onChangeTodoTitle} />
      <IconButton onClick={removeTodoHandler} disabled={todo.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  );
};
