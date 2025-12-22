
import React, { useState, useMemo } from 'react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onAddHabit: (name: string) => void;
  onToggleHabit: (habitId: string, date: string) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ 
  habits, onAddHabit, onToggleHabit, onDeleteHabit 
}) => {
  const [newHabitName, setNewHabitName] = useState('');

  const weekDates = useMemo(() => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    const monday = new Date(today.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName);
    setNewHabitName('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Habit Tracker</h2>
          <p className="text-slate-500 font-medium">Small wins every day lead to big results.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <input 
            type="text" 
            placeholder="New habit..." 
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="px-4 py-2 outline-none w-full md:w-48 text-slate-700 bg-transparent"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors shrink-0"
          >
            Add Habit
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_repeat(7,48px)_80px] border-b border-slate-100 bg-slate-50/50">
          <div className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Habit Name</div>
          {dayLabels.map((day, idx) => (
            <div key={day} className="flex flex-col items-center justify-center p-4">
              <span className="text-[10px] font-black text-slate-400 uppercase">{day}</span>
              <span className="text-xs font-bold text-slate-600 mt-1">{weekDates[idx].split('-')[2]}</span>
            </div>
          ))}
          <div className="flex items-center justify-center p-4 text-[10px] font-black text-slate-400 uppercase">Score</div>
        </div>

        {/* Habits List */}
        <div className="divide-y divide-slate-100">
          {habits.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                <i className="fas fa-seedling text-2xl"></i>
              </div>
              <p className="text-slate-400 font-medium">No habits tracking yet. Add one above to start!</p>
            </div>
          ) : (
            habits.map((habit) => {
              const weeklyCompletions = weekDates.filter(date => habit.completions[date]).length;
              const percentage = Math.round((weeklyCompletions / 7) * 100);

              return (
                <div key={habit.id} className="grid grid-cols-[1fr_repeat(7,48px)_80px] items-center group hover:bg-slate-50 transition-colors">
                  <div className="p-6 flex items-center justify-between">
                    <span className="font-bold text-slate-700">{habit.name}</span>
                    <button 
                      onClick={() => onDeleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>

                  {weekDates.map((date) => (
                    <div key={date} className="flex items-center justify-center p-2">
                      <button 
                        onClick={() => onToggleHabit(habit.id, date)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 ${
                          habit.completions[date] 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' 
                            : 'border-slate-200 hover:border-emerald-300 text-transparent'
                        }`}
                      >
                        <i className="fas fa-check text-[10px]"></i>
                      </button>
                    </div>
                  ))}

                  <div className="flex flex-col items-center justify-center p-4">
                    <div className={`text-sm font-black ${percentage > 70 ? 'text-emerald-600' : percentage > 30 ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {percentage}%
                    </div>
                    <div className="w-10 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${percentage > 70 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
          <i className="fas fa-fire text-2xl mb-4 opacity-50"></i>
          <h4 className="text-sm font-bold opacity-80 uppercase tracking-widest">Consistency</h4>
          <p className="text-2xl font-black mt-1">Keep the Streak</p>
          <p className="text-xs mt-2 opacity-70">Research shows it takes 66 days on average to form a new habit.</p>
        </div>
        <div className="bg-emerald-500 p-6 rounded-3xl text-white shadow-xl shadow-emerald-100">
          <i className="fas fa-chart-line text-2xl mb-4 opacity-50"></i>
          <h4 className="text-sm font-bold opacity-80 uppercase tracking-widest">Growth</h4>
          <p className="text-2xl font-black mt-1">Daily Progress</p>
          <p className="text-xs mt-2 opacity-70">Focus on just 1% improvement every single day.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <i className="fas fa-quote-left text-2xl mb-4 text-slate-200"></i>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Motivation</h4>
          <p className="text-lg font-bold text-slate-700 leading-tight">"We are what we repeatedly do. Excellence, then, is not an act, but a habit."</p>
        </div>
      </div>
    </div>
  );
};
