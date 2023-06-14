import React, {ChangeEvent, memo, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {AppDispatchType} from "./state/store";
import {TaskStatuses, TaskType} from "./api/todolist-api";

export type  TaskPropsType = {
    task: TaskType
    todolistId: string
    removeTask: (taskId: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean) => void
    changeTaskTitle: (taskId: string, newValue: string, todolistId: string) => void
}

export const TaskRedux = memo((props: TaskPropsType) => {
    const dispatch = useDispatch<AppDispatchType>();

    const onClickHandlerRemove = useCallback(() => {
        props.removeTask(props.task.id, props.todolistId)
    }, [dispatch, props.todolistId])

    const onChangeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.changeTaskStatus(props.task.id, newIsDoneValue)
    }, [props.task]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todolistId)
    }, [dispatch, props.todolistId]);

    return <div className={props.task.status ? "is-done" : ""}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeTaskStatus}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandlerRemove}>
            <Delete/>
        </IconButton>
    </div>

})

