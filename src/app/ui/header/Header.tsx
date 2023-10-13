import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from "@mui/material/AppBar";
import { useAppSelector } from "common/hooks/useAppSelector";
import { selectors } from "common/selectots/common-selector";
import { useActions } from "common/hooks/useActions";
import { authThunk } from "features/login/model/auth-reducer";

export const Header = () => {
  const isLoggedIn = useAppSelector(selectors.isLoggedInSelector);
  const status = useAppSelector(selectors.statusSelector);
  const { logOutTC } = useActions(authThunk);

  const handlerLogOut = () => {
    logOutTC(false);
  };
  return (
    <AppBar position="static" sx={{ color: "#fff", background: "#8448e8" }}>
      <Toolbar>
        {/*<IconButton edge="start" color="inherit" aria-label="menu">*/}
        {/*  <Menu />*/}
        {/*</IconButton>*/}
        {/*<Typography variant="h6">News</Typography>*/}
        {isLoggedIn && (
          <Button color="inherit" onClick={handlerLogOut} size={"large"}>
            Log out
          </Button>
        )}
      </Toolbar>
      {status === "loading" && <LinearProgress color="secondary" />}
    </AppBar>
  );
};
