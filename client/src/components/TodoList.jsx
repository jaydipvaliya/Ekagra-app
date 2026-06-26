import React, { useState, useMemo } from 'react';

const STATUS = { ACTIVE: 'active', DONE: 'done', CANCELLED: 'cancelled' };

export function TodoList({ tasks, onAddTask, onUpdateStatus, onDeleteTask, onClearAll, activeTaskId, setActiveTaskId }) {
  const [inputText, setInputText] = useState('');
  const [inputEst, setInputEst] = useState(1);
  const [importance, setImportance] = useState(false);
  const [urgency, setUrgency] = useState(false);
  const [filter, setFilter] = useState('all');

  const stats = useMemo(
    () => ({
      total: tasks.length,
      active: tasks.filter((t) => t.status === STATUS.ACTIVE).length,
      done: tasks.filter((t) => t.status === STATUS.DONE).length,
      cancelled: tasks.filter((t) => t.status === STATUS.CANCELLED).length,
    }),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddTask(inputText, inputEst, importance, urgency);
    setInputText('');
    setInputEst(1);
    setImportance(false);
    setUrgency(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Done', value: stats.done },
          { label: 'Shelved', value: stats.cancelled },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="text-2xl font-heading font-bold text-ink dark:text-chalk leading-none">{stat.value}</div>
            <div className="text-[10px] font-body text-ink-light dark:text-chalk-dim uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add Task */}
      <div className="sketch-card p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 border-b border-ink-faint/50 dark:border-ink-light/15 pb-1">
              <i className="fas fa-pencil text-ink-faint dark:text-chalk-dim text-xs opacity-50"></i>
              <input
                id="todo-input"
                type="text"
                placeholder="What must be done?"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-ink dark:text-chalk font-body placeholder:text-ink-faint dark:placeholder:text-chalk-dim placeholder:italic"
              />
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex items-center gap-1.5 border-b border-ink-faint/50 dark:border-ink-light/15 pb-1">
                <i className="fas fa-hourglass-half text-ink-faint dark:text-chalk-dim text-[9px] opacity-50"></i>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={inputEst}
                  onChange={(e) => setInputEst(parseInt(e.target.value) || 1)}
                  className="bg-transparent border-none outline-none w-10 text-center font-heading font-bold text-ink dark:text-chalk text-lg"
                  title="Estimated Pomodoros"
                />
              </div>
              <button id="todo-add-btn" type="submit" className="sketch-btn px-5 py-2 text-base">
                Add
              </button>
            </div>
          </div>

          {/* Priority Tags */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-heading text-ink-light dark:text-chalk-dim uppercase tracking-wider">Priority:</span>
            <button
              type="button"
              onClick={() => setImportance(!importance)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-bold border rounded-sketch-md transition-all ${
                importance
                  ? 'border-accent-muted text-accent-muted bg-accent-muted/8'
                  : 'border-ink-ghost dark:border-ink-light/15 text-ink-light dark:text-chalk-dim hover:border-accent-muted hover:text-accent-muted'
              }`}
            >
              <i className="fas fa-circle-dot text-[9px]"></i>
              Important
            </button>
            <button
              type="button"
              onClick={() => setUrgency(!urgency)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-bold border rounded-sketch-md transition-all ${
                urgency
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-ink-ghost dark:border-ink-light/15 text-ink-light dark:text-chalk-dim hover:border-accent hover:text-accent'
              }`}
            >
              <i className="fas fa-bolt-lightning text-[9px]"></i>
              Urgent
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-0 border-b border-ink-faint/50 dark:border-ink-light/15">
          {['all', STATUS.ACTIVE, STATUS.DONE, STATUS.CANCELLED].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider transition-all relative ${
                filter === f
                  ? 'text-ink dark:text-chalk'
                  : 'text-ink-light dark:text-chalk-dim hover:text-ink dark:hover:text-chalk'
              }`}
            >
              {f}
              {filter === f && <span className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-ink dark:bg-chalk rounded-full"></span>}
            </button>
          ))}
        </div>
        <button
          onClick={onClearAll}
          className="text-ink-light dark:text-chalk-dim hover:text-accent text-xs font-heading uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          <i className="fas fa-eraser text-[10px]"></i>
          Purge
        </button>
      </div>

      {/* Task List */}
      <div>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-14 border border-ink-ghost/50 dark:border-ink-light/10 rounded-sketch">
            <i className="fas fa-peace text-3xl text-ink-faint dark:text-chalk-dim opacity-15 mb-3 block"></i>
            <p className="font-heading text-sm text-ink-light dark:text-chalk-dim uppercase tracking-wider">Zero Point Focus Achieved</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isActive = activeTaskId === task.id;
            const isDone = task.status === STATUS.DONE;
            const isCancelled = task.status === STATUS.CANCELLED;

            return (
              <div
                key={task.id}
                onClick={() => task.status === STATUS.ACTIVE && setActiveTaskId(task.id)}
                className={`group flex items-center justify-between py-3.5 px-3 border-b border-ink-ghost/40 dark:border-ink-light/8 transition-all cursor-pointer ${
                  isActive ? 'bg-accent/[0.04] border-l-[3px] border-l-accent pl-4' : 'hover:bg-ink/[0.015] dark:hover:bg-chalk/[0.015]'
                } ${isDone || isCancelled ? 'opacity-35' : ''}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(task.id, isDone ? STATUS.ACTIVE : STATUS.DONE);
                    }}
                    className={`sketch-checkbox ${isDone ? 'checked' : ''}`}
                  ></button>

                  <div className="min-w-0">
                    <h3
                      className={`font-heading font-bold text-base leading-tight truncate ${
                        isDone ? 'line-through text-ink-light dark:text-chalk-dim' : 'text-ink dark:text-chalk'
                      }`}
                    >
                      {task.text}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-body text-ink-light dark:text-chalk-dim tracking-wider">
                        {task.completedPomodoros}/{task.estPomodoros} sessions
                      </span>
                      {task.importance && (
                        <span className="text-[10px] font-heading text-accent-muted flex items-center gap-0.5">
                          ● imp
                        </span>
                      )}
                      {task.urgency && (
                        <span className="text-[10px] font-heading text-accent flex items-center gap-0.5">
                          ⚡ urg
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {task.status === STATUS.ACTIVE && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(task.id, STATUS.CANCELLED); }}
                      className="w-7 h-7 flex items-center justify-center text-ink-light hover:text-accent-muted transition-colors"
                      title="Shelve"
                    >
                      <i className="fas fa-ban text-[11px]"></i>
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                    className="w-7 h-7 flex items-center justify-center text-ink-light hover:text-accent transition-colors"
                    title="Delete"
                  >
                    <i className="fas fa-trash-alt text-[11px]"></i>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
