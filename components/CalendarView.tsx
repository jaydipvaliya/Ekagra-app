
import React, { useState, useMemo } from 'react';
import { Task, TaskStatus } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onDateSelect: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Adjust for Monday start (0=Sun, 1=Mon, ...)
    // If firstDay is 0 (Sun), we need 6 padding days. If 1 (Mon), 0 padding.
    const padding = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < padding; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysCount; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [currentMonth]);

  const taskCountByDate = useMemo(() => {
    const counts: Record<string, { active: number, done: number }> = {};
    tasks.forEach(task => {
      if (!counts[task.date]) counts[task.date] = { active: 0, done: 0 };
      if (task.status === TaskStatus.ACTIVE) counts[task.date].active++;
      if (task.status === TaskStatus.DONE) counts[task.date].done++;
    });
    return counts;
  }, [tasks]);

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(newMonth);
  };

  const monthYearLabel = currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Calendar</h2>
          <p className="text-slate-500 font-medium">Plan your weeks and track your consistency.</p>
        </div>
        
        <div className="flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-500"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="px-6 font-black text-slate-700 min-w-[160px] text-center">
            {monthYearLabel}
          </div>
          <button 
            onClick={() => changeMonth(1)}
            className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-500"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
        <div className="grid grid-cols-7 mb-4">
          {dayLabels.map(day => (
            <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {daysInMonth.map((date, idx) => {
            if (!date) return <div key={`padding-${idx}`} className="aspect-square"></div>;
            
            const dateStr = date.toISOString().split('T')[0];
            const stats = taskCountByDate[dateStr];
            const isToday = dateStr === todayStr;

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={`group relative aspect-square rounded-3xl border transition-all flex flex-col items-center justify-center p-2 ${
                  isToday 
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-100 ring-2 ring-indigo-500 ring-offset-2' 
                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <span className={`text-sm font-black ${isToday ? 'text-indigo-600' : 'text-slate-600'}`}>
                  {date.getDate()}
                </span>
                
                {stats && (
                  <div className="mt-2 flex gap-1">
                    {stats.active > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    )}
                    {stats.done > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                  </div>
                )}

                {/* Hover info */}
                {stats && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                    {stats.active} Active, {stats.done} Done
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
             <i className="fas fa-calendar-check text-xl"></i>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Productivity Streak</h4>
            <p className="text-sm text-slate-500">You've completed tasks for 5 consecutive days!</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
             <i className="fas fa-bullseye text-xl"></i>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Monthly Target</h4>
            <p className="text-sm text-slate-500">You are at 65% of your monthly task goal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
