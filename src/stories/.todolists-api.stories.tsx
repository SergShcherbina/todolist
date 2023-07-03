import React, { useEffect, useState } from "react";
import { todolistAPI } from "../api/todolist-api";

// export default {
//     title: 'API'
// }

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    todolistAPI.getTodolists().then((res) => {
      setState(res.data);
    });
  }, []);
  if (state) {
    return (
      <ul>
        {state.map((el: any) => (
          <li>{JSON.stringify(el)}</li>
        ))}
      </ul>
    );
  }
};
export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    todolistAPI.createTodolist("NAME-TODOLIST-22222").then((res) => {
      setState(res.data);
    });
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "6bc72eb3-83c2-407a-ab2a-454dba79b6fc";
    todolistAPI.deleteTodolist(todolistId).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "3894ef1b-4ee8-475d-b93a-b399652de6f6";
    setState(todolistAPI.updateTodolist(todolistId, "last todolist"));
  }, []);
  return <div> {JSON.stringify(state)}</div>;
};
