import { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addColumn } from '../../features/board/boardSlice';
import styles from './AddColumn.module.scss';

export function AddColumn() {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(addColumn(title.trim()));
      setTitle('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <button className={styles.addColumnBtn} onClick={() => setIsAdding(true)}>
        + Добавить колонку
      </button>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название колонки..."
          autoFocus
          onBlur={() => {
            if (!title.trim()) setIsAdding(false); // Закрываем, если пусто
          }}
        />
        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn}>
            Добавить
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => setIsAdding(false)}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
