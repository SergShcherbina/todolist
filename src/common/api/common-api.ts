import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "2c9579b3-006a-4fe2-ae79-36894f3fae6b",
  },
});
