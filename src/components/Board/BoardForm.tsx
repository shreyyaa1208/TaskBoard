import React, { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { Board } from "../../types";
import "./BoardForm.css";

interface BoardFormProps {
  onClose: () => void;
}

const BoardForm: React.FC<BoardFormProps> = ({ onClose }) => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newBoard: Board = {
      id: Date.now().toString(), // Simple ID generation
      title: formData.title.trim(),
      name: formData.title.trim(),
      description: formData.description.trim(),
      createdAt: new Date(),
      columns: [],
    };

    dispatch({ type: "ADD_BOARD", payload: newBoard });
    onClose();
  };

  return (
    <div className="board-form-overlay">
      <div className="board-form-container">
        <div className="board-form-header">
          <h2>Create New Board</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="board-form">
          <div className="form-group">
            <label htmlFor="title">Board Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter board title"
              className={errors.title ? "error" : ""}
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter board description"
              rows={4}
              className={errors.description ? "error" : ""}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardForm;
