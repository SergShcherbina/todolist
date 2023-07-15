import React, { ChangeEvent, memo, useCallback } from "react";
import s from "features/todolistList/tasks/task/task.module.css";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { TaskType } from "features/todolistList/tasks/api/task-api";
import { TaskStatuses } from "common/enums/common-enums";
import { useActions } from "common/hooks/useActions";
import { taskThunk } from "features/todolistList/tasks/model/tasks-reducer";

type Props = {
  task: TaskType;
  todoId: string;
};

export const Task: React.FC<Props> = memo(({ todoId, task }) => {
  const { removeTaskTC, changeTaskTC } = useActions(taskThunk);

  const removeTaskHandler = useCallback(() => {
    debugger;
    console.log("removeTaskHandler: ");
    removeTaskTC({ todoId, taskId: task.id });
  }, []);

  const onChangeTaskTitle = useCallback((title: string) => {
    changeTaskTC({ taskId: task.id, todoId, domainModal: { title } });
  }, []);

  const onChangeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    changeTaskTC({ taskId: task.id, todoId, domainModal: { status } });
  };

  return (
    <div className={task.status ? s.isDone : ""}>
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeTaskStatus}
        disabled={task.entityTaskStatus}
      />
      <EditableSpan value={task.title} onChange={onChangeTaskTitle} disabled={task.entityTaskStatus} />
      <IconButton onClick={removeTaskHandler} disabled={task.entityTaskStatus}>
        <Delete />
      </IconButton>
    </div>
  );
});
