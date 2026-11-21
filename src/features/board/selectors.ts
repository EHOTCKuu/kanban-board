import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Column, Task } from './types';

const selectBoard = (state: RootState) => state.board;

export const selectColumnOrder = (state: RootState) => state.board.columnOrder;

export const selectColumnById = (state: RootState, columnId: string): Column | undefined =>
  state.board.columns[columnId];

export const selectDraggingTaskId = (state: RootState) => state.board.draggingTaskId;

export const selectTasksForColumn = createSelector(
  [
    selectBoard,
    (_state: RootState, columnId: string) => columnId,
  ],
  (board, columnId): Task[] => {
    const column = board.columns[columnId];
    if (!column) return [];
    return column.taskIds.map((id) => board.tasks[id]).filter(Boolean);
  }
);