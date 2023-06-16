
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type initialStateType = typeof initialState;

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
}

type AppActionsType =  AppSetLoadingStatusAT | AppSetErrorAT

export const appReducer = (state: initialStateType = initialState, action: AppActionsType): initialStateType => {
    switch (action.type){
        case 'APP/SET-STATUS': {
            return {...state, status: action.status}
        }
        case 'APP/SET-ERROR': {
            return {...state, error: action.error}
        }
        default:
            return state
    }
}

type AppSetLoadingStatusAT = ReturnType<typeof appSetLoadingStatusAC>
type AppSetErrorAT = ReturnType<typeof appSetErrorAC>

export const appSetLoadingStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const appSetErrorAC = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)



