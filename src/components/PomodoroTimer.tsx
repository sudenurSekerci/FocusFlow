import { useState, useEffect, useCallback, useRef } from 'react';
import { POMODORO_DURATION_DEFAULT } from '../utils/constants';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

type PomodoroTimerProps = {
  durationMinutes?: number;
  onComplete: () => void;
  onStart?: () => void;
  disabled?: boolean;
};

export function PomodoroTimer({
  durationMinutes = POMODORO_DURATION_DEFAULT,
  onComplete,
  onStart,
  disabled,
}: PomodoroTimerProps) {
  const totalSeconds = Math.max(1, Math.min(120, durationMinutes)) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevTotalRef = useRef(totalSeconds);

  /* Süre prop'u değiştiğinde (düzenleme) sıfırla; duraklatma sıfırlamaz */
  useEffect(() => {
    if (prevTotalRef.current !== totalSeconds) {
      prevTotalRef.current = totalSeconds;
      if (!isRunning) setSecondsLeft(totalSeconds);
    }
  }, [totalSeconds, isRunning]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return stopTimer;
  }, [isRunning, onComplete, stopTimer]);

  const handleStart = () => {
    onStart?.();
    setIsRunning(true);
  };

  const handlePause = () => {
    stopTimer();
  };

  const handleReset = () => {
    stopTimer();
    setSecondsLeft(totalSeconds);
  };

  const progress = 1 - secondsLeft / totalSeconds;

  return (
    <div className={`pomodoro ${disabled ? 'pomodoro--disabled' : ''}`}>
      <div className="pomodoro__ring">
        <svg className="pomodoro__svg" viewBox="0 0 64 64">
          <circle
            className="pomodoro__track"
            cx="32"
            cy="32"
            r="28"
            fill="none"
            strokeWidth="4"
          />
          <circle
            className="pomodoro__progress"
            cx="32"
            cy="32"
            r="28"
            fill="none"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress)}`}
          />
        </svg>
      </div>
      <span className="pomodoro__time">{formatTime(secondsLeft)}</span>
      <div className="pomodoro__controls">
        {!isRunning ? (
          <button
            type="button"
            className="pomodoro__btn pomodoro__btn--play"
            onClick={handleStart}
            disabled={disabled}
            aria-label="Başlat"
          >
            Başla
          </button>
        ) : (
          <button
            type="button"
            className="pomodoro__btn pomodoro__btn--pause"
            onClick={handlePause}
            aria-label="Duraklat"
          >
            Duraklat
          </button>
        )}
        <button
          type="button"
          className="pomodoro__btn pomodoro__btn--reset"
          onClick={handleReset}
          disabled={disabled}
          aria-label="Sıfırla"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}
