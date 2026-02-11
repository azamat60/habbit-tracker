export type DateKey = string;

export type Schedule =
  | { type: 'daily' }
  | { type: 'weekly'; daysOfWeek: number[] };

export interface Habit {
  id: string;
  name: string;
  color: string;
  note?: string;
  schedule: Schedule;
  startDate: DateKey;
  streakRestartDate?: DateKey;
  archived: boolean;
  createdAt: number;
}

export type HabitCompletions = Record<DateKey, 1>;

export interface UISettings {
  weekStartsOnMonday: boolean;
  theme: 'light' | 'dark';
}

export interface AppData {
  version: number;
  habits: Habit[];
  completions: Record<string, HabitCompletions>;
  settings: UISettings;
}

export type HabitFilter = 'active' | 'archived';
export type AppView = 'today' | 'details' | 'settings';

export interface HeatmapCell {
  date: DateKey;
  scheduled: boolean;
  completed: boolean;
}

export interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  completed7: number;
  scheduled7: number;
  completed30: number;
  scheduled30: number;
  completionRate7: number;
  completionRate30: number;
  heatmap30: HeatmapCell[];
  isRecoverySuggested: boolean;
}
