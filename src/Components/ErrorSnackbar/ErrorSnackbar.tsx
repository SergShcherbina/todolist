import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType, useAppSelector } from "app/store";
import { appActions } from "app/app-reducer";
import { appSelector } from "app/appSelector";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ErrorSnackbars = () => {
  const dispatch = useDispatch();
  const error = useAppSelector(appSelector.errorSelector);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(appActions.appSetError(null)); //зануляем ошибку в appReducer
  };

  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};