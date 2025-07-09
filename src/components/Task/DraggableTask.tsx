import { useDraggable } from "@dnd-kit/core";
import TaskCard from "./Task";
import { Task } from "../../types";

interface DraggableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onSubmit: (task: Task) => void;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const { setNodeRef, listeners, attributes, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default DraggableTask;
