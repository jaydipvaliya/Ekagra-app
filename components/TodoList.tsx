
import React, { useState, useMemo } from 'react';
import { Task, TaskStatus } from '../types';

interface TodoListProps {
  tasks: Task[];
  onAddTask: (text: string, est: number, importance: boolean, urgency: boolean) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  onClearAll: () => void;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ 
  tasks, onAddTask, onUpdateStatus, onDeleteTask, onClearAll, activeTaskId, setActiveTaskId 
}) => {
  const [inputText, setInputText] = useState('');
  const [inputEst, setInputEst] = useState(1);
  const [importance, setImportance] = useState(false);
  const [urgency, setUrgency] = useState(false);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter(t => t.status === TaskStatus.ACTIVE).length,
    done: tasks.filter(t => t.status === TaskStatus.DONE).length,
    cancelled: tasks.filter(t => t.status === TaskStatus.CANCELLED).length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(t => t.status === filter);
  }, [tasks, filter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddTask(inputText, inputEst, importance, urgency);
    setInputText('');
    setInputEst(1);
    setImportance(false);
    setUrgency(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-600', bg: 'bg-white' },
          { label: 'Active', value: stats.active, color: 'text-indigo-700', bg: 'bg-white' },
          { label: 'Done', value: stats.done, color: 'text-emerald-600', bg: 'bg-white' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-rose-600', bg: 'bg-white' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} p-5 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md`}>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add Task Form */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100 focus-within:border-indigo-300 focus-within:bg-white transition-all shadow-inner">
              <i className="fas fa-feather-pointed text-slate-300 mr-4"></i>
              <input 
                type="text" 
                placeholder="What must be done?" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-slate-700 font-semibold placeholder:text-slate-300"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center bg-slate-50 rounded-2xl px-5 py-4 border border-slate-100 w-32 shadow-inner">
                <i className="fas fa-hourglass-half text-slate-300 mr-3 text-xs"></i>
                <input 
                  type="number" 
                  min="1" 
                  max="99"
                  value={inputEst}
                  onChange={(e) => setInputEst(parseInt(e.target.value) || 1)}
                  className="bg-transparent border-none outline-none w-full text-slate-700 font-black"
                  title="Estimated Pomodoros"
                />
              </div>
              <button 
                type="submit"
                className="bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-800 hover:-translate-y-1 transition-all active:scale-95"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">Sanctity Level:</span>
            <button 
              type="button"
              onClick={() => setImportance(!importance)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
                importance 
                  ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-amber-100 hover:text-amber-500'
              }`}
            >
              <i className={`fas fa-circle-dot ${importance ? 'animate-pulse' : ''}`}></i>
              Important
            </button>
            <button 
              type="button"
              onClick={() => setUrgency(!urgency)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
                urgency 
                  ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-rose-100 hover:text-rose-500'
              }`}
            >
              <i className={`fas fa-bolt-lightning ${urgency ? 'animate-bounce' : ''}`}></i>
              Urgent
            </button>
          </div>
        </form>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between px-2">
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[1.5rem]">
          {(['all', TaskStatus.ACTIVE, TaskStatus.DONE, TaskStatus.CANCELLED] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button 
          onClick={onClearAll}
          className="text-slate-300 hover:text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-rose-50"
        >
          <i className="fas fa-leaf"></i>
          Purge List
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-24 text-slate-300 bg-white rounded-[3rem] border border-slate-100">
            <div className="mb-4 opacity-10">
              <i className="fas fa-peace text-6xl"></i>
            </div>
            <p className="font-black text-xs uppercase tracking-[0.4em]">Zero Point Focus Achieved</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            let accentBorder = 'border-slate-100';
            let accentBg = 'bg-white';
            if (task.importance && task.urgency) {
              accentBorder = 'border-rose-200 ring-rose-500/5';
              accentBg = 'bg-rose-50/20';
            } else if (task.importance) {
              accentBorder = 'border-amber-200 ring-amber-500/5';
              accentBg = 'bg-amber-50/20';
            } else if (task.urgency) {
              accentBorder = 'border-indigo-200 ring-indigo-500/5';
              accentBg = 'bg-indigo-50/20';
            }

            return (
              <div 
                key={task.id}
                onClick={() => task.status === TaskStatus.ACTIVE && setActiveTaskId(task.id)}
                className={`group flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer ${
                  activeTaskId === task.id 
                    ? 'bg-white border-indigo-700 shadow-2xl ring-8 ring-indigo-50 scale-[1.01]' 
                    : `${accentBg} ${accentBorder} hover:border-slate-300 hover:shadow-xl`
                } ${task.status !== TaskStatus.ACTIVE ? 'opacity-40 grayscale-[0.5]' : ''}`}
              >
                <div className="flex items-center gap-6 min-w-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(task.id, task.status === TaskStatus.DONE ? TaskStatus.ACTIVE : TaskStatus.DONE);
                    }}
                    className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      task.status === TaskStatus.DONE 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-100' 
                        : 'border-slate-200 hover:border-indigo-400 bg-white text-transparent'
                    }`}
                  >
                    <i className="fas fa-check text-xs"></i>
                  </button>
                  <div className="min-w-0">
                    <h3 className={`font-black text-lg leading-tight truncate ${
                      task.status === TaskStatus.DONE ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                      {task.text}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                        <i className="fas fa-hourglass-start text-[8px]"></i>
                        {task.completedPomodoros}/{task.estPomodoros} Sessions
                      </span>
                      
                      {task.importance && (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                          <i className="fas fa-circle-dot"></i>
                          Important
                        </span>
                      )}
                      {task.urgency && (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-700 bg-rose-100 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                          <i className="fas fa-bolt-lightning"></i>
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                  {task.status === TaskStatus.ACTIVE && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(task.id, TaskStatus.CANCELLED); }}
                      className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-2xl transition-all"
                      title="Shelve Task"
                    >
                      <i className="fas fa-ban"></i>
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                    className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    title="Delete Permanently"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
