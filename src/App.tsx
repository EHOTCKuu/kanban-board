import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { replaceBoard } from './features/board/boardSlice';
import { downloadJson, readJsonFile } from './utils/fileUtils';
import { Board } from './components/Board/Board';
import styles from './App.module.scss';

export default function App() {
  const dispatch = useAppDispatch();
  const boardState = useAppSelector((state) => state.board);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    downloadJson(boardState);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedState = await readJsonFile(file);
      
      if (!importedState.columns || !importedState.tasks) {
        throw new Error('Неверная структура файла');
      }

      dispatch(replaceBoard(importedState));
      alert('Доска успешно загружена!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при импорте');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Канбан-доска</h1>
        
        <div className={styles.actions}>
          <button className={styles.secondaryBtn} onClick={handleImportClick}>
            Импорт
          </button>
          <button className={styles.primaryBtn} onClick={handleExport}>
            Экспорт
          </button>
        </div>
      </header>
      
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Board />
    </div>
  );
}