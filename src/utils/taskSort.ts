import type { Task, ImportanceLevel, UrgencyLevel } from '../types';

const LEVEL_SCORE: Record<ImportanceLevel | UrgencyLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/** Aynı öncelik grubunda: devam eden en üstte, sonra yapılacak, en altta tamamlanan */
const STATUS_ORDER: Record<Task['status'], number> = {
  in_progress: 0,
  todo: 1,
  completed: 2,
};

function getTaskPriorityScore(task: Task): number {
  return LEVEL_SCORE[task.importance] * 10 + LEVEL_SCORE[task.urgency];
}

/**
 * Görevleri sıralar: Önce öncelik (önem+aciliyet), sonra aynı grupta durum (in_progress önce),
 * sonra oluşturulma tarihi, son olarak id.
 * Böylece Pomodoro başlatıldığında görev sadece kendi öncelik grubunda hareket eder,
 * listede zıplama olmaz.
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const scoreA = getTaskPriorityScore(a);
    const scoreB = getTaskPriorityScore(b);
    if (scoreB !== scoreA) return scoreB - scoreA;

    const statusA = STATUS_ORDER[a.status];
    const statusB = STATUS_ORDER[b.status];
    if (statusA !== statusB) return statusA - statusB;

    if (a.status === 'completed' && b.status === 'completed') {
      const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id);
    }

    const createdA = new Date(a.createdAt).getTime();
    const createdB = new Date(b.createdAt).getTime();
    if (createdA !== createdB) return createdA - createdB;

    return a.id.localeCompare(b.id);
  });
}
