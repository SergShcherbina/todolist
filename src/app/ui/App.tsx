import React, { useEffect } from "react";
//импортируем только нужны компоненты, а не всю библиотеку
import { ErrorSnackbars } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { authThunk } from "features/login/model/auth-reducer";
import { CircularProgress } from "@mui/material";
import { TaskType } from "features/todolistList/tasks/api/task-api";
import { selectors } from "common/selectots/common-selector";
import { useActions } from "common/hooks/useActions";
import { useAppSelector } from "common/hooks/useAppSelector";
import { Header } from "app/ui/header/Header";
import { Routing } from "app/ui/routing/Routing";
import styled from "styled-components";

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  const isInitialized = useAppSelector(selectors.isInitializedSelector);
  const { isLoggedAppTC } = useActions(authThunk);

  useEffect(() => {
    isLoggedAppTC({});
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <DivApp>
      <Header />
      <Routing />
      <ErrorSnackbars />
    </DivApp>
  );
}

export default App;

const DivApp = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-content: center;
`;
