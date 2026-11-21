import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addTask, updateTask, deleteTask } from '../../features/board/boardSlice';
import { COAT_KEYS, COATS } from '../../features/board/coats';
import type { CatCoat } from '../../features/board/types';
import styles from './TaskModal.module.scss';

interface TaskModalProps {
  columnId: string;
  taskId?: string; // Если передан, значит мы редактируем
  onClose: () => void;
}

export function TaskModal({ columnId, taskId, onClose }: TaskModalProps) {
  const dispatch = useAppDispatch();
  
  // Если taskId есть, берем данные из стора. Если нет — пустые поля.
  const existingTask = useAppSelector((s) => (taskId ? s.board.tasks[taskId] : null));
  
  const [title, setTitle] = useState(existingTask?.title || '');
  const [coat, setCoat] = useState<CatCoat>(existingTask?.coat || COAT_KEYS[0]);

  const isEditing = Boolean(taskId);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && taskId) {
      dispatch(updateTask({ id: taskId, title: title.trim(), coat }));
    } else {
      dispatch(addTask(columnId, title.trim(), coat));
    }
    onClose();
  };

  const handleDelete = () => {
    if (taskId && window.confirm('Удалить эту задачу?')) {
      dispatch(deleteTask(taskId));
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>
          {isEditing ? 'Редактировать задачу' : 'Новая задача'}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Что нужно сделать?
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Погладить кота..."
              maxLength={100}
              autoFocus
              required
            />
          </label>

          <div className={styles.label}>
            Окрас котика:
            <div className={styles.coatGrid}>
              {COAT_KEYS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.coatBtn} ${coat === c ? styles.coatBtnActive : ''}`}
                  onClick={() => setCoat(c)}
                  title={c}
                >
                  <div 
                    className={styles.colorPreview} 
                    style={{ backgroundColor: COATS[c].bg, borderColor: COATS[c].spot }} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            {isEditing && (
              <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
                Удалить
              </button>
            )}
            <div className={styles.rightActions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className={styles.saveBtn}>
                {isEditing ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}