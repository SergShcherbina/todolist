import React, { ChangeEvent, memo, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "../../../../Components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { AppDispatchType } from "../../../../app/store";
import { TaskStatuses, TaskType } from "../../../../api/todolist-api";

export type TaskPropsType = {
  task: TaskType;
  todolistId: string;
  removeTask: (taskId: string) => void;
  changeTaskStatus: (taskId: string, isDone: boolean) => void;
  changeTaskTitle: (taskId: string, newValue: string) => void;
  entityTaskStatus?: boolean;
};

export const TaskRedux = memo((props: TaskPropsType) => {
  const dispatch = useDispatch<AppDispatchType>();
  // const isDisabled = useSelector<AppRootStateType, boolean>(state => state.app.isDisabled)

  const onClickHandlerRemove = useCallback(() => {
    props.removeTask(props.task.id);
  }, [dispatch]);

  const onChangeTaskStatus = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      props.changeTaskStatus(props.task.id, newIsDoneValue);
    },
    [props.task]
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      props.changeTaskTitle(props.task.id, newValue);
    },
    [dispatch]
  );

  return (
    <div className={props.task.status ? "is-done" : ""}>
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeTaskStatus}
        disabled={props.entityTaskStatus}
      />

      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} disabled={props.entityTaskStatus} />
      <IconButton onClick={onClickHandlerRemove} disabled={props.entityTaskStatus}>
        <Delete />
      </IconButton>
    </div>
  );
});
