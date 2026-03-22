import type { StatusFilter, UrgencyFilter } from '../utils/constants';
import {
  STATUS_FILTER_LABELS,
  URGENCY_FILTER_LABELS,
} from '../utils/constants';
import type { TaskFiltersState } from '../hooks/useTasks';

type TaskFiltersProps = {
  filters: TaskFiltersState;
  onFilterChange: (filters: TaskFiltersState) => void;
};

const STATUS_OPTIONS: StatusFilter[] = [
  'all',
  'todo',
  'in_progress',
  'completed',
];

const URGENCY_OPTIONS: UrgencyFilter[] = ['all', 'high', 'medium', 'low'];

export function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const handleStatusChange = (status: StatusFilter) => {
    onFilterChange({ ...filters, status });
  };

  const handleUrgencyChange = (urgency: UrgencyFilter) => {
    onFilterChange({ ...filters, urgency });
  };

  return (
    <div className="task-filters" role="group" aria-label="Görev filtreleri" data-tour="filters">
      <div className="task-filters__row">
        <span className="task-filters__label">Durum:</span>
        <div className="task-filters__group">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              className={`task-filters__btn ${filters.status === status ? 'task-filters__btn--active' : ''}`}
              onClick={() => handleStatusChange(status)}
              aria-pressed={filters.status === status}
            >
              {STATUS_FILTER_LABELS[status]}
            </button>
          ))}
        </div>
      </div>
      <div className="task-filters__row">
        <span className="task-filters__label">Aciliyet:</span>
        <div className="task-filters__group">
          {URGENCY_OPTIONS.map((urgency) => (
            <button
              key={urgency}
              type="button"
              className={`task-filters__btn ${filters.urgency === urgency ? 'task-filters__btn--active' : ''}`}
              onClick={() => handleUrgencyChange(urgency)}
              aria-pressed={filters.urgency === urgency}
            >
              {URGENCY_FILTER_LABELS[urgency]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
