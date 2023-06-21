import React, {useEffect} from 'react';
import './App.css';
import {setTodolistTC} from './state/todolists-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatchType, AppRootStateType, useAppSelector} from './state/store';
import {TaskType} from "./api/todolist-api";
//импортируем только нужны компоненты, а не всю библиотеку
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/icons-material/Menu";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorSnackbars} from "./Components/ErrorSnackbar/ErrorSnackbar";
import {TodolistList} from "./todolistList/TodolistList";
import {Login} from "./login/Login";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {initializeAppTC, logOutTC} from "./login/authReducer";
import {RequestStatusType} from "./app/app-reducer";
import {CircularProgress} from "@mui/material";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.initialize)
    const isLoggedIn = useAppSelector<boolean>(state => state.autch.isLoggedIn)
    const dispatch = useDispatch<AppDispatchType>();                          //типизируем для thunk

   useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {                                                    //спиннер пока не проинициализируется приложение
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const handlerLogOut = () => {
        dispatch(logOutTC())
    }
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
                    {isLoggedIn && <Button
                        color="inherit"
                        onClick={handlerLogOut}
                    >Log out</Button>}
                </Toolbar>
                {/*добавляем линию прогресса из @mui материалUI, добавляем условный рендериг */}
                {status === 'loading' && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>

                <Routes>
                    <Route path={'/'} element={<TodolistList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    {/*страница с 404 адресом*/}
                    <Route path={'/404'} element={<h1>404: PAGE NOTE FOUND</h1>}/>
                    {/*при несущ-м url * перенаправлять на 404 стр*/}
                    <Route path={'/*'} element={<Navigate to={'/404'}/>}/>
                </Routes>

            </Container>
            {/*компонента алерт ошибки из материалUI*/}
            <ErrorSnackbars/>
        </div>
    );
}

export default AppWithRedux;
