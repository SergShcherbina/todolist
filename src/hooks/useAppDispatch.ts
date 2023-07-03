import { useDispatch } from "react-redux";
import { AppDispatchType } from "../app/store";

//для удобства dispatch и useSelector сразу с типизацией
export const useAppDispatch = () => useDispatch<AppDispatchType>();
