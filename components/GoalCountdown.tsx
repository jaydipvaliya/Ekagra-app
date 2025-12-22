import React, { useState, useEffect, useCallback } from 'react';
import { Goal, GoalDraft } from '../types';

interface GoalCountdownProps {
  goal: Goal | null;
  onSetGoal: (goal: Goal | null) => void;
  goalDraft: GoalDraft;
  onUpdateDraft: (draft: GoalDraft) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const GoalCountdown: React.FC<GoalCountdownProps> = ({ goal, onSetGoal, goalDraft, onUpdateDraft }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

  const calculateTimeRemaining = useCallback(() => {
    if (!goal || !goal.targetDate) return null;

    const target = new Date(goal.targetDate).getTime();
    const now = new Date().getTime();
    
    if (isNaN(target)) return null;

    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isExpired: false
    };
  }, [goal]);

  useEffect(() => {
    if (!goal) {
      setTimeRemaining(null);
      return;
    }

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [goal, calculateTimeRemaining]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalDraft.title.trim() || !goalDraft.targetDate) return;
    onSetGoal({ title: goalDraft.title.trim(), targetDate: goalDraft.targetDate });
    onUpdateDraft({ ...goalDraft, isEditing: false });
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your goal?")) {
      onSetGoal(null);
      onUpdateDraft({ title: '', targetDate: '', isEditing: true });
    }
  };

  const setEditing = (isEditing: boolean) => {
    onUpdateDraft({ ...goalDraft, isEditing });
  };

  const updateTitle = (title: string) => {
    onUpdateDraft({ ...goalDraft, title });
  };

  const updateDate = (targetDate: string) => {
    onUpdateDraft({ ...goalDraft, targetDate });
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white p-4 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 min-w-[100px] md:min-w-[140px] transition-all hover:scale-105 hover:shadow-2xl">
      <div className="text-4xl md:text-6xl font-black text-indigo-600 tabular-nums tracking-tighter">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
        {label}
      </div>
    </div>
  );

  const showForm = !goal || goalDraft.isEditing;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">
          {showForm ? "Define Your Future" : "Eyes on the Prize"}
        </h2>
        <p className="text-slate-500 font-medium">
          Big dreams require consistent focus and clear deadlines.
        </p>
      </div>

      {showForm ? (
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 max-w-2xl mx-auto">
          <form onSubmit={handleStart} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Goal Name</label>
                <input 
                  type="text" 
                  value={goalDraft.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  placeholder="e.g. Final Semester Exams, Launch Day..."
                  className="w-full bg-slate-50 border-none rounded-2xl p-6 text-xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-200 shadow-inner"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Deadline Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={goalDraft.targetDate}
                  onChange={(e) => updateDate(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl p-6 text-xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 transition-all appearance-none shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white p-6 rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                disabled={!goalDraft.title.trim() || !goalDraft.targetDate}
              >
                Start Countdown
              </button>
              {goal && (
                <button 
                  type="button"
                  onClick={() => {
                    // Revert to saved goal values when canceling edit
                    onUpdateDraft({ title: goal.title, targetDate: goal.targetDate, isEditing: false });
                  }}
                  className="w-full text-slate-400 font-bold py-2 hover:text-slate-600 transition-colors"
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h3 className="text-5xl font-black text-indigo-600 uppercase tracking-tight leading-tight drop-shadow-sm">
              {goal?.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <i className="fas fa-calendar-check text-indigo-400"></i>
              <span className="text-sm font-bold">
                {goal?.targetDate ? new Date(goal.targetDate).toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'No date set'}
              </span>
            </div>
          </div>

          {timeRemaining?.isExpired ? (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[3rem] p-16 text-center text-white shadow-2xl animate-in zoom-in duration-500">
              <div className="relative inline-block mb-6">
                 <i className="fas fa-trophy text-7xl"></i>
                 <div className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full animate-ping"></div>
              </div>
              <h4 className="text-4xl font-black">Goal Reached!</h4>
              <p className="text-xl opacity-90 mt-2">Amazing work. You crossed the finish line! 🎉</p>
              <button 
                onClick={handleClear}
                className="mt-8 bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                Reset for New Goal
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <TimeUnit value={timeRemaining?.days || 0} label="Days" />
              <TimeUnit value={timeRemaining?.hours || 0} label="Hours" />
              <TimeUnit value={timeRemaining?.minutes || 0} label="Minutes" />
              <TimeUnit value={timeRemaining?.seconds || 0} label="Seconds" />
            </div>
          )}

          {!timeRemaining?.isExpired && (
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setEditing(true)}
                className="px-8 py-4 bg-white text-slate-600 font-black rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 group"
              >
                <i className="fas fa-edit group-hover:text-indigo-500 transition-colors"></i>
                Edit Goal
              </button>
              <button 
                onClick={handleClear}
                className="px-8 py-4 bg-white text-slate-400 font-black rounded-2xl border border-slate-100 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center gap-2"
              >
                <i className="fas fa-trash-alt"></i>
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Decorative motivational banner */}
      {!showForm && !timeRemaining?.isExpired && (
        <div className="bg-indigo-50/50 rounded-[2rem] p-8 border border-indigo-100 text-center">
          <p className="text-indigo-600 font-bold italic">
            "Your limitation—it's only your imagination. Keep pushing towards {goal?.title}!"
          </p>
        </div>
      )}
    </div>
  );
};
