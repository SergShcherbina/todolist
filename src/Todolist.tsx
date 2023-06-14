import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {TaskRedux} from "./Task";
import {FilterButton} from "./FilterButton";
import {addTaskTC, fetchTasksTC} from "./state/tasks-reducer";
import {useDispatch} from "react-redux";
import {AppDispatchType} from "./state/store";
import {FilterValuesType} from "./AppWithRedux";
import {TaskStatuses, TaskType, todolistAPI} from "./api/todolist-api";


type PropsType = {
    todolistId: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, todolistId: string, isDone: boolean) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = memo((props: PropsType) => {

    //без типизации <AppDispatchType> будет ругаться при диспатче thunk
    const dispatch = useDispatch<AppDispatchType>();

    useEffect(() => {
        dispatch(fetchTasksTC(props.todolistId))
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.todolistId)
    }, [props.todolistId])

    const changeTaskStatus = (taskId: string, isDone: boolean) => {
        props.changeTaskStatus(taskId, props.todolistId, isDone)
    }

    const removeTodolist = () => {
        props.removeTodolist(props.todolistId);
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolistId, title);
    }, [props.todolistId, props.changeTodolistTitle])

    const onFilterClickHandler = useCallback((filter: FilterValuesType) =>
        props.changeFilter(filter, props.todolistId), [props.changeFilter, props.todolistId]);

    let tasks = props.tasks
    if (props.filter === "active") {
        tasks = props.tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasks = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasks?.map(t => {
                    return (
                        <TaskRedux
                            key={t.id}
                            task={t}
                            todolistId={props.todolistId}
                            removeTask={props.removeTask}
                            changeTaskStatus={changeTaskStatus}
                            changeTaskTitle={props.changeTaskTitle}
                        />
                    )
                })
            }

        </div>
        <div style={{paddingTop: "10px"}}>
            <FilterButton
                variant={props.filter === 'all' ? 'outlined' : 'text'}
                onClick={onFilterClickHandler}
                color={'inherit'}
                title={'all'}/>
            <FilterButton
                variant={props.filter === 'active' ? 'outlined' : 'text'}
                onClick={onFilterClickHandler}
                color={'primary'}
                title={'active'}/>
            <FilterButton
                variant={props.filter === 'completed' ? 'outlined' : 'text'}
                onClick={onFilterClickHandler}
                color={'secondary'}
                title={'completed'}/>
        </div>
    </div>
})


