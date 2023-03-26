import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { FilterValuesType } from './App';
import { useAutoAnimate } from "@formkit/auto-animate/react";              //скрипт для авто анимации списка
import './Todolist.css'
import { AddItemForm } from './AddItemForm ';
import { Button, Checkbox, IconButton, List } from '@mui/material';
import {Delete} from '@mui/icons-material'
import {DeleteForever, CancelPresentation} from '@mui/icons-material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { pink } from '@mui/material/colors';
import { EditableSpan } from './EditableSpan';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListId: string) => void
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    onChangeStatusChecked: (taskId: string, newIsDone: boolean, todoListId: string) => void
    filter: string
    id: string
    removeTodolist: (todolistId: string) => void
    changeTitle: (todolistId: string, taskID: string, newTitle: string)=>void
    onChangeTitleTodolist:(todolistId: string, newTitle: string)=>void
}

export function Todolist(props: PropsType) {
    const [refLi] = useAutoAnimate<HTMLUListElement>()                              //даем название ссылке для авто анимации

    const addTask = (value: string) => {
        props.addTask(value, props.id);
    }

    const onChangeStatusHandler = (taskId: string, newIsDone: boolean) => {
        props.onChangeStatusChecked(taskId, newIsDone, props.id)
    }

    const onChangeTitleTodolist = (newTitle: string) => {
        props.onChangeTitleTodolist(props.id, newTitle)
    }

    //функция которая возвращает колбек функции с переданным параметром 
    const onFilterClickHandler = (filter: FilterValuesType) => () => props.changeFilter(filter, props.id)

    return <div className={'wrapperTodolist'}>
        <h3>
            <EditableSpan value={props.title} onChange={onChangeTitleTodolist}/>
            <Button onClick={() => props.removeTodolist(props.id)}  ><DeleteSweepIcon fontSize={"medium"} sx={{ color: pink[500] }}/></Button>
        </h3>
        <AddItemForm addItem={addTask} />

        <List ref={refLi}>
            {
                props.tasks.map(t => {
                    
                    const onClickHandler = () => props.removeTask(t.id, props.id)

                    const onChange = (newTitle: string) => {
                        props.changeTitle(props.id, t.id, newTitle)
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : 'listTasks'}>
                        <Checkbox
                            onChange={() => onChangeStatusHandler(t.id, !t.isDone)}
                            checked={t.isDone}
                        />
                        <EditableSpan value={t.title} onChange={onChange}/>
                        <IconButton  size={'small'} onClick={onClickHandler}>< DeleteForever /></IconButton >                        
                    </li>
                })
            }
        </List>
        <div>
            <Button variant={"outlined"}  size="small" color={props.filter === 'all' ? 'secondary' : 'primary'}
                onClick={onFilterClickHandler("all")}>All</Button>
            <Button variant={"outlined"} size="small" color={props.filter === 'active' ? 'secondary' : 'primary'}
                onClick={onFilterClickHandler("active")}>Active</Button>
            <Button variant={"outlined"} size="small" color={props.filter === 'completed' ? 'secondary' : 'primary'}
                onClick={onFilterClickHandler("completed")}>Completed</Button>
        </div>
    </div>
}
