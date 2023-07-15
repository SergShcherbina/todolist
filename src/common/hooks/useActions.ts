/**
 * Custom hook for binding and memoizing action creators with Redux dispatch function.
 * @template T - The type of the action creators map object.
 * @param {T} actions - The action creators map object.
 * @returns {RemapActionCreators<T>} - The remapped action creators object.
 */

import { useMemo } from "react";
import { ActionCreatorsMapObject, bindActionCreators } from "redux";
import { useAppDispatch } from "common/hooks/useAppDispatch";

export const useActions = <T extends ActionCreatorsMapObject>(actions: T) => {
  const dispatch = useAppDispatch();

  return useMemo(() => bindActionCreators<T, RemapActionCreators<T>>(actions, dispatch), [actions, dispatch]);
};

// Types
type IsValidArg<T> = T extends object ? (keyof T extends never ? false : true) : true;
type ActionCreatorResponse<T extends (...args: any[]) => any> = ReturnType<ReturnType<T>>;
type ReplaceReturnType<T, TNewReturn> = T extends (a: infer A) => infer R
  ? IsValidArg<A> extends true
    ? (a: A) => TNewReturn
    : () => TNewReturn
  : never;
type RemapActionCreators<T extends ActionCreatorsMapObject> = {
  [K in keyof T]: ReplaceReturnType<T[K], ActionCreatorResponse<T[K]>>;
};
