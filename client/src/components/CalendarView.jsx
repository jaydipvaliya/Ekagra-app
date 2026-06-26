import React, { useState, useMemo } from 'react';

export function CalendarView({ tasks, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    const days = [];
    const padding = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < padding; i++) days.push(null);
    for (let i = 1; i <= daysCount; i++) days.push(new Date(year, month, i));
    return days;
  }, [currentMonth]);

  const taskCountByDate = useMemo(() => {
    const counts = {};
    tasks.forEach((task) => {
      if (!counts[task.date]) counts[task.date] = { active: 0, done: 0 };
      if (task.status === 'active') counts[task.date].active++;
      if (task.status === 'done') counts[task.date].done++;
    });
    return counts;
  }, [tasks]);

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const monthYearLabel = currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-heading font-bold text-ink dark:text-chalk">Calendar</h2>
          <p className="text-sm font-body text-ink-light dark:text-chalk-dim mt-1">Plan your weeks and track consistency.</p>
          <div className="sketch-divider mt-2 w-40"></div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button onClick={() => changeMonth(-1)} className="w-9 h-9 rounded-sketch border-2 border-ink-faint dark:border-ink-light/20 text-ink-light dark:text-chalk-dim hover:border-ink dark:hover:border-chalk hover:text-ink dark:hover:text-chalk transition-all flex items-center justify-center">
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <div className="px-4 font-heading font-bold text-xl text-ink dark:text-chalk min-w-[180px] text-center">{monthYearLabel}</div>
          <button onClick={() => changeMonth(1)} className="w-9 h-9 rounded-sketch border-2 border-ink-faint dark:border-ink-light/20 text-ink-light dark:text-chalk-dim hover:border-ink dark:hover:border-chalk hover:text-ink dark:hover:text-chalk transition-all flex items-center justify-center">
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="sketch-card p-5 md:p-8">
        {/* Day Labels */}
        <div className="grid grid-cols-7 mb-3">
          {dayLabels.map((day) => (
            <div key={day} className="text-center text-[10px] font-heading font-bold text-ink-light dark:text-chalk-dim uppercase tracking-wider py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {daysInMonth.map((date, idx) => {
            if (!date) return <div key={`padding-${idx}`} className="aspect-square"></div>;

            const dateStr = date.toISOString().split('T')[0];
            const stats = taskCountByDate[dateStr];
            const isToday = dateStr === todayStr;

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={`group relative aspect-square rounded-sketch border transition-all flex flex-col items-center justify-center p-1 ${
                  isToday
                    ? 'border-2 border-accent bg-accent/5'
                    : 'border border-transparent hover:border-ink-faint dark:hover:border-ink-light/20'
                }`}
              >
                {/* Hand-drawn circle around today */}
                {isToday && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-accent" />
                  </svg>
                )}

                <span className={`text-sm font-heading font-bold relative z-10 ${isToday ? 'text-accent' : 'text-ink dark:text-chalk'}`}>
                  {date.getDate()}
                </span>

                {stats && (
                  <div className="mt-1 flex gap-1 relative z-10">
                    {stats.active > 0 && <span className="w-1.5 h-1.5 rounded-full bg-ink dark:bg-chalk opacity-40"></span>}
                    {stats.done > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>}
                  </div>
                )}

                {/* Tooltip */}
                {stats && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink dark:bg-chalk text-paper dark:text-paper-dark text-[10px] font-body px-2 py-1 rounded-sketch opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                    {stats.active} active, {stats.done} done
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
