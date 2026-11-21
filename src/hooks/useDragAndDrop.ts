import { useState } from 'react';

// --- Хук для перетаскиваемой карточки (Drag Source) ---
export function useDraggable(
  taskId: string,
  onDragStart: (id: string) => void,
  onDragEnd: () => void,
) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', taskId);
    // Задержка, чтобы браузер успел сделать "снимок" карточки
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.4';
    }, 0);
    onDragStart(taskId);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
    onDragEnd();
  };

  return { handleDragStart, handleDragEnd };
}

// --- Хук для зоны сброса (Drop Zone) ---
interface UseDroppableProps {
  onDropTask: (taskId: string, index?: number) => void;
  isDraggingGlobal: string | null;
}

export function useDroppable({
  onDropTask,
  isDraggingGlobal,
}: UseDroppableProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Вычисляем актуальное состояние "наведения" на лету.
  // Если глобально ничего не тащат, то и наведение всегда false.
  const isDragOver = isHovered && isDraggingGlobal !== null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const currentElement = e.currentTarget as HTMLElement;
    const relatedElement = e.relatedTarget as HTMLElement | null;
    if (!relatedElement || !currentElement.contains(relatedElement)) {
      setIsHovered(false);
    }
  };

  const handleDrop = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovered(false);

    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTask(taskId, index);
    }
  };

  return {
    isDragOver,
    droppableProps: {
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: (e: React.DragEvent) => handleDrop(e),
    },
  };
}
