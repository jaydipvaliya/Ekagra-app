import React, { useState, useEffect, useRef, useCallback } from 'react';

const MODES = ['Focus', 'Short Break', 'Long Break', 'Deep Work'];

export function Timer({ settings, currentRound, onRoundComplete, activeTask, onTaskPomodoroComplete }) {
  const [mode, setMode] = useState('Focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const getInitialTime = useCallback(
    (targetMode) => {
      switch (targetMode) {
        case 'Focus':       return settings.focusDuration * 60;
        case 'Short Break': return settings.shortBreakDuration * 60;
        case 'Long Break':  return settings.longBreakDuration * 60;
        case 'Deep Work':   return settings.deepWorkDuration * 60;
        default:            return settings.focusDuration * 60;
      }
    },
    [settings]
  );

  const resetTimer = useCallback(
    (targetMode = mode) => {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeLeft(getInitialTime(targetMode));
      setMode(targetMode);
    },
    [mode, getInitialTime]
  );

  const playSound = (type) => {
    if (!settings.soundEnabled) return;
    const audio = new Audio(
      type === 'alarm'
        ? 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'
        : 'https://actions.google.com/sounds/v1/ui/click_on.ogg'
    );
    audio.play().catch(() => {});
  };

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleSessionEnd = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    playSound('alarm');

    if (mode === 'Focus' || mode === 'Deep Work') {
      if (activeTask) onTaskPomodoroComplete(activeTask.id);
      const isNextLongBreak = currentRound % settings.roundsBeforeLongBreak === 0;
      const nextMode = isNextLongBreak ? 'Long Break' : 'Short Break';
      onRoundComplete();
      if (settings.autoStartNextSession) {
        setTimeout(() => resetTimer(nextMode), 1000);
        setTimeout(() => toggleTimer(), 1500);
      } else {
        resetTimer(nextMode);
      }
    } else {
      resetTimer('Focus');
    }
  };

  useEffect(() => {
    resetTimer(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / getInitialTime(mode)) * 100;
  const circumference = 2 * Math.PI * 44; // ~276.46

  return (
    <div className="sketch-card ink-shadow p-6 sticky top-6">
      {/* Mode Tabs — thin underline style */}
      <div className="flex flex-wrap gap-0 border-b border-ink-faint/50 dark:border-ink-light/15 mb-8">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => resetTimer(m)}
            className={`px-3 py-2.5 font-heading text-sm transition-all relative ${
              mode === m
                ? 'text-accent font-bold'
                : 'text-ink-light dark:text-chalk-dim hover:text-ink dark:hover:text-chalk'
            }`}
          >
            {m}
            {mode === m && (
              <span className="absolute bottom-0 left-1 right-1 h-[2px] bg-accent rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Timer Display — SVG ring sets the height, text centered on top */}
      <div className="relative flex items-center justify-center">
        <svg className="w-48 h-48" viewBox="0 0 100 100">
          {/* Outer decorative dashed ring */}
          <circle cx="50" cy="50" r="47" className="timer-ring-dashes" />
          {/* Background ring */}
          <circle
            cx="50" cy="50" r="44"
            className="timer-ring-bg"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
          {/* Progress ring */}
          <circle
            cx="50" cy="50" r="44"
            className="timer-ring-progress"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * progress) / 100}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
          {/* Inner decorative dotted circle */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-light)" strokeWidth="0.3" strokeDasharray="1 6" />
        </svg>

        {/* Time text overlaid in the center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-heading font-bold tabular-nums tracking-tight text-ink dark:text-chalk" style={{letterSpacing: '-0.04em'}}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-[11px] font-body text-ink-light dark:text-chalk-dim mt-1 tracking-wider">
            session #{currentRound}
          </div>
        </div>
      </div>

      {/* Controls — circular buttons, lighter feel */}
      <div className="flex items-center justify-center gap-5 mt-4">
        <button
          onClick={() => resetTimer(mode)}
          className="icon-btn"
          title="Reset"
        >
          <i className="fas fa-rotate-left text-sm"></i>
        </button>

        <button
          onClick={toggleTimer}
          className="play-btn"
        >
          <i className={`fas ${isRunning ? 'fa-pause' : 'fa-play'} text-xl ${!isRunning ? 'ml-1' : ''}`}></i>
        </button>

        <button
          onClick={() => setTimeLeft(0)}
          className="icon-btn"
          title="Skip"
        >
          <i className="fas fa-forward-step text-sm"></i>
        </button>
      </div>

      {/* Active Task — notebook margin style */}
      <div className="mt-8 notebook-page p-4">
        <div className="pl-5">
          <div className="text-[10px] font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-widest mb-2">
            Point of Concentration
          </div>
          {activeTask ? (
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0"></span>
              <div className="min-w-0">
                <h4 className="font-heading font-bold text-ink dark:text-chalk text-base truncate leading-tight">{activeTask.text}</h4>
                <p className="text-[11px] text-ink-light dark:text-chalk-dim font-body mt-0.5">
                  phase {activeTask.completedPomodoros + 1} of {activeTask.estPomodoros}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-light dark:text-chalk-dim font-body italic text-center py-1">
              anchor your mind to a task
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
