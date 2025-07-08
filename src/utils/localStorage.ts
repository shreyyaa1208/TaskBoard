import { AppState } from '../types';

const STORAGE_KEY = 'task-board-app';

export const loadFromStorage = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      return {
        ...parsed,
        boards: parsed.boards.map((board: any) => ({
          ...board,
          createdAt: new Date(board.createdAt),
          columns: board.columns.map((column: any) => ({
            ...column,
            tasks: column.tasks.map((task: any) => ({
              ...task,
              dueDate: new Date(task.dueDate)
            }))
          }))
        }))
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return {
    boards: [],
    currentUser: 'Default User'
  };
};

export const saveToStorage = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};