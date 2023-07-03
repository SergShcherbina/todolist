import Grid from "@mui/material/Grid";
import { AddItemForm } from "Components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import { Todolist } from "./Todolist/Todolist";
import React, { useCallback, useEffect } from "react";
import { addTodolistTC, setTodolistTC, TodolistType } from "./todolists-reducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatchType, AppRootStateType, useAppSelector } from "app/store";
import { TasksStateType } from "app/AppWithRedux";
import { Navigate } from "react-router-dom";

export const TodolistList = () => {
  const todolists = useSelector<AppRootStateType, Array<TodolistType>>((state) => state.todolists);
  const tasks = useAppSelector<TasksStateType>((state) => state.tasks);
  const isLoggedIn = useAppSelector<boolean>((state) => state.autch.isLoggedIn); //протипизированный хук
  const dispatch = useDispatch<AppDispatchType>();

  useEffect(() => {
    dispatch(setTodolistTC());
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />; //если isLoggedIn false - перенаправляем на /login
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolistId={tl.id}
                  title={tl.title}
                  filter={tl.filter}
                  entityStatus={tl.entityStatus}
                  tasks={tasks[tl.id]}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
