import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addTask, updateTask, deleteTask } from '../../features/board/boardSlice';
import { COAT_KEYS, COATS } from '../../features/board/coats';
import { taskSchema, type TaskFormValues } from '../../features/board/schemas';
import type { CatCoat } from '../../features/board/types';
import styles from './TaskModal.module.scss';
import { useEffect } from 'react';

interface TaskModalProps {
  columnId: string;
  taskId?: string;
  onClose: () => void;
}



export function TaskModal({ columnId, taskId, onClose }: TaskModalProps) {
  const dispatch = useAppDispatch();
  const existingTask = useAppSelector((s) => (taskId ? s.board.tasks[taskId] : null));
  
  const isEditing = Boolean(taskId);

  // Инициализируем форму
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: existingTask?.title || '',
      coat: existingTask?.coat || COAT_KEYS[0],
    },
  });

  // Обработчик отправки (вызывается только если валидация Zod прошла успешно)
  const onSubmit = (data: TaskFormValues) => {
    if (isEditing && taskId) {
      dispatch(updateTask({ id: taskId, title: data.title, coat: data.coat as CatCoat }));
    } else {
      dispatch(addTask(columnId, data.title, data.coat as CatCoat));
    }
    onClose();
  };

  const handleDelete = () => {
    if (taskId && window.confirm('Удалить эту задачу?')) {
      dispatch(deleteTask(taskId));
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 className={styles.title} id="modal-title">
          {isEditing ? 'Редактировать задачу' : 'Новая задача'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label className={styles.label}>
            Что нужно сделать?
            <input
              type="text"
              className={styles.input}
              placeholder="Например: Погладить кота..."
              autoFocus
              {...register('title')}
              aria-invalid={errors.title ? 'true' : 'false'}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />

            {errors.title && <span className={styles.errorText} id="title-error" role="alert">{errors.title.message}</span>}
          </label>

          <div className={styles.label}>
            Окрас котика:

            <Controller
              control={control}
              name="coat"
              render={({ field }) => (
                <div className={styles.coatGrid}>
                  {COAT_KEYS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`${styles.coatBtn} ${field.value === c ? styles.coatBtnActive : ''}`}
                      onClick={() => field.onChange(c)}
                      title={c}
                    >
                      <div 
                        className={styles.colorPreview} 
                        style={{ backgroundColor: COATS[c].bg, borderColor: COATS[c].spot }} 
                      />
                    </button>
                  ))}
                </div>
              )}
            />
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