import React, { useState, useEffect, useCallback } from 'react';

export function GoalCountdown({ goal, onSetGoal, goalDraft, onUpdateDraft }) {
  const [timeRemaining, setTimeRemaining] = useState(null);

  const calculateTimeRemaining = useCallback(() => {
    if (!goal || !goal.targetDate) return null;
    const target = new Date(goal.targetDate).getTime();
    const now = new Date().getTime();
    if (isNaN(target)) return null;
    const difference = target - now;
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isExpired: false,
    };
  }, [goal]);

  useEffect(() => {
    if (!goal) {
      setTimeRemaining(null);
      return;
    }
    setTimeRemaining(calculateTimeRemaining());
    const timer = setInterval(() => setTimeRemaining(calculateTimeRemaining()), 1000);
    return () => clearInterval(timer);
  }, [goal, calculateTimeRemaining]);

  const handleStart = (e) => {
    e.preventDefault();
    if (!goalDraft.title.trim() || !goalDraft.targetDate) return;
    onSetGoal({ title: goalDraft.title.trim(), targetDate: goalDraft.targetDate });
    onUpdateDraft({ ...goalDraft, isEditing: false });
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your goal?')) {
      onSetGoal(null);
      onUpdateDraft({ title: '', targetDate: '', isEditing: true });
    }
  };

  const setEditing = (isEditing) => onUpdateDraft({ ...goalDraft, isEditing });
  const updateTitle = (title) => onUpdateDraft({ ...goalDraft, title });
  const updateDate = (targetDate) => onUpdateDraft({ ...goalDraft, targetDate });

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center sketch-card ink-shadow p-4 md:p-6 min-w-[90px] md:min-w-[120px] transition-all hover:-translate-y-1">
      <div className="text-4xl md:text-6xl font-heading font-bold tabular-nums tracking-tighter text-ink dark:text-chalk">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[10px] md:text-xs font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider mt-1">{label}</div>
    </div>
  );

  const showForm = !goal || goalDraft.isEditing;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-slide-up pb-16 w-full">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-heading font-bold text-ink dark:text-chalk tracking-tight">
          {showForm ? 'Define Your Future' : 'Eyes on the Prize'}
        </h2>
        <p className="text-sm font-body text-ink-light dark:text-chalk-dim">Big dreams require consistent focus and clear deadlines.</p>
        <div className="sketch-divider mx-auto w-48 mt-2"></div>
      </div>

      {showForm ? (
        <div className="sketch-card ink-shadow-lg p-8 md:p-10 max-w-2xl mx-auto">
          <form onSubmit={handleStart} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider">Goal Name</label>
                <input
                  type="text"
                  value={goalDraft.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  placeholder="e.g. Final Semester Exams, Launch Day..."
                  className="sketch-input w-full text-xl font-heading font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider">Deadline Date & Time</label>
                <input
                  type="datetime-local"
                  value={goalDraft.targetDate}
                  onChange={(e) => updateDate(e.target.value)}
                  className="sketch-input w-full text-lg font-heading"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="sketch-btn w-full text-xl py-4"
                disabled={!goalDraft.title.trim() || !goalDraft.targetDate}
              >
                Start Countdown →
              </button>
              {goal && (
                <button
                  type="button"
                  onClick={() => onUpdateDraft({ title: goal.title, targetDate: goal.targetDate, isEditing: false })}
                  className="w-full text-ink-light dark:text-chalk-dim font-heading font-bold py-2 hover:text-ink dark:hover:text-chalk transition-colors text-sm"
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Goal Title */}
          <div className="text-center space-y-3">
            <h3 className="text-5xl font-heading font-bold text-accent tracking-tight leading-tight scribble-underline inline-block">
              {goal?.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-ink-light dark:text-chalk-dim">
              <i className="fas fa-calendar-check text-accent text-sm"></i>
              <span className="text-sm font-body">
                {goal?.targetDate
                  ? new Date(goal.targetDate).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'No date set'}
              </span>
            </div>
          </div>

          {/* Countdown or Celebration */}
          {timeRemaining?.isExpired ? (
            <div className="bg-ink dark:bg-chalk rounded-sketch p-12 text-center text-paper dark:text-paper-dark ink-shadow-lg">
              <i className="fas fa-trophy text-6xl mb-4 opacity-60 block"></i>
              <h4 className="text-4xl font-heading font-bold">Goal Reached!</h4>
              <p className="text-lg opacity-80 mt-2 font-body">Amazing work. You crossed the finish line! 🎉</p>
              <button onClick={handleClear} className="mt-6 sketch-btn-outline border-paper dark:border-paper-dark text-paper dark:text-paper-dark hover:bg-paper/10 dark:hover:bg-paper-dark/10 px-6 py-3">
                Reset for New Goal
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 md:gap-5">
              <TimeUnit value={timeRemaining?.days || 0} label="Days" />
              <TimeUnit value={timeRemaining?.hours || 0} label="Hours" />
              <TimeUnit value={timeRemaining?.minutes || 0} label="Minutes" />
              <TimeUnit value={timeRemaining?.seconds || 0} label="Seconds" />
            </div>
          )}

          {/* Edit / Clear buttons */}
          {!timeRemaining?.isExpired && (
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setEditing(true)}
                className="sketch-btn-outline px-6 py-3 text-base flex items-center gap-2"
              >
                <i className="fas fa-edit text-sm"></i>
                Edit Goal
              </button>
              <button
                onClick={handleClear}
                className="sketch-btn-outline px-6 py-3 text-base flex items-center gap-2 hover:!border-accent hover:!text-accent"
              >
                <i className="fas fa-trash-alt text-sm"></i>
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Motivational footer */}
      {!showForm && !timeRemaining?.isExpired && (
        <div className="notebook-page p-6 pl-8 text-center">
          <p className="text-accent font-heading font-bold italic text-lg pl-4">
            "Your limitation—it's only your imagination. Keep pushing towards {goal?.title}!"
          </p>
        </div>
      )}
    </div>
  );
}
