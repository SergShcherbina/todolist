import Grid from "@mui/material/Grid";
import { AddItemForm } from "common/Components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import { Todolist } from "./Todolist/Todolist";
import React, { useCallback } from "react";
import { todosThunk } from "./todolists-reducer";
import { Navigate } from "react-router-dom";
import { selectors } from "common/selectots/common.selector";
import { useActions } from "common/hooks/useActions";
import { useAppSelector } from "common/hooks/useAppSelector";

export const TodolistList = () => {
  const todos = useAppSelector(selectors.todosSelector);
  const tasks = useAppSelector(selectors.tasksSelector);
  const isLoggedIn = useAppSelector(selectors.isLoggedInSelector); //протипизированный хук useAppSelector
  const { addTodoTC } = useActions(todosThunk);

  const addTodolist = useCallback((title: string) => {
    addTodoTC(title);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />; //если isLoggedIn false - перенаправляем на /login
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todos.map((tl) => {
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
