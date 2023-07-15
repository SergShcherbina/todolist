import React, { FC, memo, useCallback } from "react";
import s from "./todolist.module.css";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { useActions } from "common/hooks/useActions";
import { TodolistType } from "features/todolistList/todolist/model/todolists-reducer";
import { taskThunk } from "features/todolistList/tasks/model/tasks-reducer";
import { FilterButtons } from "features/todolistList/tasks/ui/FilterButton";
import { TodolistTitle } from "features/todolistList/todolist/ui/TodolistTitle";
import { Tasks } from "features/todolistList/tasks/ui/Tasks";

type Props = {
  todo: TodolistType;
};

export const Todolist: FC<Props> = memo(({ todo }) => {
  const { addTaskTC } = useActions(taskThunk);

  const addTaskCallback = useCallback((title: string) => {
    return addTaskTC({ todoId: todo.id, title }).unwrap();
  }, []);

  return (
    <div>
      <TodolistTitle todo={todo} />
      <AddItemForm addItem={addTaskCallback} isDisabled={todo.entityStatus === "loading"} />
      <Tasks todo={todo} />
      <div className={s.wrapperButton}>
        <FilterButtons todo={todo} />
      </div>
    </div>
  );
});
