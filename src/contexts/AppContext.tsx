import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AppState, Board } from "../types";
import { loadFromStorage, saveToStorage } from "../utils/localStorage";

// Action types
type AppAction =
  | { type: "ADD_BOARD"; payload: Board }
  | { type: "DELETE_BOARD"; payload: string }
  | { type: "UPDATE_BOARD"; payload: Board };

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
