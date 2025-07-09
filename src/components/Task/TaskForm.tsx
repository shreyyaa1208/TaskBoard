import React, { useState } from "react";
import { Task } from "../../types";
import "./styles.css";

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  columnId: string;
  currentUser: string;
  initialData?: Task; // for edit mode
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  columnId,
  currentUser,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [priority, setPriority] = useState(initialData?.priority || "medium");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (trimmedTitle.length > 50) {
      setError("Title must be 50 characters or less.");
      return;
    }

    const newTask: Task = {
      id: initialData?.id || Date.now().toString(),
      title: trimmedTitle,
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      assignee: initialData?.assignee || currentUser,
      columnId,
      createdBy: initialData?.createdBy || currentUser,
      order: initialData?.order ?? 0,
    };

    onSubmit(newTask);
  };

  return (
    <div className="task-form__overlay">
      <form className="task-form" onSubmit={handleSubmit}>
        <h2>{initialData ? "Edit Task" : "Add Task"}</h2>

        <label>Title*</label>
        <input
          type="text"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {error && <p className="form-error">{error}</p>}

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>Priority</label>
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "high" | "medium" | "low")
          }
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <label>Due Date</label>
        <input
          type="date"
          value={
            dueDate
              ? typeof dueDate === "string"
                ? dueDate
                : dueDate.toISOString().slice(0, 10)
              : ""
          }
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="task-form__actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={!title.trim() || title.length > 50}
          >
            {initialData ? "Update Task" : "Create Task"}
          </button>

          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
