import { useState, memo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectTasksForColumn } from '../../features/board/selectors';
import {
  moveTask,
  renameColumn,
  deleteColumn,
} from '../../features/board/boardSlice';
import { useDroppable } from '../../hooks/useDragAndDrop';
import { TaskCard } from '../TaskCard/TaskCard';
import { PlusIcon } from '../icons/PlusIcon';
import { CrossIcon } from '../icons/CrossIcon';
import styles from './Column.module.scss';

interface ColumnProps {
  columnId: string;
  onDragStartTask: (id: string) => void;
  onDragEndTask: () => void;
  onAddTaskClick: (columnId: string) => void;
  onTaskClick: (columnId: string, taskId: string) => void;
}

function ColumnBase({
  columnId,
  onDragStartTask,
  onDragEndTask,
  onAddTaskClick,
  onTaskClick,
}: ColumnProps) {
  const dispatch = useAppDispatch();
  const column = useAppSelector((s) => s.board.columns[columnId]);
  const tasks = useAppSelector((s) => selectTasksForColumn(s, columnId));
  const draggingTaskId = useAppSelector((s) => s.board.draggingTaskId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(column?.title || '');

  // Используем хук для колонки
  const { isDragOver, droppableProps } = useDroppable({
    isDraggingGlobal: draggingTaskId,
    onDropTask: (taskId) => {
      // Если бросили в пустое место, кидаем в конец
      dispatch(
        moveTask({ taskId, toColumnId: columnId, toIndex: tasks.length }),
      );
      onDragEndTask();
    },
  });

  if (!column) return null;

  const handleDropTask = (
    taskId: string,
    targetColumnId: string,
    toIndex: number,
  ) => {
    dispatch(moveTask({ taskId, toColumnId: targetColumnId, toIndex }));
    onDragEndTask();
  };

  const startEditing = () => {
    setTitleValue(column.title);
    setIsEditingTitle(true);
  };

  const saveTitle = () => {
    if (titleValue.trim() && titleValue.trim() !== column.title) {
      dispatch(renameColumn({ id: columnId, title: titleValue.trim() }));
    } else {
      setTitleValue(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveTitle();
    if (e.key === 'Escape') {
      setTitleValue(column.title);
      setIsEditingTitle(false);
    }
  };

  const handleDeleteColumn = () => {
    if (window.confirm('Удалить колонку и все её задачи?')) {
      dispatch(deleteColumn(columnId));
    }
  };

  return (
    <section
      className={`${styles.column} ${isDragOver ? styles.columnDragOver : ''}`}
      {...droppableProps}
    >
      <header className={styles.columnHeader}>
        <div className={styles.titleWrap}>
          {isEditingTitle ? (
            <input
              type="text"
              className={styles.titleInput}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              maxLength={30}
              onBlur={saveTitle}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <h2
              className={styles.columnTitle}
              onDoubleClick={startEditing}
              title="Двойной клик для переименования"
            >
              {column.title}
            </h2>
          )}
          <span className={styles.columnCount}>{tasks.length}</span>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.addBtn}
            onClick={() => onAddTaskClick(columnId)}
            title="Добавить задачу"
            aria-label={`Добавить задачу в колонку ${column.title}`}
          >
            <PlusIcon />
          </button>
          <button
            className={styles.deleteColBtn}
            onClick={handleDeleteColumn}
            title="Удалить колонку"
            aria-label={`Удалить колонку ${column.title}`}
          >
            <CrossIcon />
          </button>
        </div>
      </header>

      {tasks.length === 0 ? (
        <div className={styles.emptyState}>
          <span>Здесь пока пусто</span>
          <span className={styles.emptyHint}>
            Перетащите задачу сюда или нажмите «+»
          </span>
        </div>
      ) : (
        <div className={styles.taskList}>
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              columnId={columnId}
              onDropTask={handleDropTask}
              onDragStart={onDragStartTask}
              onDragEnd={onDragEndTask}
              onClick={(taskId) => onTaskClick(columnId, taskId)}
              draggingTaskId={draggingTaskId} // <-- Передаем стейт
            />
          ))}
        </div>
      )}
    </section>
  );
}

export const Column = memo(ColumnBase);
