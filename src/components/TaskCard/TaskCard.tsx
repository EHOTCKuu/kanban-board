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
  task, onDragStart, onDragEnd, onClick, index, columnId, onDropTask, draggingTaskId
}: TaskCardProps) {
  const dispatch = useAppDispatch();
  const coat = COATS[task.coat];

  const { handleDragStart, handleDragEnd } = useDraggable(task.id, onDragStart, onDragEnd);
  
  const { droppableProps } = useDroppable({
    isDraggingGlobal: draggingTaskId,
    onDropTask: (taskId) => onDropTask(taskId, columnId, index)
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (window.confirm('Удалить задачу?')) {
      dispatch(deleteTask(task.id));
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
    >
      <div 
        className={styles.coatMarker} 
        style={{ backgroundColor: coat.bg, borderColor: coat.spot }}
      />
      <span className={styles.taskTitle}>{task.title}</span>
      <button className={styles.deleteBtn} onClick={handleDelete} title="Удалить">
        <CrossIcon />
      </button>
    </div>
  );
}

export const TaskCard = memo(TaskCardBase);