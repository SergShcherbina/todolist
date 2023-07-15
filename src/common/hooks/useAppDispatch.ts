import { useDispatch } from "react-redux";
import { AppDispatchType } from "app/model/store";

export const useAppDispatch = () => useDispatch<AppDispatchType>();
