import { configureStore } from '@reduxjs/toolkit';
import boardReducer from '../features/board/boardSlice';
import { STORAGE_KEY } from '../features/board/constants';

export const store = configureStore({
  reducer: { board: boardReducer },
});

// Подписываемся и сохраняем при любом изменении доски.
// Храним весь board-срез — данных мало, писать на каждое действие ок.
store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().board));
  } catch {
    /* localStorage может быть недоступен (private mode) — молча игнорируем */
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
