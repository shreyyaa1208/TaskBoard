import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { Board, Column } from "../../types";
import ColumnComponent from "../../components/Column/Column";
import ColumnForm from "../../components/Column/ColumnForm";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";

import "./BoardDetail.css";

const BoardDetail: React.FC = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showColumnForm, setShowColumnForm] = useState(false);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    due: "",
  });

  useEffect(() => {
    if (boardId) {
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        setCurrentBoard(board);
      } else {
        // Board not found, redirect to board view
        navigate("/");
      }
    }
  }, [boardId, state.boards, navigate]);

  const handleAddColumn = (title: string) => {
    if (!currentBoard) return;

    const newColumn: Column = {
      id: Date.now().toString(),
      title,
      boardId: currentBoard.id,
      order: currentBoard.columns.length,
      tasks: [],
    };

    dispatch({ type: "ADD_COLUMN", payload: newColumn });
    setShowColumnForm(false);
  };

  const handleBackToBoards = () => {
    navigate("/");
  };

  if (!currentBoard) {
    return (
      <div className="board-detail">
        <div className="board-detail__loading">
          <p>Loading board...</p>
        </div>
      </div>
    );
  }

  // Sort columns by order
  const sortedColumns = [...currentBoard.columns].sort(
    (a, b) => a.order - b.order
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over || active.id === over.id) return;

    const taskId = active.id as string;
    const newColumnId = over.id as string;

    if (taskId && newColumnId) {
      dispatch({
        type: "MOVE_TASK",
        payload: {
          taskId,
          newColumnId,
          newOrder: 0,
        },
      });
    }
  };

  return (
    <div className="board-detail">
      {/* Header */}
      <header className="board-detail__header">
        <div className="board-detail__header-left">
          <button
            className="board-detail__back-btn"
            onClick={handleBackToBoards}
            aria-label="Back to boards"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="board-detail__title-section">
            <h1 className="board-detail__title">{currentBoard.name}</h1>
            {currentBoard.description && (
              <p className="board-detail__description">
                {currentBoard.description}
              </p>
            )}
          </div>
        </div>
        <div className="board-detail__header-right">
          <button
            className="board-detail__add-column-btn"
            onClick={() => setShowColumnForm(true)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Column
          </button>
        </div>
      </header>

      <div className="board-detail__filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="filter-input"
        />
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="filter-select"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filters.due}
          onChange={(e) => setFilters({ ...filters, due: e.target.value })}
          className="filter-select"
        >
          <option value="">All Due Dates</option>
          <option value="today">Due Today</option>
          <option value="week">Due This Week</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Main Content Area */}
      <main className="board-detail__main">
        <div className="board-detail__columns-container">
          {sortedColumns.length === 0 ? (
            <div className="board-detail__empty-state">
              <div className="board-detail__empty-content">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M9 9h6v6H9z" />
                </svg>
                <h3>No columns yet</h3>
                <p>Create your first column to start organizing tasks</p>
                <button
                  className="btn btn--primary"
                  onClick={() => setShowColumnForm(true)}
                >
                  Create Column
                </button>
              </div>
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="board-detail__columns">
                {sortedColumns.map((column) => (
                  <ColumnComponent
                    key={column.id}
                    column={column}
                    filters={filters}
                  />
                ))}
              </div>
            </DndContext>
          )}
        </div>
      </main>

      {/* Column Form Modal */}
      {showColumnForm && (
        <ColumnForm
          onSubmit={handleAddColumn}
          onCancel={() => setShowColumnForm(false)}
          isOpen={showColumnForm}
        />
      )}
    </div>
  );
};

export default BoardDetail;
