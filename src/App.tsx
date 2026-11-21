import { Board } from './components/Board/Board';
import styles from './App.module.scss';

export default function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Канбан-доска</h1>
      </header>
      <Board />
    </div>
  );
}