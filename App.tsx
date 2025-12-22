
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TodoList } from './components/TodoList';
import { Timer } from './components/Timer';
import { HabitTracker } from './components/HabitTracker';
import { MatrixView } from './components/MatrixView';
import { CalendarView } from './components/CalendarView';
import { Motivation } from './components/Motivation';
import { GoalCountdown } from './components/GoalCountdown';
import { Ambience } from './components/Ambience';
import { SettingsModal } from './components/SettingsModal';
import { Task, TaskStatus, Settings, Habit, Goal, GoalDraft, AmbienceSoundState } from './types';
import { DEFAULT_SETTINGS, STORAGE_KEY } from './constants';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [currentRound, setCurrentRound] = useState(1);
  const [motivationIntention, setMotivationIntention] = useState('');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [goalDraft, setGoalDraft] = useState<GoalDraft>({ title: '', targetDate: '', isEditing: true });
  const [ambienceState, setAmbienceState] = useState<AmbienceSoundState[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Day Planner');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sync Theme with DOM
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Load initial state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks((parsed.tasks || []).map((t: any) => ({
          ...t,
          date: t.date || new Date(t.createdAt).toISOString().split('T')[0]
        })));
        setHabits(parsed.habits || []);
        setActiveTaskId(parsed.activeTaskId || null);
        setSettings(prev => ({ ...prev, ...parsed.settings }));
        setCurrentRound(parsed.currentRound || 1);
        setMotivationIntention(parsed.motivationIntention || '');
        setGoal(parsed.goal || null);
        setAmbienceState(parsed.ambience || []);
        if (parsed.goalDraft) setGoalDraft(parsed.goalDraft);
      } catch (e) {
        console.error("Failed to restore state", e);
      }
    }
  }, []);

  // Persist state
  useEffect(() => {
    const state = { tasks, habits, activeTaskId, settings, currentRound, motivationIntention, goal, goalDraft, ambience: ambienceState };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [tasks, habits, activeTaskId, settings, currentRound, motivationIntention, goal, goalDraft, ambienceState]);

  const playEffect = useCallback((type: 'success' | 'cancel') => {
    if (!settings.soundEnabled) return;
    const audio = new Audio(
      type === 'success' 
        ? 'https://actions.google.com/sounds/v1/ui/button_click.ogg' 
        : 'https://actions.google.com/sounds/v1/ui/click_on.ogg'
    );
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, [settings.soundEnabled]);

  const addTask = (text: string, est: number, importance = false, urgency = false) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      estPomodoros: est,
      completedPomodoros: 0,
      status: TaskStatus.ACTIVE,
      createdAt: Date.now(),
      importance,
      urgency,
      date: selectedDate
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (status === TaskStatus.DONE && t.status !== TaskStatus.DONE) playEffect('success');
        return { ...t, status };
      }
      return t;
    }));
  };

  const clearAllTasks = () => {
    if (confirm("Purge all consciousness records? This is irreversible.")) {
      setTasks([]);
      setActiveTaskId(null);
    }
  };

  const renderContent = () => {
    const dailyTasks = tasks.filter(t => t.date === selectedDate);

    switch (activeTab) {
      case 'Day Planner':
        return (
          <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex-1 min-w-0">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 tracking-tight">
                    <i className="fas fa-sun text-saffron"></i>
                    Daily Journey
                  </h2>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5">
                    {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <TodoList 
                tasks={dailyTasks} 
                onAddTask={addTask} 
                onUpdateStatus={updateTaskStatus}
                onDeleteTask={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
                onClearAll={clearAllTasks}
                activeTaskId={activeTaskId}
                setActiveTaskId={setActiveTaskId}
              />
            </div>
            <div className="w-full lg:w-[400px] flex-shrink-0">
              <Timer 
                settings={settings}
                currentRound={currentRound}
                onRoundComplete={() => setCurrentRound(r => r + 1)}
                activeTask={tasks.find(t => t.id === activeTaskId) || null}
                onTaskPomodoroComplete={(id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t))}
              />
            </div>
          </div>
        );
      case 'Habit Tracker': return <HabitTracker habits={habits} onAddHabit={(name) => setHabits(prev => [...prev, { id: crypto.randomUUID(), name, completions: {}, createdAt: Date.now() }])} onToggleHabit={(id, date) => {
        setHabits(prev => prev.map(h => {
          if (h.id === id) {
            const comps = { ...h.completions };
            if (comps[date]) delete comps[date]; else { comps[date] = true; playEffect('success'); }
            return { ...h, completions: comps };
          }
          return h;
        }))
      }} onDeleteHabit={(id) => setHabits(prev => prev.filter(h => h.id !== id))} />;
      case 'Matrix View': return <MatrixView tasks={dailyTasks} onUpdateStatus={updateTaskStatus} onDeleteTask={(id) => setTasks(prev => prev.filter(t => t.id !== id))} />;
      case 'Calendar View': return <CalendarView tasks={tasks} onDateSelect={(date) => { setSelectedDate(date); setActiveTab('Day Planner'); }} />;
      case 'Motivation': return <Motivation intention={motivationIntention} onIntentionChange={setMotivationIntention} tasks={tasks} habits={habits} />;
      case 'Goal Countdown': return <GoalCountdown goal={goal} onSetGoal={setGoal} goalDraft={goalDraft} onUpdateDraft={setGoalDraft} />;
      case 'Ambience': return <Ambience initialState={ambienceState} onStateChange={setAmbienceState} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 transition-colors">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />
      
      <main className="flex-1 flex p-6 md:p-10 lg:p-14 overflow-y-auto custom-scrollbar pb-24 md:pb-10">
        {renderContent()}
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings} 
          onSave={setSettings} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
