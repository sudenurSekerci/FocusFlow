type Stats = {
  total: number;
  completed: number;
  todo: number;
  inProgress: number;
  urgent: number;
};

type StatisticsPanelProps = {
  stats: Stats;
};

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  const completedPercent =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-panel" data-tour="stats-panel">
      <div className="stats-panel__item">
        <span className="stats-panel__value">{stats.total}</span>
        <span className="stats-panel__label">Toplam</span>
      </div>
      <div className="stats-panel__divider" />
      <div className="stats-panel__item">
        <span className="stats-panel__value">{stats.completed}</span>
        <span className="stats-panel__label">Tamamlandı</span>
      </div>
      <div className="stats-panel__divider" />
      <div className="stats-panel__item stats-panel__item--highlight">
        <span className="stats-panel__value">{completedPercent}%</span>
        <span className="stats-panel__label">İlerleme</span>
      </div>
      <div className="stats-panel__divider" />
      <div className="stats-panel__item">
        <span className="stats-panel__value">{stats.urgent}</span>
        <span className="stats-panel__label">Acil</span>
      </div>
    </div>
  );
}
