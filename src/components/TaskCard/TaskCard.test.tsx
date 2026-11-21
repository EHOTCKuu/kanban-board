import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import boardReducer from '../../features/board/boardSlice';
import { TaskCard } from './TaskCard';
import type { Task } from '../../features/board/types';

const createTestStore = () =>
  configureStore({
    reducer: { board: boardReducer },
  });

const mockTask: Task = {
  id: 't1',
  title: 'Покормить кота',
  coat: 'ginger',
};

describe('TaskCard component', () => {
  it('должен рендерить название задачи', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <TaskCard
          task={mockTask}
          index={0}
          columnId="col-1"
          draggingTaskId={null}
          onDragStart={vi.fn()}
          onDragEnd={vi.fn()}
          onClick={vi.fn()}
          onDropTask={vi.fn()}
        />
      </Provider>,
    );

    // Ищем текст "Покормить кота" на экране
    expect(screen.getByText('Покормить кота')).toBeInTheDocument();
  });

  it('должен вызывать onClick при клике на карточку', async () => {
    const store = createTestStore();
    const handleClick = vi.fn(); // Создаем мок-функцию

    render(
      <Provider store={store}>
        <TaskCard
          task={mockTask}
          index={0}
          columnId="col-1"
          draggingTaskId={null}
          onDragStart={vi.fn()}
          onDragEnd={vi.fn()}
          onClick={handleClick} // Передаем мок
          onDropTask={vi.fn()}
        />
      </Provider>,
    );

    // Симулируем клик пользователя по карточке
    await userEvent.click(screen.getByText('Покормить кота'));

    // Проверяем, что функция была вызвана 1 раз с нужным ID
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith('t1');
  });
});
