import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { useAppSelector } from "../../app/store";
import { loginTC } from "./authReducer";
import LinearProgress from "@mui/material/LinearProgress";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export const Login = () => {
  const statusLoading = useAppSelector((state) => state.app.status);
  const isLoggedIn = useAppSelector<boolean>((state) => state.autch.isLoggedIn);
  const dispatch = useAppDispatch(); //протипизированный dispatch

  const formik = useFormik({
    initialValues: {
      //name input/Field с начальными значениями
      email: "",
      password: "",
      rememberMe: false,
    },
    // валидация ошибок
    validate: (values) => {
      const errors: FormikErrorType = {}; //все ошибки сохраняем в объект errors
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 3) {
        errors.password = "Too short password";
      }
      return errors;
    },
    //метод срабатывает при отправке формы благодаря handleSubmit
    onSubmit: (values) => {
      dispatch(loginTC(values));
      formik.resetForm(); //зануляем форму
    },
  });

  if (isLoggedIn) {
    return <Navigate to={"/"} />; //если isLoggedIn true - направляем на главную
  }

  return (
    <Grid container justifyContent={"center"}>
      {statusLoading === "loading" && <LinearProgress color="secondary" />}
      <Grid item justifyContent={"center"}>
        {/* оборачиваем форму в тэг form и добавляем встроенную ф-ю handleSubmit */}
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  {" "}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
              />
              {/* если ошибка присутствует и с поля убрали фокус, выводим ее */}
              {formik.errors.email && formik.touched.email ? (
                <div style={{ color: "red" }}> {formik.errors.email} </div>
              ) : null}

              <TextField
                type="password"
                label="Password"
                margin="normal"
                // ф-я getFieldProps заменяеи 4 поля, нужно передать содержимое поля name
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password && formik.touched.password ? (
                <div style={{ color: "red" }}> {formik.errors.password} </div>
              ) : null}

              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox />}
                // checked оставляем, так как resetForm не сбрасываем зн checked
                checked={formik.values.rememberMe}
                {...formik.getFieldProps("rememberMe")}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
