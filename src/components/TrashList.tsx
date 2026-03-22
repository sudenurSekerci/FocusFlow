import type { Task } from '../types';
import { IMPORTANCE_LABELS, URGENCY_LABELS, STATUS_LABELS } from '../utils/constants';

type TrashListProps = {
  tasks: Task[];
  onRestore: (id: string) => void;
  onPermanentlyDelete: (id: string) => void;
};

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString('tr-TR');
}

export function TrashList({
  tasks,
  onRestore,
  onPermanentlyDelete,
}: TrashListProps) {
  if (tasks.length === 0) {
    return (
      <div className="trash-list trash-list--empty">
        <svg
          className="trash-list__empty-icon"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <p>Çöp kutusu boş</p>
        <p className="trash-list__empty-hint">
          Silinen görevler burada görünecek
        </p>
      </div>
    );
  }

  return (
    <div className="trash-list">
      <div className="trash-list__header">
        <h2 className="trash-list__title">Silinen görevler</h2>
        <p className="trash-list__subtitle">
          Geri almak istediğiniz görevleri seçebilirsiniz
        </p>
      </div>
      <ul className="trash-list__items">
        {tasks.map((task) => (
          <li key={task.id} className="trash-item">
            <div className="trash-item__content">
              <span className="trash-item__title">{task.title}</span>
              {task.description && (
                <p className="trash-item__description">{task.description}</p>
              )}
              <div className="trash-item__meta">
                <span
                  className={`trash-item__badge trash-item__badge--${task.importance}`}
                >
                  {IMPORTANCE_LABELS[task.importance]}
                </span>
                <span
                  className={`trash-item__badge trash-item__badge--${task.urgency}`}
                >
                  {URGENCY_LABELS[task.urgency]}
                </span>
                <span
                  className={`trash-item__badge trash-item__badge--status trash-item__badge--${task.status}`}
                >
                  {STATUS_LABELS[task.status]}
                </span>
                {task.deletedAt && (
                  <span className="trash-item__date">
                    {formatRelativeDate(task.deletedAt)}
                  </span>
                )}
              </div>
            </div>
            <div className="trash-item__actions">
              <button
                type="button"
                className="trash-item__restore"
                onClick={() => onRestore(task.id)}
                aria-label={`"${task.title}" görevini geri al`}
              >
                Geri Al
              </button>
              <button
                type="button"
                className="trash-item__delete"
                onClick={() => onPermanentlyDelete(task.id)}
                aria-label={`"${task.title}" görevini kalıcı olarak sil`}
              >
                Kalıcı Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
