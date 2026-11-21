export type CatCoat =
  | 'ginger'
  | 'tabby'
  | 'tuxedo'
  | 'calico'
  | 'siamese'
  | 'british'
  | 'tortoise'
  | 'white'
  | 'black'
  | 'cow';

export interface Task {
  id: string;
  title: string;
  description?: string;
  coat: CatCoat;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardState {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  columnOrder: string[];
  draggingTaskId: string | null;
}
