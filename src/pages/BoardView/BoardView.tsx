import React, { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import BoardForm from "../../components/Board/BoardForm";
import BoardCard from "../../components/Board/BoardCard";
import "./BoardView.css";

const BoardView: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);

  const handleDeleteBoard = (boardId: string) => {
    dispatch({ type: "DELETE_BOARD", payload: boardId });
  };

  return (
    <div className="board-view">
      <div className="container">
        <div className="board-view-header">
          <h1>Task Boards</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Create New Board
          </button>
        </div>

        {state.boards.length === 0 ? (
          <div className="empty-state">
            <h3>No boards yet</h3>
            <p>Create your first board to get started with task management.</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Create Your First Board
            </button>
          </div>
        ) : (
          <div className="boards-table-container">
            <table className="boards-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Columns</th>
                  <th>Tasks</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.boards.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    onDelete={handleDeleteBoard}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && <BoardForm onClose={() => setShowForm(false)} />}
      </div>
    </div>
  );
};

export default BoardView;
