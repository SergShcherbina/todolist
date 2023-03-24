import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { FilterValuesType } from './App';
import { useAutoAnimate } from "@formkit/auto-animate/react";              //скрипт для авто анимации списка
import './Todolist.css'
import { AddItemForm } from './AddItemForm ';

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
}

export function Todolist(props: PropsType) {
    const [refLi] = useAutoAnimate<HTMLUListElement>()                              //даем название ссылке для авто анимации

    const addTask = (value: string) => {
        props.addTask(value, props.id);
    }

    const onChangeStatusHandler = (taskId: string, newIsDone: boolean) => {
        console.log(newIsDone)
        props.onChangeStatusChecked(taskId, newIsDone, props.id)
    }

    //функция которая возвращает колбек функции с переданным параметром 
    const onFilterClickHandler = (filter: FilterValuesType) => () => props.changeFilter(filter, props.id)

    return <div className={'wrapperTodolist'}>
        <h3>{props.title}
            <button onClick={() => props.removeTodolist(props.id)} >x</button>
        </h3>
        <AddItemForm addItem={addTask} />

        <ul ref={refLi}>
            {
                props.tasks.map(t => {

                    const onClickHandler = () => props.removeTask(t.id, props.id)

                    return <li key={t.id} className={t.isDone ? "is-done" : 'listTasks'}>
                        <input type="checkbox"
                            onChange={() => onChangeStatusHandler(t.id, !t.isDone)}
                            checked={t.isDone}
                        />
                        <span>{t.title}</span>
                        <button onClick={onClickHandler}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={props.filter === 'all' ? 'active-filter' : 'filter'}
                onClick={onFilterClickHandler("all")}>All</button>
            <button className={props.filter === 'active' ? 'active-filter' : 'filter'}
                onClick={onFilterClickHandler("active")}>Active</button>
            <button className={props.filter === 'completed' ? 'active-filter' : 'filter'}
                onClick={onFilterClickHandler("completed")}>Completed</button>
        </div>
    </div>
}
