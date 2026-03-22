/**
 * Görev önem seviyesi
 */
export type ImportanceLevel = 'low' | 'medium' | 'high';

/**
 * Görev aciliyet seviyesi
 */
export type UrgencyLevel = 'low' | 'medium' | 'high';

/**
 * Görev durumu - yapılacak, devam ediyor, tamamlandı
 */
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

/**
 * FocusFlow görev veri modeli
 */
export interface Task {
  id: string;
  title: string;
  importance: ImportanceLevel;
  urgency: UrgencyLevel;
  createdAt: string;
  status: TaskStatus;
  completedAt?: string;
  description?: string;
  deletedAt?: string;
  /** Pomodoro süresi (dakika). Varsayılan 25. */
  pomodoroDuration?: number;
}

/**
 * Görev oluşturma için gerekli alanlar
 */
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'completedAt'>;

/**
 * Görev güncelleme için kısmi alanlar
 */
export type UpdateTaskInput = Partial<
  Omit<Task, 'id' | 'createdAt'>
>;
