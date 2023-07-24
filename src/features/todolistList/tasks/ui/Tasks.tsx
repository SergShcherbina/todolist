import React, { FC } from "react";
import { Task } from "features/todolistList/tasks/ui/task/Task";
import { TaskStatuses } from "common/enums/common-enums";
import { useAppSelector } from "common/hooks/useAppSelector";
import { selectors } from "common/selectots/common-selector";
import { TodolistType } from "features/todolistList/todolist/model/todolists-reducer";

type Props = {
  todo: TodolistType;
};

export const Tasks: FC<Props> = ({ todo }) => {
  const domainTasks = useAppSelector(selectors.tasksSelector);

  let tasks = domainTasks[todo.id];
  if (todo.filter === "active") {
    tasks = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todo.filter === "completed") {
    tasks = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  return (
    <div>
      {tasks?.map((task) => {
        return <Task key={task.id} task={task} todoId={todo.id} />;
      })}
    </div>
  );
};
