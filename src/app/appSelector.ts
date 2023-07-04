import { AppRootStateType } from "app/store";

//для оптимизации хука useSelector (корректной мемоизации) создаем ф-и селекторы
export const appSelector = {
  todosSelector: (state: AppRootStateType) => state.todos,
  tasksSelector: (state: AppRootStateType) => state.tasks,
  errorSelector: (state: AppRootStateType) => state.app.error,
  statusSelector: (state: AppRootStateType) => state.app.status,
  isLoggedInSelector: (state: AppRootStateType) => state.auth.isLoggedIn,
  isInitializedSelector: (state: AppRootStateType) => state.app.initialize,
};
