import Grid from "@mui/material/Grid";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import React, { useCallback } from "react";
import { todosThunk } from "features/todolistList/todolist/model/todolists-reducer";
import { Navigate } from "react-router-dom";
import { selectors } from "common/selectots/common-selector";
import { useActions } from "common/hooks/useActions";
import { useAppSelector } from "common/hooks/useAppSelector";
import { Todolist } from "features/todolistList/todolist/ui/Todolist";

export const TodolistList = () => {
  const todolists = useAppSelector(selectors.todosSelector);
  const isLoggedIn = useAppSelector(selectors.isLoggedInSelector);
  const { addTodoTC } = useActions(todosThunk);

  const addTodolist = useCallback((title: string) => {
    return addTodoTC(title).unwrap();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />; //если isLoggedIn false - перенаправляем на /login
  }

  return (
    <>
      <Grid container style={{ padding: "20px", justifyContent: "center" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={1} style={{ justifyContent: "center" }}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id} sx={{ gap: "15px" }}>
              <Paper style={{ padding: "10px 10px 20px 20px" }}>
                <Todolist key={tl.id} todo={tl} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
