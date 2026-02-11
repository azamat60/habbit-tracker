import { todayDateKey } from '../domain/date';
import type { Habit } from '../domain/types';

export interface HabitPreset {
  id: string;
  title: string;
  note: string;
  schedule: Habit['schedule'];
  color: string;
}

export const HABIT_PRESETS: HabitPreset[] = [
  {
    id: 'drink-water',
    title: 'Drink water',
    note: 'At least 6-8 glasses',
    schedule: { type: 'daily' },
    color: '#06b6d4',
  },
  {
    id: 'walk',
    title: 'Walk 8,000 steps',
    note: 'Any pace counts',
    schedule: { type: 'daily' },
    color: '#84cc16',
  },
  {
    id: 'read',
    title: 'Read 20 min',
    note: '1 chapter is enough',
    schedule: { type: 'daily' },
    color: '#f97316',
  },
  {
    id: 'workout-3x',
    title: 'Workout 3x/week',
    note: 'Short sessions are valid',
    schedule: { type: 'weekly', daysOfWeek: [1, 3, 5] },
    color: '#3b82f6',
  },
  {
    id: 'meditation',
    title: 'Meditate 10 min',
    note: 'Even 2 minutes is good',
    schedule: { type: 'daily' },
    color: '#6366f1',
  },
  {
    id: 'sleep',
    title: 'Sleep before 23:30',
    note: 'Aim for stable bedtime',
    schedule: { type: 'daily' },
    color: '#0ea5e9',
  },
  {
    id: 'journal',
    title: 'Journal',
    note: 'Write 3 short lines',
    schedule: { type: 'daily' },
    color: '#14b8a6',
  },
  {
    id: 'no-sugar-weekdays',
    title: 'No sugar (weekdays)',
    note: 'Neutral reset if missed',
    schedule: { type: 'weekly', daysOfWeek: [1, 2, 3, 4, 5] },
    color: '#4f46e5',
  },
];

export const presetToDraft = (preset: HabitPreset) => ({
  name: preset.title,
  note: preset.note,
  color: preset.color,
  schedule: preset.schedule,
  startDate: todayDateKey(),
});
