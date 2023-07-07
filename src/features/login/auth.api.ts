import { instance } from "common/api/common.api";
import { AxiosResponse } from "axios";
import { ResponseType } from "common/types/common.types";

export const authAPI = {
  login(data: LoginParamsType) {
    //логинимся
    return instance.post<ResponseType<number>, AxiosResponse<ResponseType<number>>, LoginParamsType>(
      "auth/login",
      data
    );
  },
  me() {
    //проверяем или залогинены
    return instance.get<ResponseType<ResponseMeType>>("auth/me");
  },
  logOut: function () {
    //вылогиниваемся
    return instance.delete<ResponseType>("/auth/login");
  },
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: boolean;
};
export type ResponseMeType = {
  id: number;
  email: string;
  login: string;
};
