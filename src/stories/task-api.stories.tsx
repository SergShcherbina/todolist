
import React, { useEffect, useState, ChangeEvent } from 'react'
import { taskApi } from '../api/todolist-api';

export default {
    title: 'API'
}


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)

    const onHandlerGetTasks = () => {
        const todolistId = '3894ef1b-4ee8-475d-b93a-b399652de6f6'
        taskApi.getTasks(todolistId)
            .then(res => {
                setState(res.data.items)
            })
    }

    useEffect(onHandlerGetTasks, [])

    return <div>
        <button
            onClick={onHandlerGetTasks}
        >get tasks</button>
        {state &&
            <ol>{state.map((el: any) => <li style={{ 'padding': '3px' }}> ID: {JSON.stringify(el.id)}, TITLE: {JSON.stringify(el.title)}</li>)}
                <br />
                <div>{JSON.stringify(state)}</div>
            </ol>}
    </div>
}

export const AddTasks = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('')

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onClickHandlerGetTasks = (title: string) => {
        const todolistId = '3894ef1b-4ee8-475d-b93a-b399652de6f6'
        taskApi.addTask(todolistId, title)
            .then(res => {
                setState(res.data.data.item)
            })
            .finally(()=> {
                setTitle('')
            })
    }

    return <div>
        <input type="text" value={title} onChange={onChangeTitle} />
        <button
            onClick={() => onClickHandlerGetTasks(title)}
        >add task</button>
        <div>{JSON.stringify(state)}</div>
    </div>
}

export const DelTasks = () => {
    const [state, setState] = useState<any>(null)
    const [taskId, setTaskId] = useState('')

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskId(e.currentTarget.value)
    }
    const onClickHandlerDelTasks = () => {
        const todolistId = '3894ef1b-4ee8-475d-b93a-b399652de6f6'
        taskApi.delTask(todolistId, taskId)
            .then(res => {
                setState(res.data)
                setTaskId('')
            })
            .finally(()=> {
                setTaskId('')
            })
    }
    return <div>
        <input 
            placeholder='введите id '
            type="text" 
            value={taskId} 
            onChange={onChangeValue} />
        <button
            onClick={() => onClickHandlerDelTasks()}
        >delete task</button>
        <div>{JSON.stringify(state)}</div>
    </div>
}
export const UpdateTasks = () => {
    const [state, setState] = useState<any>(null)
    const [taskId, setTaskId] = useState('')
    const [title, setTitle] = useState<string>('')

    const onChangeID = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskId(e.currentTarget.value)
    }
    const onChangeValueTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onClickHandler = () => {
        const todolistId = '3894ef1b-4ee8-475d-b93a-b399652de6f6'
        taskApi.updateTask(todolistId, taskId, title)
            .then(res => {
                setState(res.data)
            })
            .finally(()=> {
                setTaskId('')
                setTitle('')
            })
    }
    
    return <div>
    <input 
        placeholder='name task '
        type="text" 
        value={ title} 
        onChange={ onChangeValueTitle} />
    <input 
        placeholder='task id '
        type="text" 
        value={taskId} 
        onChange={onChangeID} />
    <button
        onClick={onClickHandler}
    >update task</button>
    <div>{JSON.stringify(state)}</div>
</div>
}


