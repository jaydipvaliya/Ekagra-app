
import { Settings, TimerMode } from './types';

export const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  deepWorkDuration: 45,
  roundsBeforeLongBreak: 4,
  autoStartNextSession: false,
  soundEnabled: true,
  theme: 'light',
};

export const TIMER_MODES_CONFIG = {
  [TimerMode.FOCUS]: { color: 'bg-indigo-700', hover: 'hover:bg-indigo-800', text: 'text-indigo-700' },
  [TimerMode.SHORT_BREAK]: { color: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-500' },
  [TimerMode.LONG_BREAK]: { color: 'bg-sky-500', hover: 'hover:bg-sky-600', text: 'text-sky-500' },
  [TimerMode.DEEP_WORK]: { color: 'bg-indigo-900', hover: 'hover:bg-black', text: 'text-indigo-900' },
};

export const STORAGE_KEY = 'ekagra_focus_state_v1';
