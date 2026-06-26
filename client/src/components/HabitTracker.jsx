import React, { useState, useMemo } from 'react';

export function HabitTracker({ habits, onAddHabit, onToggleHabit, onDeleteHabit }) {
  const [newHabitName, setNewHabitName] = useState('');

  const weekDates = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayLabelsFull = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName);
    setNewHabitName('');
  };

  return (
    <div className="space-y-6 animate-slide-up w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-heading font-bold text-ink dark:text-chalk">Habit Tracker</h2>
          <p className="text-sm font-body text-ink-light dark:text-chalk-dim mt-1">Small wins every day lead to big results.</p>
          <div className="sketch-divider mt-2 w-40"></div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <input
            type="text"
            placeholder="New habit..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="sketch-input w-36 text-sm"
          />
          <button type="submit" className="sketch-btn text-sm px-4 py-1.5">Add</button>
        </form>
      </div>

      {/* ─── Mobile Layout: Card-based ─── */}
      <div className="md:hidden space-y-3">
        {habits.length === 0 ? (
          <div className="sketch-card p-10 text-center">
            <i className="fas fa-seedling text-2xl text-ink-faint dark:text-chalk-dim opacity-20 mb-2 block"></i>
            <p className="text-ink-light dark:text-chalk-dim font-body text-sm">No habits yet. Add one above!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const weeklyCompletions = weekDates.filter((date) => habit.completions[date]).length;
            const pct = Math.round((weeklyCompletions / 7) * 100);

            return (
              <div key={habit.id} className="sketch-card p-4 space-y-3">
                {/* Habit name + delete + score */}
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-ink dark:text-chalk text-base truncate flex-1 mr-2">{habit.name}</h3>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-sm font-heading font-bold ${pct > 70 ? 'text-accent' : 'text-ink-light dark:text-chalk-dim'}`}>
                      {pct}%
                    </span>
                    <button onClick={() => onDeleteHabit(habit.id)} className="text-ink-light hover:text-accent transition-colors">
                      <i className="fas fa-trash-alt text-[10px]"></i>
                    </button>
                  </div>
                </div>

                {/* Week row — 7 circles fitting full width */}
                <div className="flex items-center justify-between gap-1">
                  {weekDates.map((date, idx) => {
                    const completed = habit.completions[date];
                    return (
                      <div key={date} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-[9px] font-heading text-ink-light dark:text-chalk-dim uppercase">{dayLabels[idx]}</span>
                        <button
                          onClick={() => onToggleHabit(habit.id, date)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all text-[11px] ${
                            completed
                              ? 'border-accent bg-accent/10 text-accent font-heading font-bold'
                              : 'border-ink-ghost dark:border-ink-light/15 text-transparent hover:border-ink-light'
                          }`}
                        >
                          {completed ? '✓' : ''}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-ink-ghost/30 dark:bg-ink-light/10 rounded-full overflow-hidden">
                  <div className="h-full bg-ink dark:bg-chalk transition-all duration-500" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── Desktop Layout: Table grid ─── */}
      <div className="hidden md:block sketch-card overflow-x-auto">
        {/* Header Row */}
        <div className="grid grid-cols-[1fr_repeat(7,48px)_72px] border-b border-ink-faint/50 dark:border-ink-light/15">
          <div className="p-4 text-[10px] font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider">Habit</div>
          {dayLabelsFull.map((day, idx) => (
            <div key={day} className="flex flex-col items-center justify-center p-2">
              <span className="text-[9px] font-heading text-ink-light dark:text-chalk-dim uppercase">{day}</span>
              <span className="text-[11px] font-heading font-bold text-ink dark:text-chalk mt-0.5">{weekDates[idx].split('-')[2]}</span>
            </div>
          ))}
          <div className="flex items-center justify-center p-2 text-[9px] font-heading text-ink-light dark:text-chalk-dim uppercase">Score</div>
        </div>

        {/* Habit Rows */}
        <div className="divide-y divide-ink-ghost/30 dark:divide-ink-light/8">
          {habits.length === 0 ? (
            <div className="p-14 text-center">
              <i className="fas fa-seedling text-2xl text-ink-faint dark:text-chalk-dim opacity-20 mb-2 block"></i>
              <p className="text-ink-light dark:text-chalk-dim font-body text-sm">No habits yet. Add one above!</p>
            </div>
          ) : (
            habits.map((habit) => {
              const weeklyCompletions = weekDates.filter((date) => habit.completions[date]).length;
              const pct = Math.round((weeklyCompletions / 7) * 100);
              return (
                <div key={habit.id} className="grid grid-cols-[1fr_repeat(7,48px)_72px] items-center group hover:bg-ink/[0.015] dark:hover:bg-chalk/[0.015] transition-colors">
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-heading font-bold text-ink dark:text-chalk text-[15px]">{habit.name}</span>
                    <button onClick={() => onDeleteHabit(habit.id)} className="opacity-0 group-hover:opacity-100 p-1 text-ink-light hover:text-accent transition-all">
                      <i className="fas fa-trash-alt text-[10px]"></i>
                    </button>
                  </div>
                  {weekDates.map((date) => (
                    <div key={date} className="flex items-center justify-center p-1.5">
                      <button
                        onClick={() => onToggleHabit(habit.id, date)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all text-[11px] ${
                          habit.completions[date]
                            ? 'border-accent bg-accent/10 text-accent font-heading font-bold'
                            : 'border-ink-ghost dark:border-ink-light/15 text-transparent hover:border-ink-light'
                        }`}
                      >
                        {habit.completions[date] ? '✓' : ''}
                      </button>
                    </div>
                  ))}
                  <div className="flex flex-col items-center justify-center p-2">
                    <div className={`text-sm font-heading font-bold ${pct > 70 ? 'text-accent' : 'text-ink-light dark:text-chalk-dim'}`}>{pct}%</div>
                    <div className="w-8 h-1 bg-ink-ghost/30 dark:bg-ink-light/10 rounded-full mt-0.5 overflow-hidden">
                      <div className="h-full bg-ink dark:bg-chalk transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Inspiration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="notebook-page p-4 pl-7">
          <i className="fas fa-fire text-accent opacity-40 mb-2 block"></i>
          <p className="text-base font-heading font-bold text-ink dark:text-chalk">Keep the Streak</p>
          <p className="text-[11px] mt-1 text-ink-light dark:text-chalk-dim font-body">~66 days to form a habit.</p>
        </div>
        <div className="notebook-page p-4 pl-7">
          <i className="fas fa-chart-line text-accent-muted opacity-40 mb-2 block"></i>
          <p className="text-base font-heading font-bold text-ink dark:text-chalk">Daily Progress</p>
          <p className="text-[11px] mt-1 text-ink-light dark:text-chalk-dim font-body">1% better every day.</p>
        </div>
        <div className="sketch-card p-4">
          <i className="fas fa-quote-left text-ink-faint dark:text-chalk-dim opacity-15 mb-2 block"></i>
          <p className="text-[15px] font-heading font-bold text-ink dark:text-chalk leading-snug italic">
            "Excellence is not an act, but a habit."
          </p>
          <p className="text-[10px] font-body text-ink-light dark:text-chalk-dim mt-1">— Aristotle</p>
        </div>
      </div>
    </div>
  );
}
