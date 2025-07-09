import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AppState, Board, Column, Task } from "../types";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";

// Action types
type AppAction =
  | { type: "ADD_BOARD"; payload: Board }
  | { type: "DELETE_BOARD"; payload: string }
  | { type: "UPDATE_BOARD"; payload: Board }
  | { type: "ADD_COLUMN"; payload: Column }
  | { type: "DELETE_COLUMN"; payload: string }
  | { type: "UPDATE_COLUMN"; payload: Column }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "UPDATE_TASK"; payload: Task }
  | {
      type: "MOVE_TASK";
      payload: { taskId: string; newColumnId: string; newOrder: number };
    }
  | { type: "SET_CURRENT_USER"; payload: string };

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "ADD_BOARD":
      return {
        ...state,
        boards: [...state.boards, action.payload],
      };

    case "DELETE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
      };

    case "UPDATE_BOARD":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.id ? action.payload : board
        ),
      };

    case "ADD_COLUMN":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? { ...board, columns: [...board.columns, action.payload] }
            : board
        ),
      };

    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUser: action.payload,
      };

    case "DELETE_COLUMN":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.columns.some((col) => col.id === action.payload)
            ? {
                ...board,
                columns: board.columns.filter(
                  (col) => col.id !== action.payload
                ),
              }
            : board
        ),
      };

    case "UPDATE_COLUMN":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.columns.some((col) => col.id === action.payload.id)
            ? {
                ...board,
                columns: board.columns.map((col) =>
                  col.id === action.payload.id ? action.payload : col
                ),
              }
            : board
        ),
      };

    case "ADD_TASK":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.columns.some((col) => col.id === action.payload.columnId)
            ? {
                ...board,
                columns: board.columns.map((col) =>
                  col.id === action.payload.columnId
                    ? { ...col, tasks: [...(col.tasks || []), action.payload] }
                    : col
                ),
              }
            : board
        ),
      };

    case "UPDATE_TASK":
      return {
        ...state,
        boards: state.boards.map((board) => ({
          ...board,
          columns: board.columns.map((col) => ({
            ...col,
            tasks: col.tasks?.map((task) =>
              task.id === action.payload.id ? action.payload : task
            ),
          })),
        })),
      };

    case "DELETE_TASK":
      return {
        ...state,
        boards: state.boards.map((board) => ({
          ...board,
          columns: board.columns.map((col) => ({
            ...col,
            tasks: col.tasks?.filter((task) => task.id !== action.payload),
          })),
        })),
      };

    case "MOVE_TASK": {
      const { taskId, newColumnId, newOrder } = action.payload;

      let movedTask: Task | null = null;

      
      const boardsAfterRemoval = state.boards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.tasks.some((t) => t.id === taskId)) {
            const filtered = col.tasks.filter((t) => {
              if (t.id === taskId) {
                movedTask = { ...t, columnId: newColumnId };
                return false;
              }
              return true;
            });
            return { ...col, tasks: filtered };
          }
          return col;
        }),
      }));

      // Step 2: Insert task into new column at correct position
      const finalBoards = boardsAfterRemoval.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === newColumnId && movedTask) {
            const newTasks = [...col.tasks];
            newTasks.splice(newOrder, 0, movedTask); // insert at position
            return { ...col, tasks: newTasks };
          }
          return col;
        }),
      }));

      return { ...state, boards: finalBoards };
    }

    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, loadFromStorage());

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
