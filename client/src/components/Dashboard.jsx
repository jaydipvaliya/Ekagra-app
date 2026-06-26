import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api.js';
import { Sidebar } from './Sidebar.jsx';
import { TodoList } from './TodoList.jsx';
import { Timer } from './Timer.jsx';
import { HabitTracker } from './HabitTracker.jsx';
import { MatrixView } from './MatrixView.jsx';
import { CalendarView } from './CalendarView.jsx';
import { Motivation } from './Motivation.jsx';
import { GoalCountdown } from './GoalCountdown.jsx';
import { Ambience } from './Ambience.jsx';
import { SettingsModal } from './SettingsModal.jsx';

const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  deepWorkDuration: 45,
  roundsBeforeLongBreak: 4,
  autoStartNextSession: false,
  soundEnabled: true,
  theme: 'light',
};

function normalizeTask(t) {
  return { ...t, id: t.id || t._id };
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [currentRound, setCurrentRound] = useState(1);
  const [motivationIntention, setMotivationIntention] = useState('');
  const [goal, setGoal] = useState(null);
  const [goalDraft, setGoalDraft] = useState({ title: '', targetDate: '', isEditing: true });
  const [ambienceState, setAmbienceState] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Day Planner');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const hasLoaded = useRef(false);

  // Sync theme with DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  // Initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [userDataRes, tasksRes, habitsRes] = await Promise.all([api.get('/userdata'), api.get('/tasks'), api.get('/habits')]);
        if (!mounted) return;

        const data = userDataRes.data.data;
        setSettings((prev) => ({ ...prev, ...(data?.settings || {}) }));
        setGoal(data?.goal && data.goal.title ? data.goal : null);
        if (data?.goal?.title) setGoalDraft({ title: data.goal.title, targetDate: data.goal.targetDate, isEditing: false });
        setMotivationIntention(data?.motivationIntention || '');
        setAmbienceState(data?.ambience || []);
        setActiveTaskId(data?.activeTaskId || null);
        setCurrentRound(data?.currentRound || 1);

        setTasks((tasksRes.data.tasks || []).map(normalizeTask));
        setHabits(habitsRes.data.habits || []);
      } catch (err) {
        console.error('Failed to load app data', err);
      } finally {
        if (mounted) {
          setLoading(false);
          hasLoaded.current = true;
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Persist user-level data (settings/goal/motivation/ambience/activeTask/round) on change
  useEffect(() => {
    if (!hasLoaded.current) return;
    const payload = {
      settings,
      goal,
      motivationIntention,
      ambience: ambienceState,
      activeTaskId,
      currentRound,
    };
    api.patch('/userdata', payload).catch((err) => console.error('Failed to save preferences', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, goal, motivationIntention, ambienceState, activeTaskId, currentRound]);

  const playEffect = useCallback(
    (type) => {
      if (!settings.soundEnabled) return;
      const audio = new Audio(type === 'success' ? 'https://actions.google.com/sounds/v1/ui/button_click.ogg' : 'https://actions.google.com/sounds/v1/ui/click_on.ogg');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    },
    [settings.soundEnabled]
  );

  const addTask = async (text, est, importance = false, urgency = false) => {
    try {
      const res = await api.post('/tasks', { text, estPomodoros: est, importance, urgency, date: selectedDate });
      setTasks((prev) => [normalizeTask(res.data.task), ...prev]);
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const updateTaskStatus = async (id, status) => {
    const target = tasks.find((t) => t.id === id);
    if (status === 'done' && target?.status !== 'done') playEffect('success');
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await api.patch(`/tasks/${id}`, { status });
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const clearAllTasks = async () => {
    if (!confirm('Purge all consciousness records? This is irreversible.')) return;
    setTasks([]);
    setActiveTaskId(null);
    try {
      await api.delete('/tasks');
    } catch (err) {
      console.error('Failed to clear tasks', err);
    }
  };

  const completeTaskPomodoro = async (id) => {
    const target = tasks.find((t) => t.id === id);
    const completedPomodoros = (target?.completedPomodoros || 0) + 1;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completedPomodoros } : t)));
    try {
      await api.patch(`/tasks/${id}`, { completedPomodoros });
    } catch (err) {
      console.error('Failed to update pomodoro count', err);
    }
  };

  const addHabit = async (name) => {
    try {
      const res = await api.post('/habits', { name });
      setHabits((prev) => [...prev, res.data.habit]);
    } catch (err) {
      console.error('Failed to add habit', err);
    }
  };

  const toggleHabit = async (id, date) => {
    try {
      const res = await api.patch(`/habits/${id}/toggle`, { date });
      setHabits((prev) => prev.map((h) => (h.id === id ? res.data.habit : h)));
      if (res.data.habit.completions[date]) playEffect('success');
    } catch (err) {
      console.error('Failed to toggle habit', err);
    }
  };

  const deleteHabit = async (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    try {
      await api.delete(`/habits/${id}`);
    } catch (err) {
      console.error('Failed to delete habit', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper dark:bg-paper-dark gap-4">
        <svg className="sketch-spinner" width="48" height="48" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" />
        </svg>
        <p className="font-heading text-xl text-ink-light dark:text-chalk-dim">sketching your workspace...</p>
      </div>
    );
  }

  const dailyTasks = tasks.filter((t) => t.date === selectedDate);

  const renderContent = () => {
    switch (activeTab) {
      case 'Day Planner':
        return (
          <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-10 animate-fade-in w-full">
            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <h2 className="text-4xl font-heading font-bold text-ink dark:text-chalk tracking-tight flex items-center gap-3">
                  <i className="fas fa-sun text-accent-muted text-2xl"></i>
                  Daily Journey
                </h2>
                <p className="text-sm font-body text-ink-light dark:text-chalk-dim mt-1 tracking-wide">
                  {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <div className="sketch-divider mt-3"></div>
              </div>
              <TodoList
                tasks={dailyTasks}
                onAddTask={addTask}
                onUpdateStatus={updateTaskStatus}
                onDeleteTask={deleteTask}
                onClearAll={clearAllTasks}
                activeTaskId={activeTaskId}
                setActiveTaskId={setActiveTaskId}
              />
            </div>
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <Timer
                settings={settings}
                currentRound={currentRound}
                onRoundComplete={() => setCurrentRound((r) => r + 1)}
                activeTask={tasks.find((t) => t.id === activeTaskId) || null}
                onTaskPomodoroComplete={completeTaskPomodoro}
              />
            </div>
          </div>
        );
      case 'Habit Tracker':
        return <HabitTracker habits={habits} onAddHabit={addHabit} onToggleHabit={toggleHabit} onDeleteHabit={deleteHabit} />;
      case 'Matrix View':
        return <MatrixView tasks={dailyTasks} onUpdateStatus={updateTaskStatus} onDeleteTask={deleteTask} />;
      case 'Calendar View':
        return (
          <CalendarView
            tasks={tasks}
            onDateSelect={(date) => {
              setSelectedDate(date);
              setActiveTab('Day Planner');
            }}
          />
        );
      case 'Motivation':
        return <Motivation intention={motivationIntention} onIntentionChange={setMotivationIntention} tasks={tasks} habits={habits} />;
      case 'Goal Countdown':
        return <GoalCountdown goal={goal} onSetGoal={setGoal} goalDraft={goalDraft} onUpdateDraft={setGoalDraft} />;
      case 'Ambience':
        return <Ambience initialState={ambienceState} onStateChange={setAmbienceState} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-paper dark:bg-paper-dark overflow-hidden transition-colors">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="flex-1 flex p-6 md:p-8 lg:p-10 overflow-y-auto custom-scrollbar pb-10 relative">
        <div className="absolute inset-0 ruled-bg opacity-15 pointer-events-none"></div>
        <div className="relative z-10 flex-1 flex">{renderContent()}</div>
      </main>

      {isSettingsOpen && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}
