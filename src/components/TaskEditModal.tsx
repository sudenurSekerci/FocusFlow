import { useState, useEffect, FormEvent, useCallback } from 'react';
import type { Task, ImportanceLevel, UrgencyLevel, TaskStatus } from '../types';
import {
  IMPORTANCE_LEVELS,
  URGENCY_LEVELS,
  TASK_STATUSES,
  IMPORTANCE_LABELS,
  URGENCY_LABELS,
  STATUS_LABELS,
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
  POMODORO_DURATION_DEFAULT,
  POMODORO_DURATION_MIN,
  POMODORO_DURATION_MAX,
} from '../utils/constants';
import type { UpdateTaskError } from '../hooks/useTasks';

type TaskEditModalProps = {
  task: Task;
  onSave: (
    id: string,
    data: {
      title: string;
      importance: ImportanceLevel;
      urgency: UrgencyLevel;
      status: TaskStatus;
      description?: string;
      pomodoroDuration?: number;
    }
  ) => UpdateTaskError | null;
  onClose: () => void;
};

export function TaskEditModal({ task, onSave, onClose }: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title);
  const [importance, setImportance] = useState<ImportanceLevel>(task.importance);
  const [urgency, setUrgency] = useState<UrgencyLevel>(task.urgency);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [description, setDescription] = useState(task.description ?? '');
  const [pomodoroDuration, setPomodoroDuration] = useState(
    task.pomodoroDuration != null ? String(task.pomodoroDuration) : ''
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      const parsed = pomodoroDuration.trim()
        ? parseInt(pomodoroDuration, 10)
        : POMODORO_DURATION_DEFAULT;
      const duration = Number.isNaN(parsed)
        ? POMODORO_DURATION_DEFAULT
        : Math.min(POMODORO_DURATION_MAX, Math.max(POMODORO_DURATION_MIN, parsed));

      const result = onSave(task.id, {
        title,
        importance,
        urgency,
        status,
        description: description.trim() || undefined,
        pomodoroDuration: duration,
      });

      if (result) {
        setError(result.message);
        return;
      }

      onClose();
    },
    [task.id, title, importance, urgency, status, description, pomodoroDuration, onSave, onClose]
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        <div className="modal__header">
          <h2 id="modal-title">Görevi Düzenle</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Kapat"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="modal__field">
            <label htmlFor="edit-title">Başlık</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              maxLength={TASK_TITLE_MAX_LENGTH}
              className={error ? 'modal__input--error' : ''}
              autoFocus
            />
            <span className="modal__char-count">
              {title.length}/{TASK_TITLE_MAX_LENGTH}
            </span>
          </div>

          {error && (
            <p className="modal__error" role="alert">
              {error}
            </p>
          )}

          <div className="modal__field">
            <label htmlFor="edit-description">Açıklama / Not</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, TASK_DESCRIPTION_MAX_LENGTH))}
              maxLength={TASK_DESCRIPTION_MAX_LENGTH}
              rows={3}
              placeholder="Kısa bir not ekleyin..."
            />
            <span className="modal__char-count">
              {description.length}/{TASK_DESCRIPTION_MAX_LENGTH}
            </span>
          </div>

          <div className="modal__row">
            <div className="modal__field">
              <label htmlFor="edit-importance">Önem</label>
              <select
                id="edit-importance"
                value={importance}
                onChange={(e) => setImportance(e.target.value as ImportanceLevel)}
              >
                {IMPORTANCE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {IMPORTANCE_LABELS[l]}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal__field">
              <label htmlFor="edit-urgency">Aciliyet</label>
              <select
                id="edit-urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
              >
                {URGENCY_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {URGENCY_LABELS[l]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal__row">
            <div className="modal__field">
              <label htmlFor="edit-status">Durum</label>
              <select
                id="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal__field">
              <label htmlFor="edit-pomodoro">Süre (dk)</label>
              <input
                id="edit-pomodoro"
                type="number"
                min={POMODORO_DURATION_MIN}
                max={POMODORO_DURATION_MAX}
                value={pomodoroDuration}
                onChange={(e) => setPomodoroDuration(e.target.value)}
                placeholder="25"
                title="Boş bırakırsanız 25 dakika kullanılır"
              />
            </div>
          </div>

          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="modal__btn modal__btn--primary">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
