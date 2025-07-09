import React, { useState, useEffect, useRef } from "react";
import "./ColumnForm.css";

interface ColumnFormProps {
  isOpen: boolean;
  onSubmit: (title: string) => void;
  onCancel: () => void;
  initialTitle?: string;
  mode?: "create" | "edit";
}

const ColumnForm: React.FC<ColumnFormProps> = ({
  isOpen,
  onSubmit,
  onCancel,
  initialTitle = "",
  mode = "create",
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setError("");
      setIsSubmitting(false);
      // Focus the input after modal animation
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
          titleInputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, initialTitle]);

  // Handle escape key and click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleCancel();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateTitle = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Column title is required";
    }
    if (trimmed.length < 2) {
      return "Column title must be at least 2 characters";
    }
    if (trimmed.length > 50) {
      return "Column title must be less than 50 characters";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateTitle(title);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate async operation 
      await new Promise((resolve) => setTimeout(resolve, 100));
      onSubmit(title.trim());
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onCancel();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="column-form-overlay">
      <div className="column-form-modal" ref={modalRef}>
        <div className="column-form-header">
          <h2 className="column-form-title">
            {mode === "create" ? "Create New Column" : "Edit Column"}
          </h2>
          <button
            className="column-form-close"
            onClick={handleCancel}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="column-form-form">
          <div className="column-form-field">
            <label htmlFor="column-title" className="column-form-label">
              Column Title <span className="column-form-required">*</span>
            </label>
            <input
              id="column-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={handleTitleKeyDown}
              className={`column-form-input ${
                error ? "column-form-input--error" : ""
              }`}
              placeholder="Enter column title (e.g., To Do, In Progress, Done)"
              maxLength={50}
              disabled={isSubmitting}
              autoComplete="off"
            />
            <div className="column-form-input-meta">
              {error && <span className="column-form-error">{error}</span>}
              <span className="column-form-char-count">{title.length}/50</span>
            </div>
          </div>

          <div className="column-form-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? (
                <span className="column-form-loading">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  {mode === "create" ? "Creating..." : "Saving..."}
                </span>
              ) : (
                <span>
                  {mode === "create" ? "Create Column" : "Save Changes"}
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="column-form-footer">
          <p className="column-form-hint">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            Press <kbd>Enter</kbd> to save, <kbd>Escape</kbd> to cancel
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColumnForm;
