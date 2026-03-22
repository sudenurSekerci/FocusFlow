import type { ImportanceLevel, UrgencyLevel, TaskStatus } from '../types';

/**
 * Önem ve aciliyet seviyeleri
 */
export const IMPORTANCE_LEVELS: ImportanceLevel[] = ['low', 'medium', 'high'];
export const URGENCY_LEVELS: UrgencyLevel[] = ['low', 'medium', 'high'];
export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'completed'];

/**
 * UI etiketleri (Türkçe)
 */
export const IMPORTANCE_LABELS: Record<ImportanceLevel, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Yapılacak',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
};

/** Durum filtresi */
export type StatusFilter = 'all' | 'todo' | 'in_progress' | 'completed';

/** Aciliyet filtresi */
export type UrgencyFilter = 'all' | 'high' | 'medium' | 'low';

/** Birleşik filtre (geriye uyumluluk için) */
export type TaskFilter = StatusFilter | UrgencyFilter;

export const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'Tümü',
  todo: 'Yapılacak',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
};

export const URGENCY_FILTER_LABELS: Record<UrgencyFilter, string> = {
  all: 'Tümü',
  high: 'Acil',
  medium: 'Orta',
  low: 'Düşük',
};

/** Eski TaskFilter etiketleri (geçiş dönemi) */
export const FILTER_LABELS: Record<string, string> = {
  ...STATUS_FILTER_LABELS,
  ...URGENCY_FILTER_LABELS,
};

/** Başlık için maksimum karakter sayısı */
export const TASK_TITLE_MAX_LENGTH = 200;

/** Başlık için minimum karakter sayısı (trim sonrası) */
export const TASK_TITLE_MIN_LENGTH = 1;

/** Açıklama için maksimum karakter sayısı */
export const TASK_DESCRIPTION_MAX_LENGTH = 500;

/** Pomodoro süresi varsayılanı (dakika) */
export const POMODORO_DURATION_DEFAULT = 25;

/** Pomodoro süresi minimum (dakika) */
export const POMODORO_DURATION_MIN = 1;

/** Pomodoro süresi maksimum (dakika) */
export const POMODORO_DURATION_MAX = 120;

/** Pomodoro süresi (saniye) - varsayılan 25 dakika (geriye uyumluluk) */
export const POMODORO_DURATION_SEC = POMODORO_DURATION_DEFAULT * 60;
