import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Task,
  ImportanceLevel,
  UrgencyLevel,
  TaskStatus,
  UpdateTaskInput,
} from '../types';
import type { StatusFilter, UrgencyFilter } from '../utils/constants';

export type TaskFiltersState = {
  status: StatusFilter;
  urgency: UrgencyFilter;
};
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';
import { sortTasksByPriority } from '../utils/taskSort';
import {
  TASK_TITLE_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
  POMODORO_DURATION_DEFAULT,
  POMODORO_DURATION_MIN,
  POMODORO_DURATION_MAX,
} from '../utils/constants';

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export type AddTaskError = {
  type: 'empty' | 'tooShort' | 'tooLong';
  message: string;
};

export type UpdateTaskError = AddTaskError;

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, setFilters] = useState<TaskFiltersState>({
    status: 'all',
    urgency: 'all',
  });

  useEffect(() => {
    setTasks(loadTasksFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveTasksToStorage(tasks);
  }, [tasks, isHydrated]);

  const validateTitle = useCallback(
    (title: string): AddTaskError | null => {
      const trimmed = title.trim();
      if (trimmed.length === 0) {
        return { type: 'empty', message: 'Görev başlığı boş olamaz.' };
      }
      if (trimmed.length < TASK_TITLE_MIN_LENGTH) {
        return {
          type: 'tooShort',
          message: 'Görev başlığı en az 1 karakter olmalıdır.',
        };
      }
      if (trimmed.length > TASK_TITLE_MAX_LENGTH) {
        return {
          type: 'tooLong',
          message: `Görev başlığı en fazla ${TASK_TITLE_MAX_LENGTH} karakter olabilir.`,
        };
      }
      return null;
    },
    []
  );

  const validateDescription = useCallback((description: string): null => {
    if (description.length > TASK_DESCRIPTION_MAX_LENGTH) return null;
    return null;
  }, []);

  const activeTasks = tasks.filter((t) => !t.deletedAt);
  const deletedTasks = tasks
    .filter((t) => t.deletedAt)
    .sort(
      (a, b) =>
        (b.deletedAt ? new Date(b.deletedAt).getTime() : 0) -
        (a.deletedAt ? new Date(a.deletedAt).getTime() : 0)
    );

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = activeTasks;
    if (filters.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters.urgency !== 'all') {
      filtered = filtered.filter((t) => t.urgency === filters.urgency);
    }
    return sortTasksByPriority(filtered);
  }, [activeTasks, filters]);

  const addTask = useCallback(
    (
      title: string,
      importance: ImportanceLevel,
      urgency: UrgencyLevel,
      description?: string,
      pomodoroDuration?: number
    ): AddTaskError | null => {
      const error = validateTitle(title);
      if (error) return error;

      const trimmedDesc =
        description?.trim().slice(0, TASK_DESCRIPTION_MAX_LENGTH) ?? '';

      const duration =
        typeof pomodoroDuration === 'number' &&
        pomodoroDuration >= POMODORO_DURATION_MIN &&
        pomodoroDuration <= POMODORO_DURATION_MAX
          ? pomodoroDuration
          : POMODORO_DURATION_DEFAULT;

      const newTask: Task = {
        id: generateId(),
        title: title.trim(),
        importance,
        urgency,
        createdAt: new Date().toISOString(),
        status: 'todo',
        description: trimmedDesc || undefined,
        pomodoroDuration: duration,
      };

      setTasks((prev) => [...prev, newTask]);
      return null;
    },
    [validateTitle]
  );

  const updateTask = useCallback(
    (id: string, input: UpdateTaskInput): UpdateTaskError | null => {
      if (input.title !== undefined) {
        const error = validateTitle(input.title);
        if (error) return error;
      }
      if (input.description !== undefined) {
        const desc = input.description.trim().slice(0, TASK_DESCRIPTION_MAX_LENGTH);
        input = { ...input, description: desc || undefined };
      }

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const updated = { ...t, ...input };
          if (input.status === 'completed') {
            updated.completedAt = new Date().toISOString();
          } else if (input.status) {
            updated.completedAt = undefined;
          }
          return updated;
        })
      );
      return null;
    },
    [validateTitle]
  );

  const removeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, deletedAt: new Date().toISOString() }
          : t
      )
    );
  }, []);

  const restoreTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, deletedAt: undefined } : t))
    );
  }, []);

  const permanentlyDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'completed' as TaskStatus,
              completedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const setTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completedAt:
                status === 'completed' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                t.status === 'completed'
                  ? ('todo' as TaskStatus)
                  : ('completed' as TaskStatus),
              completedAt:
                t.status === 'completed' ? undefined : new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const stats = {
    total: activeTasks.length,
    completed: activeTasks.filter((t) => t.status === 'completed').length,
    todo: activeTasks.filter((t) => t.status === 'todo').length,
    inProgress: activeTasks.filter((t) => t.status === 'in_progress').length,
    urgent: activeTasks.filter((t) => t.urgency === 'high').length,
    deletedCount: deletedTasks.length,
  };

  return {
    tasks: filteredAndSortedTasks,
    allTasks: activeTasks,
    deletedTasks,
    addTask,
    updateTask,
    removeTask,
    restoreTask,
    permanentlyDeleteTask,
    completeTask,
    setTaskStatus,
    toggleTaskComplete,
    validateTitle,
    validateDescription,
    filters,
    setFilters,
    stats,
  };
}
