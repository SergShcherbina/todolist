import React, { useEffect } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { AppDispatchType, useAppSelector } from "./store";
//импортируем только нужны компоненты, а не всю библиотеку
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/icons-material/Menu";
import LinearProgress from "@mui/material/LinearProgress";
import { ErrorSnackbars } from "common/Components/ErrorSnackbar/ErrorSnackbar";
import { TodolistList } from "features/todolistList/TodolistList";
import { Login } from "features/login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { authThunk } from "features/login/authReducer";
import { CircularProgress } from "@mui/material";
import { TaskType } from "features/todolistList/Todolist/Task/task.api";
import { selectors } from "common/selectots/common.selector";

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  const status = useAppSelector(selectors.statusSelector);
  const isInitialized = useAppSelector(selectors.isInitializedSelector);
  const isLoggedIn = useAppSelector(selectors.isLoggedInSelector);
  const dispatch = useDispatch<AppDispatchType>(); //типизируем для thunk

  useEffect(() => {
    dispatch(authThunk.isLoggedAppTC()); //проверка авторизации
  }, []);

  const handlerLogOut = () => {
    dispatch(authThunk.logOutTC(false));
  };

  if (!isInitialized) {
    //спиннер пока не проинициализируется приложение
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={handlerLogOut}>
              Log out
            </Button>
          )}
        </Toolbar>
        {/*добавляем линию прогресса из @mui материалUI, добавляем условный рендериг */}
        {status === "loading" && <LinearProgress color="secondary" />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistList />} />
          <Route path={"/login"} element={<Login />} />
          {/*страница с 404 адресом*/}
          <Route path={"/404"} element={<h1>404: PAGE NOTE FOUND</h1>} />
          {/*при несущ-м url * перенаправлять на 404 стр*/}
          <Route path={"/*"} element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
      {/*компонента алерт ошибки из материалUI*/}
      <ErrorSnackbars />
    </div>
  );
}

export default App;