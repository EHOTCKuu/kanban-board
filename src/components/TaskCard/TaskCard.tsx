import { memo } from 'react';
import type { Task } from '../../features/board/types';
import { COATS } from '../../features/board/coats';
import { CrossIcon } from '../icons/CrossIcon';
import { useAppDispatch } from '../../app/hooks';
import { deleteTask } from '../../features/board/boardSlice';
import { useDraggable, useDroppable } from '../../hooks/useDragAndDrop';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onClick: (id: string) => void;
  index: number;
  columnId: string;
  onDropTask: (taskId: string, columnId: string, index: number) => void;
  draggingTaskId: string | null;
}

function TaskCardBase({
  task,
  onDragStart,
  onDragEnd,
  onClick,
  index,
  columnId,
  onDropTask,
  draggingTaskId,
}: TaskCardProps) {
  const dispatch = useAppDispatch();
  const coat = COATS[task.coat];

  const { handleDragStart, handleDragEnd } = useDraggable(
    task.id,
    onDragStart,
    onDragEnd,
  );

  const { droppableProps } = useDroppable({
    isDraggingGlobal: draggingTaskId,
    onDropTask: (taskId) => onDropTask(taskId, columnId, index),
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Удалить задачу?')) {
      dispatch(deleteTask(task.id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Чтобы страница не скроллилась при нажатии Space
      onClick(task.id);
    }
  };

  return (
    <div
      className={styles.taskCard}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      {...droppableProps}
      onClick={() => onClick(task.id)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`Задача: ${task.title}. Нажмите Enter, чтобы редактировать.`}
    >
      <div
        className={styles.coatMarker}
        style={{ backgroundColor: coat.bg, borderColor: coat.spot }}
      />
      <span className={styles.taskTitle}>{task.title}</span>
      <button
        className={styles.deleteBtn}
        onClick={handleDelete}
        title="Удалить"
        aria-label={`Удалить задачу ${task.title}`}
      >
        <CrossIcon />
      </button>
    </div>
  );
}

export const TaskCard = memo(TaskCardBase);
