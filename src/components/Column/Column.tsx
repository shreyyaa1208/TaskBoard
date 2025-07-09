import React, { useState, useRef, useEffect } from "react";
import { Column } from "../../types";
import "./Column.css";
import { isToday, isThisWeek, isPast } from "date-fns";
import TaskForm from "../Task/TaskForm";
import { Task } from "../../types";
import { useApp } from "../../contexts/AppContext";
import TaskCard from "../Task/Task";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
  column: Column;
  filters: {
    search: string;
    priority: string;
    due: string;
  };
}

const ColumnComponent: React.FC<ColumnProps> = ({ column, filters }) => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showActions, setShowActions] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  // Close actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showActions]);

  const filterTasks = (tasks: typeof column.tasks) => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPriority =
        filters.priority === "" || task.priority === filters.priority;

      const taskDate = task.dueDate ? new Date(task.dueDate) : null;

      const matchesDue =
        filters.due === "" ||
        (filters.due === "today" && taskDate && isToday(taskDate)) ||
        (filters.due === "week" && taskDate && isThisWeek(taskDate)) ||
        (filters.due === "overdue" && taskDate && isPast(taskDate));

      return matchesSearch && matchesPriority && matchesDue;
    });
  };

  const visibleTasks = filterTasks(column.tasks || []);

  // {
  //   visibleTasks.map((task) => (
  //     <div key={task.id} className="column__task-placeholder">
  //       <h4>{task.title}</h4>
  //       <p>Task component will go here</p>
  //     </div>
  //   ));
  // }

  const handleEditStart = () => {
    setIsEditing(true);
    setShowActions(false);
  };

  const handleEditSave = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && trimmedTitle !== column.title) {
      dispatch({
        type: "UPDATE_COLUMN",
        payload: { ...column, title: trimmedTitle },
      });
    } else {
      setEditTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirming(true);
    setShowActions(false);
  };

  const handleDeleteConfirm = () => {
    dispatch({
      type: "DELETE_COLUMN",
      payload: column.id,
    });
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirming(false);
  };

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const handleAddTaskClick = () => {
    setEditingTask(null); // Create new
    setShowTaskForm(true);
  };

  const handleTaskSubmit = (task: Task) => {
    if (editingTask) {
      dispatch({ type: "UPDATE_TASK", payload: task });
    } else {
      dispatch({ type: "ADD_TASK", payload: task });
    }
    setShowTaskForm(false);
  };

  const handleCancelTaskForm = () => {
    setShowTaskForm(false);
  };

  return (
    <div className="column" ref={setNodeRef}>
      {/* Column Header */}
      <div className="column__header">
        <div className="column__title-section">
          {isEditing ? (
            <input
              ref={editInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleKeyDown}
              className="column__title-input"
              maxLength={50}
            />
          ) : (
            <h3 className="column__title" title={column.title}>
              {column.title}
            </h3>
          )}
          <span className="column__task-count">
            {column.tasks.length} {column.tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {/* Actions Dropdown */}
        <div className="column__actions" ref={actionsRef}>
          <button
            className="column__actions-trigger"
            onClick={toggleActions}
            aria-label="Column actions"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {showActions && (
            <div className="column__actions-dropdown">
              <button className="column__action-item" onClick={handleEditStart}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Column
              </button>
              <button
                className="column__action-item column__action-item--danger"
                onClick={handleDeleteClick}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3,6 5,6 21,6" />
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
                </svg>
                Delete Column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Column Body - Tasks Container */}
      <div className="column__body">
        <div
          className="column__tasks"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text/plain");
            const { taskId, fromColumnId } = JSON.parse(data);

            // Avoid dropping into same column without reordering
            if (fromColumnId !== column.id) {
              dispatch({
                type: "MOVE_TASK",
                payload: {
                  taskId,
                  newColumnId: column.id,
                  newOrder: column.tasks.length, // move to bottom
                },
              });
            }
          }}
        >
          {showTaskForm && (
            <TaskForm
              onSubmit={handleTaskSubmit}
              onCancel={handleCancelTaskForm}
              columnId={column.id}
              currentUser={state.currentUser || "Anonymous"}
              initialData={editingTask || undefined}
            />
          )}

          {column.tasks.length === 0 ? (
            <div className="column__empty-state">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
                <path d="M9 8h6" />
              </svg>
              <p>No tasks yet</p>
              <button
                className="column__add-task-btn column__add-task-btn--with-tasks"
                onClick={handleAddTaskClick}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Task
              </button>
            </div>
          ) : (
            <>
              {/* Task components will be mapped here */}
              {visibleTasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  {/* Dropzone before each task */}
                  <div
                    className="task-dropzone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const data = e.dataTransfer.getData("text/plain");
                      const { taskId } = JSON.parse(data);

                      if (taskId !== task.id) {
                        dispatch({
                          type: "MOVE_TASK",
                          payload: {
                            taskId,
                            newColumnId: column.id,
                            newOrder: index,
                          },
                        });
                      }
                    }}
                  />
                  <TaskCard
                    task={task}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setShowTaskForm(true);
                    }}
                    onDelete={(id) => {
                      dispatch({ type: "DELETE_TASK", payload: id });
                    }}
                  />
                </React.Fragment>
              ))}

              {/* Final dropzone at the bottom */}
              <div
                className="task-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const data = e.dataTransfer.getData("text/plain");
                  const { taskId } = JSON.parse(data);

                  dispatch({
                    type: "MOVE_TASK",
                    payload: {
                      taskId,
                      newColumnId: column.id,
                      newOrder: visibleTasks.length,
                    },
                  });
                }}
              />

              {/* Task Button */}
              <button
                className="column__add-task-btn column__add-task-btn--with-tasks"
                onClick={handleAddTaskClick}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Task
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirming && (
        <div className="column__delete-modal">
          <div className="column__delete-modal-content">
            <h4>Delete Column</h4>
            <p>
              Are you sure you want to delete "{column.title}"?
              {column.tasks.length > 0 && (
                <span className="column__delete-warning">
                  <br />
                  This will also delete {column.tasks.length} task
                  {column.tasks.length === 1 ? "" : "s"}.
                </span>
              )}
            </p>
            <div className="column__delete-modal-actions">
              <button
                className="btn btn--secondary"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button className="btn btn--danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnComponent;
