import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Board } from "../../types";
import "./BoardCard.css";

interface BoardCardProps {
  board: Board;
  onDelete: (boardId: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onDelete }) => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleClick = () => {
    navigate(`/board/${board.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(true); // show modal
  };

  const handleConfirmDelete = () => {
    onDelete(board.id);
    setConfirmDelete(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getTotalTasks = () => {
    return board.columns.reduce(
      (total, column) => total + column.tasks.length,
      0
    );
  };

  return (
    <>
      <tr className="board-card" onClick={handleClick}>
        <td className="board-title">{board.title}</td>
        <td className="board-description">{board.description}</td>
        <td className="board-columns">{board.columns.length}</td>
        <td className="board-tasks">{getTotalTasks()}</td>
        <td className="board-created">{formatDate(board.createdAt)}</td>
        <td className="board-actions">
          <button className="btn btn-danger btn-sm" onClick={handleDeleteClick}>
            Delete
          </button>
        </td>
      </tr>

      {confirmDelete && (
        <div className="column__delete-modal">
          <div className="column__delete-modal-content">
            <h4>Delete Board</h4>
            <p>Are you sure you want to delete "{board.title}"?</p>
            <div className="column__delete-modal-actions">
              <button
                className="btn btn--secondary"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button className="btn btn--danger" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoardCard;
