import { useState, FormEvent } from 'react';
import type { ImportanceLevel, UrgencyLevel } from '../types';
import {
  IMPORTANCE_LEVELS,
  URGENCY_LEVELS,
  IMPORTANCE_LABELS,
  URGENCY_LABELS,
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
  POMODORO_DURATION_DEFAULT,
  POMODORO_DURATION_MIN,
  POMODORO_DURATION_MAX,
} from '../utils/constants';
import type { AddTaskError } from '../hooks/useTasks';

type TaskFormProps = {
  onAddTask: (
    title: string,
    importance: ImportanceLevel,
    urgency: UrgencyLevel,
    description?: string,
    pomodoroDuration?: number
  ) => AddTaskError | null;
};

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState<ImportanceLevel>('medium');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [pomodoroDuration, setPomodoroDuration] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = pomodoroDuration.trim()
      ? parseInt(pomodoroDuration, 10)
      : POMODORO_DURATION_DEFAULT;
    const duration = Number.isNaN(parsed)
      ? POMODORO_DURATION_DEFAULT
      : Math.min(POMODORO_DURATION_MAX, Math.max(POMODORO_DURATION_MIN, parsed));

    const result = onAddTask(title, importance, urgency, description, duration);
    if (result) {
      setError(result.message);
      return;
    }

    setTitle('');
    setDescription('');
    setImportance('medium');
    setUrgency('medium');
    setPomodoroDuration('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} data-tour="task-form">
      <div className="task-form__row">
        <label htmlFor="task-title" className="task-form__label">
          Görev başlığı
        </label>
        <input
          id="task-title"
          type="text"
          className={`task-form__input ${error ? 'task-form__input--error' : ''}`}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Örn: Proje raporunu tamamla"
          maxLength={TASK_TITLE_MAX_LENGTH}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? 'task-form-error' : undefined}
        />
        <span className="task-form__char-count">
          {title.length}/{TASK_TITLE_MAX_LENGTH}
        </span>
      </div>

      <div className="task-form__row">
        <label htmlFor="task-description" className="task-form__label">
          Açıklama / Not (isteğe bağlı)
        </label>
        <textarea
          id="task-description"
          className="task-form__textarea"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value.slice(0, TASK_DESCRIPTION_MAX_LENGTH))
          }
          placeholder="Kısa bir not ekleyin..."
          maxLength={TASK_DESCRIPTION_MAX_LENGTH}
          rows={2}
        />
        <span className="task-form__char-count">
          {description.length}/{TASK_DESCRIPTION_MAX_LENGTH}
        </span>
      </div>

      {error && (
        <p id="task-form-error" className="task-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="task-form__row task-form__row--inline">
        <div className="task-form__field">
          <label htmlFor="task-pomodoro" className="task-form__label">
            Süre (dk)
          </label>
          <input
            id="task-pomodoro"
            type="number"
            min={POMODORO_DURATION_MIN}
            max={POMODORO_DURATION_MAX}
            className="task-form__input task-form__input--narrow"
            value={pomodoroDuration}
            onChange={(e) => setPomodoroDuration(e.target.value)}
            placeholder="25"
            title={`${POMODORO_DURATION_MIN}-${POMODORO_DURATION_MAX} dakika (boş bırakırsanız 25 kullanılır)`}
          />
        </div>
        <div className="task-form__field">
          <label htmlFor="task-importance" className="task-form__label">
            Önem
          </label>
          <select
            id="task-importance"
            className="task-form__select"
            value={importance}
            onChange={(e) => setImportance(e.target.value as ImportanceLevel)}
          >
            {IMPORTANCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {IMPORTANCE_LABELS[level]}
              </option>
            ))}
          </select>
        </div>
        <div className="task-form__field">
          <label htmlFor="task-urgency" className="task-form__label">
            Aciliyet
          </label>
          <select
            id="task-urgency"
            className="task-form__select"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
          >
            {URGENCY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {URGENCY_LABELS[level]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="task-form__submit">
        Görev Ekle
      </button>
    </form>
  );
}
