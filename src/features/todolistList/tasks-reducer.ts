import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsAT} from './todolists-reducer';
import {Dispatch} from "redux";
import {ResultCode, taskApi, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType} from "../../api/todolist-api";
import {AppRootStateType} from "../../app/store";
import {TasksStateType} from "../../app/AppWithRedux";
import {appSetErrorAC, appSetLoadingStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error.utils";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    model: UpdateTaskModelType
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    model: UpdateTaskModelType
}
export type SetTasksAT = ReturnType<typeof setTasksAC>
export type EntityTaskStatus = ReturnType<typeof entityTaskStatusAC>

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsAT
    | SetTasksAT
    | EntityTaskStatus

const initialState: TasksStateType = {
    /*"todolistId1": [
       { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
       { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
       { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
   ],
   "todolistId2": [
       { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
       { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
       { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
           startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
   ]*/
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            return {
                ...state, [action.todolistId]: [...state[action.todolistId], {...action.task, entityTaskStatus: false}]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            };
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        //пишем кейс для добавления пустого массива тасок в каждый тудулист
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            //так как с сервера возвращается массив тудулистов, а осоциативного массива полностью пустой
            //пробегаем по массиву тудулистов получ-го с сервера и к копии каждого тудулиста[по id] доб пустой массив тасок
            action.todos.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'SET-TASKS' : {
            return {...state, [action.todolistID]: action.tasks.map((t) => ({...t, entityTaskStatus: false}))}
        }
        case 'ENTITY-TASK-STATUS': {
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map((t) => (t.id === action.taskId ? {...t, entityTaskStatus: action.entityTaskStatus} : t ))
            }
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (todolistId: string, task: TaskType) => {
    return {type: 'ADD-TASK', todolistId, task} as const
}
export const changeTaskStatusAC = (taskId: string, model: UpdateTaskModelType, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', model, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, model: UpdateTaskModelType, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', model, todolistId, taskId}
}
export const setTasksAC = (tasks: TaskType[], todolistID: string,) => {
    return {type: 'SET-TASKS', tasks, todolistID} as const
}
export const entityTaskStatusAC = (todolistId: string, taskId: string, entityTaskStatus: boolean) => {
    return {type: 'ENTITY-TASK-STATUS', todolistId, taskId, entityTaskStatus} as const
}

export const fetchTasksTC = (todolistID: string) => {
    return (dispatch: Dispatch) => {
        dispatch(appSetLoadingStatusAC('loading'))
        taskApi.getTasks(todolistID)
            .then((res) => {
                const tasks = res.data.items
                dispatch(setTasksAC(tasks, todolistID))
                dispatch(appSetLoadingStatusAC('succeeded'))
            })
            .catch((err) => {
                handleServerNetworkError(err, dispatch)
            })
    }
}
export const removeTaskTC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(appSetLoadingStatusAC('loading'))
        dispatch(entityTaskStatusAC(todolistId, taskId, true))
        taskApi.delTask(todolistId, taskId)
            .then(res => {
                if(res.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskId, todolistId))
                    dispatch(appSetLoadingStatusAC('succeeded'))
                } else {
                    handleServerAppError(res , dispatch)
                }
            })
            .catch((err) => {
                handleServerNetworkError(err, dispatch)
            })
            .finally(() => {
                dispatch(entityTaskStatusAC(todolistId, taskId, false))
            })
    }
}
export const addTaskTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(appSetLoadingStatusAC('loading'))
        taskApi.addTask(todolistId, title)
            .then(res => {
                if(res.data.resultCode === ResultCode.COMPLETED) {
                    dispatch(addTaskAC(todolistId, res.data.data.item))
                    dispatch(appSetLoadingStatusAC('succeeded'))
                } else {
                    handleServerAppError(res, dispatch)
                }
            })
            .catch((err) => {
                handleServerNetworkError(err, dispatch)
            })
    }
}

/////////////////////общая санка для смены status & title с типизацией /////////////
type FlexType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export const changeTaskTC = (taskId: string, todolistId: string, data: FlexType,) => {
    //типизация getState : () => AppRootStateType
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(appSetLoadingStatusAC('loading'))
        const task = getState().tasks[todolistId].find(t => t.id === taskId)
        if (task) {
            const model: UpdateTaskModelType = {
                title: task.title,
                startDate: task.startDate,
                description: task.description,
                priority: task.priority,
                deadline: task.deadline,
                status: task.status,
                ...data
            }
            taskApi.updateTask(todolistId, taskId, model)
                .then(res => {
                    if(res.data.resultCode === 0) {
                        dispatch(changeTaskStatusAC(taskId, model, todolistId))
                        dispatch(appSetLoadingStatusAC('succeeded'))
                    } else {
                        handleServerAppError(res, dispatch)
                    }
                })
                .catch((err) => {
                    handleServerNetworkError(err, dispatch)
                })
        }
    }
}