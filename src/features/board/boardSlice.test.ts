import { describe, it, expect } from 'vitest';
import boardReducer, { moveTask, deleteColumn } from './boardSlice';
import type { BoardState } from './types';

const mockState: BoardState = {
  columns: {
    'col-1': { id: 'col-1', title: 'Todo', taskIds: ['t1', 't2'] },
    'col-2': { id: 'col-2', title: 'Done', taskIds: ['t3'] },
  },
  tasks: {
    t1: { id: 't1', title: 'Task 1', coat: 'ginger' },
    t2: { id: 't2', title: 'Task 2', coat: 'cow' },
    t3: { id: 't3', title: 'Task 3', coat: 'black' },
  },
  columnOrder: ['col-1', 'col-2'],
  draggingTaskId: null,
};

describe('boardSlice: moveTask', () => {
  it('должен перемещать задачу из одной колонки в другую', () => {
    const action = moveTask({ taskId: 't1', toColumnId: 'col-2', toIndex: 0 });
    const newState = boardReducer(mockState, action);

    expect(newState.columns['col-1'].taskIds).toEqual(['t2']); // Из первой удалили
    expect(newState.columns['col-2'].taskIds).toEqual(['t1', 't3']); // Во вторую добавили в начало
  });

  it('должен менять порядок задач внутри одной колонки', () => {
    // Тащим t2 на место t1 (индекс 0)
    const action = moveTask({ taskId: 't2', toColumnId: 'col-1', toIndex: 0 });
    const newState = boardReducer(mockState, action);

    expect(newState.columns['col-1'].taskIds).toEqual(['t2', 't1']);
  });
});

describe('boardSlice: deleteColumn', () => {
  it('должен удалять колонку и все задачи внутри неё', () => {
    const action = deleteColumn('col-1');
    const newState = boardReducer(mockState, action);

    expect(newState.columns['col-1']).toBeUndefined(); // Колонки нет
    expect(newState.tasks['t1']).toBeUndefined(); // Задачи из неё удалены
    expect(newState.tasks['t2']).toBeUndefined();
    expect(newState.tasks['t3']).toBeDefined(); // Задача из другой колонки осталась
    expect(newState.columnOrder).toEqual(['col-2']); // Порядок обновлен
  });
});