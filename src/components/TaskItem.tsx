import { useState, useCallback } from 'react';
import type { Task } from '../types';
import {
  IMPORTANCE_LABELS,
  URGENCY_LABELS,
  STATUS_LABELS,
  POMODORO_DURATION_DEFAULT,
} from '../utils/constants';
import { PomodoroTimer } from './PomodoroTimer';
import { TaskEditModal } from './TaskEditModal';
import type { UpdateTaskError } from '../hooks/useTasks';

type TaskItemProps = {
  task: Task;
  isExiting?: boolean;
  dataTourCard?: boolean;
  onRemove: (id: string) => void;
  onComplete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onSetStatus: (id: string, status: Task['status']) => void;
  onUpdate: (
    id: string,
    data: {
      title: string;
      importance: Task['importance'];
      urgency: Task['urgency'];
      status: Task['status'];
      description?: string;
      pomodoroDuration?: number;
    }
  ) => UpdateTaskError | null;
  onExited?: (id: string) => void;
};

export function TaskItem({
  task,
  isExiting = false,
  dataTourCard = false,
  onRemove,
  onComplete,
  onToggleComplete,
  onSetStatus,
  onUpdate,
  onExited,
}: TaskItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleComplete = useCallback(
    () => onComplete(task.id),
    [onComplete, task.id]
  );

  const handleStartPomodoro = useCallback(
    () => onSetStatus(task.id, 'in_progress'),
    [onSetStatus, task.id]
  );

  const handleToggleComplete = useCallback(
    () => onToggleComplete(task.id),
    [onToggleComplete, task.id]
  );

  const handleAnimationEnd = () => {
    if (isExiting && onExited) {
      onExited(task.id);
    }
  };

  const handleRemove = () => onRemove(task.id);

  const handleSave = useCallback(
    (
      id: string,
      data: {
        title: string;
        importance: Task['importance'];
        urgency: Task['urgency'];
        status: Task['status'];
        description?: string;
        pomodoroDuration?: number;
      }
    ) => {
      return onUpdate(id, data);
    },
    [onUpdate]
  );

  const isCompleted = task.status === 'completed';

  return (
    <>
      <li
        className={`task-item ${isCompleted ? 'task-item--completed' : ''} ${isExiting ? 'task-item--exiting' : ''}`}
        onAnimationEnd={handleAnimationEnd}
        data-tour={dataTourCard ? 'task-card' : undefined}
      >
        <div className="task-item__content">
          <div className="task-item__header">
            <span className="task-item__title">{task.title}</span>
            <button
              type="button"
              className={`task-item__complete-btn ${isCompleted ? 'task-item__complete-btn--checked' : ''}`}
              onClick={handleToggleComplete}
              aria-label={
                isCompleted
                  ? 'Görevi yapılacak olarak işaretle'
                  : 'Görevi tamamlandı olarak işaretle'
              }
              title={isCompleted ? 'Yapılacak yap' : 'Tamamlandı işaretle'}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
          {task.description && (
            <p className="task-item__description">{task.description}</p>
          )}
          <div className="task-item__meta">
            <span
              className={`task-item__badge task-item__badge--${task.importance}`}
              title="Önem"
            >
              {IMPORTANCE_LABELS[task.importance]}
            </span>
            <span
              className={`task-item__badge task-item__badge--${task.urgency}`}
              title="Aciliyet"
            >
              {URGENCY_LABELS[task.urgency]}
            </span>
            <span
              className={`task-item__badge task-item__badge--status task-item__badge--${task.status}`}
            >
              {STATUS_LABELS[task.status]}
            </span>
          </div>
        </div>
        <div className="task-item__actions">
          <PomodoroTimer
            durationMinutes={task.pomodoroDuration ?? POMODORO_DURATION_DEFAULT}
            onComplete={handleComplete}
            onStart={handleStartPomodoro}
            disabled={isCompleted}
          />
          <button
            type="button"
            className="task-item__edit"
            onClick={() => setIsEditOpen(true)}
            aria-label={`"${task.title}" görevini düzenle`}
          >
            Düzenle
          </button>
          <button
            type="button"
            className="task-item__remove"
            onClick={handleRemove}
            aria-label={`"${task.title}" görevini sil`}
          >
            Sil
          </button>
        </div>
      </li>

      {isEditOpen && (
        <TaskEditModal
          task={task}
          onSave={handleSave}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
}
