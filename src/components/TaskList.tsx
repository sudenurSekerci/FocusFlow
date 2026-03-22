import { useState, useCallback } from 'react';
import type { Task } from '../types';
import { TaskItem } from './TaskItem';
import type { UpdateTaskError } from '../hooks/useTasks';

type TaskListProps = {
  tasks: Task[];
  onRemoveTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onSetTaskStatus: (id: string, status: Task['status']) => void;
  onUpdateTask: (
    id: string,
    data: {
      title: string;
      importance: Task['importance'];
      urgency: Task['urgency'];
      status: Task['status'];
      description?: string;
    }
  ) => UpdateTaskError | null;
};

export function TaskList({
  tasks,
  onRemoveTask,
  onCompleteTask,
  onToggleComplete,
  onSetTaskStatus,
  onUpdateTask,
}: TaskListProps) {
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const handleRemoveRequest = useCallback((id: string) => {
    setExitingIds((prev) => new Set(prev).add(id));
  }, []);

  const handleExited = useCallback(
    (id: string) => {
      onRemoveTask(id);
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [onRemoveTask]
  );

  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--empty" data-tour="task-list">
        <p>
          Bu filtrede görev bulunamadı. Farklı bir filtre seçin veya yeni görev
          ekleyin.
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list" data-tour="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          dataTourCard={index === 0}
          isExiting={exitingIds.has(task.id)}
          onRemove={handleRemoveRequest}
          onComplete={onCompleteTask}
          onToggleComplete={onToggleComplete}
          onSetStatus={onSetTaskStatus}
          onUpdate={onUpdateTask}
          onExited={handleExited}
        />
      ))}
    </ul>
  );
}
