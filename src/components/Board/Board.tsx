import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectColumnOrder } from '../../features/board/selectors';
import { setDraggingTaskId } from '../../features/board/boardSlice';
import { Column } from '../Column/Column';
import { TaskModal } from '../TaskModal/TaskModal';
import { AddColumn } from '../AddColumn/AddColumn';
import styles from './Board.module.scss';

export function Board() {
  const dispatch = useAppDispatch();
  const columnOrder = useAppSelector(selectColumnOrder);
  const [modalState, setModalState] = useState<{
    columnId: string;
    taskId?: string;
  } | null>(null);

  const handleDragStart = (id: string) => dispatch(setDraggingTaskId(id));
  const handleDragEnd = () => dispatch(setDraggingTaskId(null));

  return (
    <>
      <main className={styles.board}>
        {columnOrder.map((colId) => (
          <Column
            key={colId}
            columnId={colId}
            onDragStartTask={handleDragStart}
            onDragEndTask={handleDragEnd}
            onAddTaskClick={(id) => setModalState({ columnId: id })}
            onTaskClick={(columnId, taskId) =>
              setModalState({ columnId, taskId })
            }
          />
        ))}
        <AddColumn />
      </main>

      {modalState && (
        <TaskModal
          columnId={modalState.columnId}
          taskId={modalState.taskId}
          onClose={() => setModalState(null)}
        />
      )}
    </>
  );
}
