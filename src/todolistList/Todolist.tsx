import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from '../AddItemForm';
import {EditableSpan} from '../EditableSpan';
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {TaskRedux} from "../Task";
import {FilterButton} from "../FilterButton";
import {addTaskTC, changeTaskTC, fetchTasksTC, removeTaskTC} from "../state/tasks-reducer";
import {useDispatch} from "react-redux";
import {AppDispatchType} from "../state/store";
import {TaskStatuses, TaskType} from "../api/todolist-api";
import {RequestStatusType} from "../app/app-reducer";
import {changeTodolistFilterAC, removeTodolistTC, updateTodolistTC} from "../state/todolists-reducer";

export type FilterValuesType = "all" | "active" | "completed";
type PropsType = {
    todolistId: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType
    tasks: TaskType[]
}


export const Todolist = memo((props: PropsType) => {
    const dispatch = useDispatch<AppDispatchType>();           //без типизации <AppDispatchType> будет ругаться при диспатче thunk

    useEffect(() => {
        dispatch(fetchTasksTC(props.todolistId))
    }, [])

    const removeTask = useCallback((id: string) => {
        dispatch(removeTaskTC(props.todolistId, id));
    }, [dispatch])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(props.todolistId, title));
    }, [dispatch])

    const changeTaskStatus = useCallback((taskId: string, isDone: boolean) => {
        const status: TaskStatuses = isDone ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(changeTaskTC(taskId, props.todolistId, {status}));
    }, [dispatch])

    const changeTaskTitle = useCallback((taskId: string, newTitle: string) => {
        dispatch(changeTaskTC(taskId, props.todolistId, {title: newTitle}));
    }, [dispatch])

    const removeTodolist = useCallback(() => {
        dispatch(removeTodolistTC(props.todolistId));
    }, [dispatch])

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(updateTodolistTC(props.todolistId, title));
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType) => {
        const action = changeTodolistFilterAC(props.todolistId, value);
        dispatch(action);
    }, [dispatch])

    let tasks = props.tasks
    if (props.filter === "active") {
        tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton
                onClick={removeTodolist}
                disabled={props.entityStatus === 'loading'}
            >
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.entityStatus === 'loading'}/>
        <div>
            {
                tasks?.map(t => {
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
                    )
                })
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <FilterButton
                variant={props.filter === 'all' ? 'outlined' : 'text'}
                onClick={changeFilter}
                color={'inherit'}
                title={'all'}/>
            <FilterButton
                variant={props.filter === 'active' ? 'outlined' : 'text'}
                onClick={changeFilter}
                color={'primary'}
                title={'active'}/>
            <FilterButton
                variant={props.filter === 'completed' ? 'outlined' : 'text'}
                onClick={changeFilter}
                color={'secondary'}
                title={'completed'}/>
        </div>
    </div>
})

