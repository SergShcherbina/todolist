export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
type initialStateType = typeof initialState;

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as null | string,
  initialize: false,
};

type AppActionsType = AppSetLoadingStatusAT | AppSetErrorAT | AppInitializeAT;

export const appReducer = (state: initialStateType = initialState, action: AppActionsType): initialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS": {
      return { ...state, status: action.status };
    }
    case "APP/SET-ERROR": {
      return { ...state, error: action.error };
    }
    case "APP/SET-INITIALIZE": {
      return { ...state, initialize: action.initialize };
    }
    default:
      return state;
  }
};

export type AppSetLoadingStatusAT = ReturnType<typeof appSetLoadingStatusAC>;
export type AppSetErrorAT = ReturnType<typeof appSetErrorAC>;
export type AppInitializeAT = ReturnType<typeof appInitializeAC>;

export const appSetLoadingStatusAC = (status: RequestStatusType) => ({ type: "APP/SET-STATUS", status } as const);
export const appSetErrorAC = (error: null | string) => ({ type: "APP/SET-ERROR", error } as const);
export const appInitializeAC = (initialize: boolean) => ({ type: "APP/SET-INITIALIZE", initialize } as const);
