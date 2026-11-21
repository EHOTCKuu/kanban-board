import type { BoardState } from '../features/board/types';

// Функция для скачивания JSON-файла
export function downloadJson(data: BoardState, filename = 'kanban-board.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Очищаем память
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Функция для чтения JSON-файла
export function readJsonFile(file: File): Promise<BoardState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') throw new Error('Не удалось прочитать файл');
        const parsed = JSON.parse(result) as BoardState;
        resolve(parsed);
      } catch {
        reject(new Error('Неверный формат файла'));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
    reader.readAsText(file);
  });
}