import { useEffect, useRef, useState } from 'react';
import { useTasks } from './hooks';
import {
  TaskForm,
  TaskList,
  StatisticsPanel,
  TaskFilters,
  TrashBin,
  TrashList,
  OnboardingTour,
  wasTourCompleted,
} from './components';

function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    const showScrollbar = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 600);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!scrollEl.contains(e.target as Node)) {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        const canScrollUp = scrollTop > 0;
        const canScrollDown = scrollTop < scrollHeight - clientHeight - 1;

        if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
          e.preventDefault();
          scrollEl.scrollTop += e.deltaY;
          showScrollbar();
        }
      }
    };

    const handleScroll = () => showScrollbar();

    window.addEventListener('wheel', handleWheel, { passive: false });
    scrollEl.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      scrollEl.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);

  useEffect(() => {
    if (!wasTourCompleted()) {
      const timer = setTimeout(() => setIsTourActive(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const {
    tasks,
    deletedTasks,
    addTask,
    updateTask,
    removeTask,
    restoreTask,
    permanentlyDeleteTask,
    completeTask,
    setTaskStatus,
    toggleTaskComplete,
    filters,
    setFilters,
    stats,
  } = useTasks();

  return (
    <main className="app">
      <header className="app-header">
        <div className="app-header__content">
          <h1>FocusFlow</h1>
          <p className="app-tagline">Günlük görevlerinizi yönetin</p>
        </div>
        <button
          type="button"
          className="app-header__tour-btn"
          onClick={() => setIsTourActive(true)}
          aria-label="Tanıtım turunu başlat"
          title="Tanıtım turu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </button>
      </header>

      <OnboardingTour
        isActive={isTourActive}
        onComplete={() => setIsTourActive(false)}
      />

      <section className="app-content">
        <aside className="app-content__left">
          <div className="app-content__sticky">
            <StatisticsPanel stats={stats} />
            <TaskForm onAddTask={addTask} />
            <TrashBin
              count={stats.deletedCount}
              isActive={isTrashOpen}
              onClick={() => setIsTrashOpen((prev) => !prev)}
            />
          </div>
        </aside>
        <div className="app-content__right">
          <div className="app-content__fixed">
            <TaskFilters filters={filters} onFilterChange={setFilters} />
            <div className="app-content__fixed-fade" aria-hidden />
          </div>
          <div
            ref={scrollContainerRef}
            className={`app-content__scroll ${isScrolling ? 'app-content__scroll--active' : ''}`}
          >
            <div className="app-content__scroll-fade" aria-hidden />
            {isTrashOpen ? (
              <TrashList
                tasks={deletedTasks}
                onRestore={restoreTask}
                onPermanentlyDelete={permanentlyDeleteTask}
              />
            ) : (
              <TaskList
                tasks={tasks}
                onRemoveTask={removeTask}
                onCompleteTask={completeTask}
                onToggleComplete={toggleTaskComplete}
                onSetTaskStatus={setTaskStatus}
                onUpdateTask={updateTask}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
