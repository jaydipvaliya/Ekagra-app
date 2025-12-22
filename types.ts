
export enum TaskStatus {
  ACTIVE = 'active',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

export interface Task {
  id: string;
  text: string;
  estPomodoros: number;
  completedPomodoros: number;
  status: TaskStatus;
  createdAt: number;
  importance: boolean;
  urgency: boolean;
  date: string; // YYYY-MM-DD format
}

export interface Habit {
  id: string;
  name: string;
  completions: Record<string, boolean>;
  createdAt: number;
}

export enum TimerMode {
  FOCUS = 'Focus',
  SHORT_BREAK = 'Short Break',
  LONG_BREAK = 'Long Break',
  DEEP_WORK = 'Deep Work'
}

export interface Settings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  deepWorkDuration: number;
  roundsBeforeLongBreak: number;
  autoStartNextSession: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}

export interface Goal {
  title: string;
  targetDate: string;
}

export interface GoalDraft {
  title: string;
  targetDate: string;
  isEditing: boolean;
}

export interface AmbienceSoundState {
  id: string;
  isPlaying: boolean;
  volume: number;
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  activeTaskId: string | null;
  settings: Settings;
  currentRound: number;
  motivationIntention?: string;
  goal?: Goal | null;
  goalDraft?: GoalDraft;
  ambience?: AmbienceSoundState[];
}
