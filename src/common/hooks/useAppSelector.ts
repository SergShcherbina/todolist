import { TypedUseSelectorHook, useSelector } from "react-redux";
import { AppRootStateType } from "app/model/store";

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
