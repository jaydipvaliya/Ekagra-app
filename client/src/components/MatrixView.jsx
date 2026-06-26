import React from 'react';

const QUADRANTS = [
  { title: 'Do First', subtitle: 'Urgent & Important', importance: true, urgency: true, icon: 'fa-fire-flame-curved', marker: '!!' },
  { title: 'Schedule', subtitle: 'Important, Not Urgent', importance: true, urgency: false, icon: 'fa-calendar-check', marker: '→' },
  { title: 'Delegate', subtitle: 'Urgent, Not Important', importance: false, urgency: true, icon: 'fa-user-group', marker: '↗' },
  { title: 'Eliminate', subtitle: 'Not Urgent & Not Important', importance: false, urgency: false, icon: 'fa-trash-can', marker: '×' },
];

export function MatrixView({ tasks, onUpdateStatus, onDeleteTask }) {
  const activeTasks = tasks.filter((t) => t.status === 'active');
  const getQuadrantTasks = (imp, urg) => activeTasks.filter((t) => t.importance === imp && t.urgency === urg);

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <div>
        <h2 className="text-4xl font-heading font-bold text-ink dark:text-chalk">Eisenhower Matrix</h2>
        <p className="text-sm font-body text-ink-light dark:text-chalk-dim mt-1">Prioritize by importance and urgency.</p>
        <div className="sketch-divider mt-2 w-52"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[560px]">
        {QUADRANTS.map((quad, idx) => {
          const qTasks = getQuadrantTasks(quad.importance, quad.urgency);
          return (
            <div
              key={quad.title}
              className={`flex flex-col p-5 ${
                idx === 0 ? 'border-b lg:border-r lg:border-b' :
                idx === 1 ? 'border-b lg:border-b' :
                idx === 2 ? 'lg:border-r' : ''
              } border-ink-faint/50 dark:border-ink-light/12`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl font-heading font-bold text-ink dark:text-chalk flex items-center gap-2">
                    <span className="text-accent text-sm font-heading">{quad.marker}</span>
                    {quad.title}
                  </h3>
                  <p className="text-[10px] font-body text-ink-light dark:text-chalk-dim tracking-wider">{quad.subtitle}</p>
                </div>
                <i className={`fas ${quad.icon} text-ink-faint dark:text-chalk-dim opacity-15`}></i>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                {qTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-15 py-6">
                    <i className={`fas ${quad.icon} text-2xl mb-1.5 text-ink dark:text-chalk`}></i>
                    <p className="text-[10px] font-heading uppercase tracking-wider text-ink dark:text-chalk">Empty</p>
                  </div>
                ) : (
                  qTasks.map((task) => (
                    <div key={task.id} className="sketch-card p-3 group transition-all hover:ink-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-heading font-bold text-ink dark:text-chalk leading-tight">{task.text}</h4>
                          <span className="text-[10px] font-body text-ink-light dark:text-chalk-dim mt-0.5 inline-block">
                            {task.completedPomodoros}/{task.estPomodoros} sessions
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => onUpdateStatus(task.id, 'done')} className="w-6 h-6 rounded-full border border-ink-faint text-ink-light flex items-center justify-center hover:border-accent hover:text-accent transition-all text-[9px]">
                            <i className="fas fa-check"></i>
                          </button>
                          <button onClick={() => onDeleteTask(task.id)} className="w-6 h-6 rounded-full border border-ink-faint text-ink-light flex items-center justify-center hover:border-accent hover:text-accent transition-all text-[9px]">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-ink-ghost/30 dark:border-ink-light/8 text-[10px] font-heading text-ink-light dark:text-chalk-dim tracking-wider text-center">
                {qTasks.length} task{qTasks.length !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
