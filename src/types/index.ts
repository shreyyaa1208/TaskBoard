export interface Board {
  id: string;
  title: string;
  name: string;
  description: string;
  createdAt: Date;
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
  createdBy: string;
  columnId: string;
  order: number;
  assignee: string;
}

export type Priority = 'high' | 'medium' | 'low';

export interface AppState {
  boards: Board[];
  currentUser: string;
}

export interface CreateBoardData {
  title: string;
  description: string;
}

export interface CreateColumnData {
  title: string;
  boardId: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
  createdBy: string;
  columnId: string;
}