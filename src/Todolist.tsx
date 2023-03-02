import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import {useAutoAnimate} from "@formkit/auto-animate/react";              //скрипт для авто анимации списка
import './Todolist.css'

type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
    onChangeStatusChecked: (idChecked: string, isDoneTask: boolean) => void
    filter: string
}

export function Todolist(props: PropsType) {

    let [title, setTitle] = useState("")
    let [error, setError] = useState('')
    const [refLi] = useAutoAnimate<HTMLUListElement>()                              //даем название ссылке для авто анимации


    const addTask = () => {
        if(title.trim() === '') {                                                   //записываем ошибку если отправляем пустой инпут
            setError('Title is required')
            return;
        } else {
            props.addTask(title.trim());
            setTitle("");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError('')
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {                                                    //поведение при нажатии на ввод
            addTask();
        }
    }
    const onChangeStatusHandler = (idChecked: string, isDoneTask: boolean) => {
        props.onChangeStatusChecked(idChecked, isDoneTask)
    }


    const onAllClickHandler = () => props.changeFilter("all");
    const onActiveClickHandler = () => { props.changeFilter("active")};
    const onCompletedClickHandler = () => props.changeFilter("completed");

    return <div className={'wrapperTodolist'}>
        <h3>{props.title}</h3>
        <div>
            <input value={title}
                   onChange={ onChangeHandler }
                   onKeyPress={ onKeyPressHandler }
                   className={error ? "error" : ''}
            />
            <button onClick={addTask}
                    disabled={ title ? false : true }>+</button>
            { error ? <div className={'error-message'}> {error} </div> : null}
        </div>

        <ul ref={refLi}>
            {
                props.tasks.map(t => {

                    const onClickHandler = () => props.removeTask(t.id)

                    return <li key={t.id} className={t.isDone ? "is-done" : 'listTasks'}>
                        <input type="checkbox"
                               onChange={()=>onChangeStatusHandler(t.id, t.isDone)}
                               checked={t.isDone}
                        />
                        <span>{t.title}</span>
                        <button onClick={ onClickHandler }>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={props.filter === 'all' ? 'active-filter' : 'filter'} onClick={ onAllClickHandler }>All</button>
            <button className={props.filter === 'active' ? 'active-filter' : 'filter'} onClick={ onActiveClickHandler }>Active</button>
            <button className={props.filter === 'completed' ? 'active-filter' : 'filter'} onClick={ onCompletedClickHandler }>Completed</button>
        </div>
    </div>
}
