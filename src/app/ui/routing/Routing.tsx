import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { TodolistList } from "features/todolistList/TodolistList";
import { Login } from "features/login/ui/Login";
import Container from "@mui/material/Container";

export const Routing = () => {
  return (
    <Container fixed>
      <Routes>
        <Route path={"/"} element={<TodolistList />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/404"} element={<h1>404: PAGE NOTE FOUND</h1>} />
        <Route path={"/*"} element={<Navigate to={"/404"} />} />
      </Routes>
    </Container>
  );
};
