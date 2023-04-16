import React, { memo, useCallback} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import { TaskRedux} from "./Task";
import {FilterButton} from "./FilterButton";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = memo((props: PropsType)  => {

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [props.addTask, props.id])

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title);
    }, [props.id, props.changeTodolistTitle])

    const onFilterClickHandler = useCallback((filter: FilterValuesType) =>
        props.changeFilter(filter, props.id), [props.changeFilter,props.id]);

    let tasks = props.tasks
    if (props.filter === "active") {
        tasks = props.tasks.filter(t => !t.isDone);
    }
    if (props.filter === "completed"){
        tasks = props.tasks.filter(t => t.isDone);
    }

    // const removeTask = useCallback((taskId: string) => props.removeTask(taskId, props.id), [props.removeTask,props.id])
    //
    // const changeTaskStatus = useCallback((taskId: string, newIsDoneValue: boolean) => {
    //     props.changeTaskStatus(taskId, newIsDoneValue, props.id)}, [props.changeTaskStatus,props.id])
    //
    // const changeTaskTitle = useCallback((taskId: string, newValue: string) => {
    //     props.changeTaskTitle(taskId, newValue, props.id);
    // }, [props.changeTaskTitle,props.id])



    return <div>
        <h3> <EditableSpan value={props.title} onChange={changeTodolistTitle} />
            <IconButton onClick={removeTodolist}>
                <Delete />
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasks.map(t => {
                    return (
                        <TaskRedux
                            key={t.id}
                            task={t}
                            todolistId={props.id}
                        />
                    )
                })
            }

        </div>
        <div style={{ paddingTop: "10px"}}>
            <FilterButton
                variant={props.filter === 'all' ? 'outlined' : 'text'}
                onClick={onFilterClickHandler}
                color={'inherit'}
                title={'all'} />
            <FilterButton
                variant={props.filter === 'active' ? 'outlined' : 'text'}
                onClick={onFilterClickHandler}
                color={'primary'}
                title={'active'} />
            <FilterButton
                variant={props.filter === 'completed' ? 'outlined' : 'text'}
                onClick={onFilterClickHandler}
                color={'secondary'}
                title={'completed'} />
        </div>
    </div>
})


