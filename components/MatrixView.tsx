
import React from 'react';
import { Task, TaskStatus } from '../types';

interface MatrixViewProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({ tasks, onUpdateStatus, onDeleteTask }) => {
  const activeTasks = tasks.filter(t => t.status === TaskStatus.ACTIVE);

  const quadrants = [
    {
      title: 'Do First',
      subtitle: 'Urgent & Important',
      importance: true,
      urgency: true,
      color: 'bg-rose-50',
      borderColor: 'border-rose-200',
      icon: 'fa-fire-flame-curved',
      iconColor: 'text-rose-500'
    },
    {
      title: 'Schedule',
      subtitle: 'Important, Not Urgent',
      importance: true,
      urgency: false,
      color: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      icon: 'fa-calendar-check',
      iconColor: 'text-indigo-500'
    },
    {
      title: 'Delegate',
      subtitle: 'Urgent, Not Important',
      importance: false,
      urgency: true,
      color: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: 'fa-user-group',
      iconColor: 'text-amber-500'
    },
    {
      title: 'Eliminate',
      subtitle: 'Not Urgent & Not Important',
      importance: false,
      urgency: false,
      color: 'bg-slate-50',
      borderColor: 'border-slate-200',
      icon: 'fa-trash-can',
      iconColor: 'text-slate-400'
    },
  ];

  const getQuadrantTasks = (importance: boolean, urgency: boolean) => {
    return activeTasks.filter(t => t.importance === importance && t.urgency === urgency);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-800">Eisenhower Matrix</h2>
        <p className="text-slate-500 font-medium">Prioritize tasks based on their importance and urgency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        {quadrants.map((quad) => {
          const quadTasks = getQuadrantTasks(quad.importance, quad.urgency);
          
          return (
            <div 
              key={quad.title} 
              className={`flex flex-col rounded-[2.5rem] border-2 ${quad.borderColor} ${quad.color} overflow-hidden shadow-sm transition-all hover:shadow-md`}
            >
              <div className="p-6 flex items-center justify-between border-b border-white/50">
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{quad.title}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{quad.subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${quad.iconColor}`}>
                  <i className={`fas ${quad.icon} text-xl`}></i>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                {quadTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <i className={`fas ${quad.icon} text-4xl mb-4`}></i>
                    <p className="text-sm font-bold uppercase tracking-wider">Empty quadrant</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quadTasks.map((task) => (
                      <div 
                        key={task.id}
                        className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm group transition-all hover:scale-[1.01]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-700 leading-tight">{task.text}</h4>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                                    <i className="fas fa-clock"></i>
                                    {task.completedPomodoros}/{task.estPomodoros}
                                </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => onUpdateStatus(task.id, TaskStatus.DONE)}
                              className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              <i className="fas fa-check text-xs"></i>
                            </button>
                            <button 
                              onClick={() => onDeleteTask(task.id)}
                              className="w-8 h-8 rounded-xl bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-white/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                {quadTasks.length} Tasks active
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
