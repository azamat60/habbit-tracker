import { create } from 'zustand';
import { todayDateKey } from '../domain/date';
import { exportData, importData, loadData, resetData, saveData } from '../storage/storage';
import type { AppData, AppView, Habit, HabitFilter } from '../domain/types';

interface HabitDraft {
  name: string;
  color: string;
  note?: string;
  schedule: Habit['schedule'];
  startDate: string;
}

interface HabitStore {
  data: AppData;
  view: AppView;
  filter: HabitFilter;
  selectedHabitId: string | null;
  addHabit: (draft: HabitDraft) => void;
  updateHabit: (habitId: string, draft: HabitDraft) => void;
  archiveHabit: (habitId: string, archived: boolean) => void;
  selectHabit: (habitId: string | null) => void;
  setView: (view: AppView) => void;
  setFilter: (filter: HabitFilter) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  restartStreak: (habitId: string) => void;
  setWeekStartsOnMonday: (value: boolean) => void;
  setTheme: (value: AppData['settings']['theme']) => void;
  resetAllData: () => void;
  exportJson: () => string;
  importJson: (raw: string) => void;
}

const normalizeDraft = (draft: HabitDraft): HabitDraft => ({
  ...draft,
  name: draft.name.trim(),
  color: draft.color || '#4f46e5',
  startDate: draft.startDate || todayDateKey(),
  note: draft.note?.trim() || undefined,
  schedule:
    draft.schedule.type === 'daily'
      ? { type: 'daily' }
      : {
          type: 'weekly',
          daysOfWeek: [...draft.schedule.daysOfWeek].sort((a, b) => a - b),
        },
});

const updateData = (
  set: (fn: (prev: HabitStore) => Partial<HabitStore>) => void,
  updater: (data: AppData) => AppData,
): void => {
  set((prev) => {
    const nextData = updater(prev.data);
    saveData(nextData);
    return { data: nextData };
  });
};

export const useHabitStore = create<HabitStore>((set, get) => ({
  data: loadData(),
  view: 'today',
  filter: 'active',
  selectedHabitId: null,
  addHabit: (draft) => {
    const normalized = normalizeDraft(draft);
    if (!normalized.name) {
      return;
    }

    updateData(set, (data) => ({
      ...data,
      habits: [
        ...data.habits,
        {
          id: crypto.randomUUID(),
          name: normalized.name,
          color: normalized.color,
          note: normalized.note,
          schedule: normalized.schedule,
          startDate: normalized.startDate,
          archived: false,
          createdAt: Date.now(),
        },
      ],
    }));
  },
  updateHabit: (habitId, draft) => {
    const normalized = normalizeDraft(draft);
    if (!normalized.name) {
      return;
    }

    updateData(set, (data) => ({
      ...data,
      habits: data.habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              name: normalized.name,
              color: normalized.color,
              note: normalized.note,
              schedule: normalized.schedule,
              startDate: normalized.startDate,
            }
          : habit,
      ),
    }));
  },
  archiveHabit: (habitId, archived) => {
    updateData(set, (data) => ({
      ...data,
      habits: data.habits.map((habit) => (habit.id === habitId ? { ...habit, archived } : habit)),
    }));
  },
  selectHabit: (habitId) => set({ selectedHabitId: habitId }),
  setView: (view) => set({ view }),
  setFilter: (filter) => set({ filter }),
  toggleCompletion: (habitId, date) => {
    updateData(set, (data) => {
      const habitMap = { ...(data.completions[habitId] ?? {}) };
      if (habitMap[date]) {
        delete habitMap[date];
      } else {
        habitMap[date] = 1;
      }

      return {
        ...data,
        completions: {
          ...data.completions,
          [habitId]: habitMap,
        },
      };
    });
  },
  restartStreak: (habitId) => {
    const today = todayDateKey();
    updateData(set, (data) => ({
      ...data,
      habits: data.habits.map((habit) =>
        habit.id === habitId ? { ...habit, streakRestartDate: today } : habit,
      ),
    }));
  },
  setWeekStartsOnMonday: (value) => {
    updateData(set, (data) => ({
      ...data,
      settings: {
        ...data.settings,
        weekStartsOnMonday: value,
      },
    }));
  },
  setTheme: (value) => {
    updateData(set, (data) => ({
      ...data,
      settings: {
        ...data.settings,
        theme: value,
      },
    }));
  },
  resetAllData: () => {
    set({ data: resetData(), selectedHabitId: null, view: 'today', filter: 'active' });
  },
  exportJson: () => exportData(get().data),
  importJson: (raw) => {
    const nextData = importData(raw);
    set({ data: nextData, view: 'today', filter: 'active', selectedHabitId: null });
  },
}));
