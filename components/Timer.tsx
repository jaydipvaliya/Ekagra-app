
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, TimerMode, Task } from '../types';
import { TIMER_MODES_CONFIG } from '../constants';

interface TimerProps {
  settings: Settings;
  currentRound: number;
  onRoundComplete: () => void;
  activeTask: Task | null;
  onTaskPomodoroComplete: (id: string) => void;
}

export const Timer: React.FC<TimerProps> = ({ 
  settings, currentRound, onRoundComplete, activeTask, onTaskPomodoroComplete 
}) => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const getInitialTime = (targetMode: TimerMode) => {
    switch (targetMode) {
      case TimerMode.FOCUS: return settings.focusDuration * 60;
      case TimerMode.SHORT_BREAK: return settings.shortBreakDuration * 60;
      case TimerMode.LONG_BREAK: return settings.longBreakDuration * 60;
      case TimerMode.DEEP_WORK: return settings.deepWorkDuration * 60;
      default: return settings.focusDuration * 60;
    }
  };

  const resetTimer = useCallback((targetMode: TimerMode = mode) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(getInitialTime(targetMode));
    setMode(targetMode);
  }, [mode, settings]);

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

  const playSound = (type: 'tick' | 'alarm') => {
    if (!settings.soundEnabled) return;
    const audio = new Audio(
      type === 'alarm' 
        ? 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' 
        : 'https://actions.google.com/sounds/v1/ui/click_on.ogg'
    );
    audio.play().catch(() => {});
  };

  const handleSessionEnd = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    playSound('alarm');

    if (mode === TimerMode.FOCUS || mode === TimerMode.DEEP_WORK) {
      if (activeTask) onTaskPomodoroComplete(activeTask.id);
      
      const isNextLongBreak = currentRound % settings.roundsBeforeLongBreak === 0;
      const nextMode = isNextLongBreak ? TimerMode.LONG_BREAK : TimerMode.SHORT_BREAK;
      
      onRoundComplete();
      
      if (settings.autoStartNextSession) {
        setTimeout(() => resetTimer(nextMode), 1000);
        setTimeout(() => toggleTimer(), 1500);
      } else {
        resetTimer(nextMode);
      }
    } else {
      resetTimer(TimerMode.FOCUS);
    }
  };

  useEffect(() => {
    resetTimer(mode);
  }, [settings, resetTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / getInitialTime(mode)) * 100;
  const config = TIMER_MODES_CONFIG[mode];

  return (
    <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 sticky top-8">
      {/* Mode Selectors */}
      <div className="grid grid-cols-2 gap-2 mb-10 bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
        {Object.values(TimerMode).map((m) => (
          <button
            key={m}
            onClick={() => resetTimer(m)}
            className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              mode === m 
                ? `${TIMER_MODES_CONFIG[m].color} text-white shadow-xl` 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Main Timer Display */}
      <div className="relative flex items-center justify-center py-12">
        <svg className="absolute w-72 h-72 -rotate-90" viewBox="0 0 100 100">
          <circle 
            className="text-slate-50" 
            strokeWidth="3" 
            stroke="currentColor" 
            fill="transparent" 
            r="46" 
            cx="50" 
            cy="50" 
          />
          <circle 
            className={`transition-all duration-1000 ${config.text}`}
            strokeWidth="3" 
            strokeDasharray={289}
            strokeDashoffset={289 - (289 * progress) / 100}
            strokeLinecap="round" 
            stroke="currentColor" 
            fill="transparent" 
            r="46" 
            cx="50" 
            cy="50" 
          />
        </svg>

        <div className="text-center z-10">
          <div className={`text-7xl font-black tabular-nums tracking-tighter ${config.text}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-[10px] font-black text-slate-300 mt-3 uppercase tracking-[0.4em]">
             Session #{currentRound}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button 
          onClick={() => resetTimer(mode)}
          className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
          title="Reset Consciousness"
        >
          <i className="fas fa-rotate-left text-xl"></i>
        </button>
        
        <button 
          onClick={toggleTimer}
          className={`w-24 h-24 rounded-[2rem] ${config.color} text-white shadow-2xl shadow-indigo-100 flex items-center justify-center transition-all hover:scale-105 active:scale-95`}
        >
          <i className={`fas ${isRunning ? 'fa-pause' : 'fa-play'} text-3xl`}></i>
        </button>

        <button 
          onClick={() => setTimeLeft(0)}
          className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-slate-100 transition-all active:scale-95"
          title="Jump Forward"
        >
          <i className="fas fa-forward-step text-xl"></i>
        </button>
      </div>

      {/* Active Task Info */}
      <div className="mt-12 p-6 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100/50">
        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Point of Concentration</div>
        {activeTask ? (
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl ${config.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
              <i className="fas fa-circle-dot"></i>
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">{activeTask.text}</h4>
              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1 opacity-70">
                Phase {activeTask.completedPomodoros + 1} of {activeTask.estPomodoros}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-indigo-300 font-bold italic py-2 text-center">
            Anchor your mind to a task
          </div>
        )}
      </div>
    </div>
  );
};
