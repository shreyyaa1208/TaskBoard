import React from "react";
import { Task } from "../../types";
import "./Task.css";
import { format } from "date-fns";

interface TaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskProps> = ({ task, onEdit, onDelete }) => {
  const priorityClass = `task__priority task__priority--${task.priority}`;

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => {
        const payload = {
          taskId: task.id,
          fromColumnId: task.columnId,
        };
        e.dataTransfer.setData("text/plain", JSON.stringify(payload));
      }}
    >
      <div className="task-card__top">
        <h4 className="task-card__title">{task.title}</h4>
        <div className="task-card__actions">
          <button
            onClick={() => onEdit(task)}
            className="task-card__edit"
            title="Edit Task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="task-card__delete"
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__meta">
        <span className={priorityClass}>{task.priority}</span>
        {task.dueDate && (
          <span className="task-card__due">
            Due: {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
        <span className="task-card__assignee">👤 {task.assignee}</span>
      </div>
    </div>
  );
};

export default TaskCard;
