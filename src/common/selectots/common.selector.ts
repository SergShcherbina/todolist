//для оптимизации хука useSelector (корректной мемоизации) создаем ф-и селекторы
import { AppRootStateType } from "app/store";

export const selectors = {
  todosSelector: (state: AppRootStateType) => state.todos,
  tasksSelector: (state: AppRootStateType) => state.tasks,
  errorSelector: (state: AppRootStateType) => state.app.error,
  statusSelector: (state: AppRootStateType) => state.app.status,
  isLoggedInSelector: (state: AppRootStateType) => state.auth.isLoggedIn,
  isInitializedSelector: (state: AppRootStateType) => state.app.initialize,
};
