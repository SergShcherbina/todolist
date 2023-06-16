import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';

import {
    addTodolistTC,
    changeTodolistFilterAC,
    removeTodolistTC, setTodolistTC, TodolistType, updateTodolistTC,
} from './state/todolists-reducer';
import {
    addTaskTC,
    changeTaskTC,
    removeTaskTC,
} from './state/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatchType, AppRootStateType} from './state/store';
import {TaskStatuses, TaskType} from "./api/todolist-api";
//импортируем только нужны компоненты, а не всю библиотеку
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Menu from "@mui/icons-material/Menu";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorSnackbars} from "./Components/ErrorSnackbar/ErrorSnackbar";

export type FilterValuesType = "all" | "active" | "completed";
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const status = useSelector<AppRootStateType, string >(state => state.app.status)
    const dispatch = useDispatch<AppDispatchType>();                                //типизируем для thunk

    useEffect(() => {
        dispatch(setTodolistTC())
    }, [])

    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTaskTC(todolistId, id));
    }, [dispatch])

    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskTC(todolistId, title));
    }, [dispatch])

    const changeTaskStatus = useCallback((taskId: string, todolistId: string, isDone: boolean) => {
        const status: TaskStatuses = isDone ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(changeTaskTC(taskId, todolistId, {status}));
    }, [dispatch])

    const changeTaskTitle = useCallback((taskId: string, newTitle: string, todolistId: string) => {
        dispatch(changeTaskTC(taskId, todolistId, {title: newTitle}));
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [dispatch])

    const removeTodolist = useCallback((todoId: string) => {
        dispatch(removeTodolistTC(todoId));
    }, [dispatch])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(updateTodolistTC(id, title));
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, [dispatch])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {/*добавляем линию прогресса из @mui материалUI, добавляем условный рендериг */}
                {status === 'loading' && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            return <Grid item key={tl.id}>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist
                                        todolistId={tl.id}
                                        title={tl.title}
                                        tasks={tasks[tl.id]}
                                        changeFilter={changeFilter}
                                        removeTask={removeTask}
                                        addTask={addTask}
                                        changeTaskStatus={changeTaskStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                        entityStatus={tl.entityStatus}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
            {/*компонента алерт ошибки из материалUI*/}
            <ErrorSnackbars/>
        </div>
    );
}

export default AppWithRedux;
