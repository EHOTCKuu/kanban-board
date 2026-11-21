import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { BoardState, Column, Task, CatCoat } from './types';
import { randomCoat } from './coats';
import { STORAGE_KEY } from './constants';

const initialState: BoardState = {
  columns: {
    'col-todo': { id: 'col-todo', title: 'Мур-очередь', taskIds: ['t1', 't2'] },
    'col-in-progress': {
      id: 'col-in-progress',
      title: 'В работе',
      taskIds: ['t3'],
    },
    'col-done': { id: 'col-done', title: 'Мурлычет', taskIds: ['t4'] },
  },
  tasks: {
    t1: { id: 't1', title: 'Сверстать карточку', coat: 'ginger' },
    t2: { id: 't2', title: 'Настроить Redux', coat: 'tuxedo' },
    t3: { id: 't3', title: 'Сделать Drag&Drop', coat: 'calico' },
    t4: { id: 't4', title: 'Купить корм', coat: 'cow' },
  },
  columnOrder: ['col-todo', 'col-in-progress', 'col-done'],
  draggingTaskId: null,
};

const loadState = (): BoardState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return JSON.parse(raw) as BoardState;
  } catch {
    return initialState;
  }
};

const boardSlice = createSlice({
  name: 'board',
  initialState: loadState(),
  reducers: {
    addTask: {
      reducer(state, action: PayloadAction<{ columnId: string; task: Task }>) {
        const { columnId, task } = action.payload;
        state.tasks[task.id] = task;
        state.columns[columnId]?.taskIds.push(task.id);
      },
      prepare(columnId: string, title: string, coat?: CatCoat) {
        return {
          payload: {
            columnId,
            task: { id: nanoid(), title, coat: coat ?? randomCoat() },
          },
        };
      },
    },

    updateTask(
      state,
      action: PayloadAction<{ id: string; title: string; coat: CatCoat }>,
    ) {
      const task = state.tasks[action.payload.id];
      if (!task) return;
      task.title = action.payload.title;
      task.coat = action.payload.coat;
    },

    deleteTask(state, action: PayloadAction<string>) {
      const taskId = action.payload;
      if (!state.tasks[taskId]) return;
      for (const column of Object.values(state.columns)) {
        column.taskIds = column.taskIds.filter((id) => id !== taskId);
      }
      delete state.tasks[taskId];
    },

    moveTask(
      state,
      action: PayloadAction<{
        taskId: string;
        toColumnId: string;
        toIndex: number;
      }>,
    ) {
      const { taskId, toColumnId, toIndex } = action.payload;
      const targetColumn = state.columns[toColumnId];
      if (!targetColumn) return;

      let sourceColumnId = '';
      let currentIndex = -1;

      for (const [colId, col] of Object.entries(state.columns)) {
        const idx = col.taskIds.indexOf(taskId);
        if (idx !== -1) {
          sourceColumnId = colId;
          currentIndex = idx;
          break;
        }
      }

      if (currentIndex === -1) return;
      if (sourceColumnId === toColumnId && currentIndex === toIndex) return;

      state.columns[sourceColumnId].taskIds.splice(currentIndex, 1);

      // При перемещении внутри одной колонки индекс сдвигается из-за удаления элемента
      let finalIndex = toIndex;
      if (sourceColumnId === toColumnId && toIndex > currentIndex) {
        finalIndex = toIndex - 1;
      }

      targetColumn.taskIds.splice(finalIndex, 0, taskId);
    },

    setDraggingTaskId(state, action: PayloadAction<string | null>) {
      state.draggingTaskId = action.payload;
    },

    renameColumn(state, action: PayloadAction<{ id: string; title: string }>) {
      const column = state.columns[action.payload.id];
      if (column) column.title = action.payload.title;
    },

    addColumn: {
      reducer(state, action: PayloadAction<Column>) {
        state.columns[action.payload.id] = action.payload;
        state.columnOrder.push(action.payload.id);
      },
      prepare(title: string) {
        return { payload: { id: nanoid(), title, taskIds: [] } };
      },
    },

    deleteColumn(state, action: PayloadAction<string>) {
      const columnId = action.payload;
      const column = state.columns[columnId];
      if (!column) return;

      for (const taskId of column.taskIds) {
        delete state.tasks[taskId];
      }

      delete state.columns[columnId];
      state.columnOrder = state.columnOrder.filter((id) => id !== columnId);
    },

    replaceBoard(state, action: PayloadAction<BoardState>) {
      return action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setDraggingTaskId,
  renameColumn,
  addColumn,
  deleteColumn,
  replaceBoard,
} = boardSlice.actions;

export default boardSlice.reducer;
