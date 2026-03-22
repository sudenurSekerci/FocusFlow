import type { Task, TaskStatus } from '../types';

const STORAGE_KEY = 'focusflow-tasks';

export function loadTasksFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTask).map(migrateTask);
  } catch {
    return [];
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Görevler kaydedilemedi:', error);
  }
}

function isValidTask(item: unknown): item is Record<string, unknown> {
  if (!item || typeof item !== 'object') return false;
  const t = item as Record<string, unknown>;
  const valid =
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    ['low', 'medium', 'high'].includes(t.importance as string) &&
    ['low', 'medium', 'high'].includes(t.urgency as string) &&
    typeof t.createdAt === 'string';
  if (!valid) return false;
  if (t.status !== undefined && !['todo', 'in_progress', 'completed'].includes(t.status as string))
    return false;
  if (t.completed !== undefined && typeof t.completed !== 'boolean') return false;
  return true;
}

export function migrateTask(item: unknown): Task {
  const t = item as Record<string, unknown>;
  const hasStatus = ['todo', 'in_progress', 'completed'].includes(
    t.status as string
  );
  const legacyCompleted = t.completed === true;
  const status: TaskStatus = hasStatus
    ? (t.status as TaskStatus)
    : legacyCompleted
      ? 'completed'
      : 'todo';

  const pomodoroDuration =
    typeof t.pomodoroDuration === 'number' &&
    t.pomodoroDuration >= 1 &&
    t.pomodoroDuration <= 120
      ? t.pomodoroDuration
      : undefined;

  return {
    id: t.id as string,
    title: t.title as string,
    importance: t.importance as Task['importance'],
    urgency: t.urgency as Task['urgency'],
    createdAt: t.createdAt as string,
    status,
    completedAt:
      status === 'completed'
        ? (t.completedAt as string | undefined)
        : undefined,
    description: typeof t.description === 'string' ? t.description : undefined,
    deletedAt: typeof t.deletedAt === 'string' ? t.deletedAt : undefined,
    pomodoroDuration: pomodoroDuration ?? 25,
  };
}
