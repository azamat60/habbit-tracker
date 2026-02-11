import { describe, expect, it } from 'vitest';
import { getHabitStats } from './stats';
import { isDateScheduled } from './schedule';
import type { Habit } from './types';

const dailyHabit: Habit = {
  id: 'h1',
  name: 'Read',
  color: '#06b6d4',
  schedule: { type: 'daily' },
  startDate: '2026-01-01',
  archived: false,
  createdAt: 1,
};

const weeklyHabit: Habit = {
  id: 'h2',
  name: 'Workout',
  color: '#0ea5e9',
  schedule: { type: 'weekly', daysOfWeek: [1, 3, 5] },
  startDate: '2026-01-01',
  archived: false,
  createdAt: 1,
};

describe('schedule', () => {
  it('supports weekly schedule days', () => {
    expect(isDateScheduled(weeklyHabit, '2026-01-12')).toBe(true); // Mon
    expect(isDateScheduled(weeklyHabit, '2026-01-13')).toBe(false); // Tue
  });

  it('ignores dates before startDate', () => {
    expect(isDateScheduled(dailyHabit, '2025-12-31')).toBe(false);
  });
});

describe('stats', () => {
  it('calculates streak for daily habits', () => {
    const completions = {
      '2026-01-10': 1,
      '2026-01-11': 1,
      '2026-01-12': 1,
    } as const;

    const stats = getHabitStats(dailyHabit, completions, '2026-01-12');
    expect(stats.currentStreak).toBe(3);
    expect(stats.bestStreak).toBe(3);
  });

  it('breaks streak on missed scheduled day', () => {
    const completions = {
      '2026-01-07': 1,
      '2026-01-12': 1,
    } as const;

    const stats = getHabitStats(weeklyHabit, completions, '2026-01-12');
    expect(stats.currentStreak).toBe(1);
    expect(stats.bestStreak).toBe(1);
  });

  it('handles streak restart without deleting history', () => {
    const completions = {
      '2026-01-08': 1,
      '2026-01-09': 1,
      '2026-01-10': 1,
      '2026-01-11': 1,
      '2026-01-12': 1,
    } as const;

    const withRestart: Habit = {
      ...dailyHabit,
      streakRestartDate: '2026-01-11',
    };

    const stats = getHabitStats(withRestart, completions, '2026-01-12');
    expect(stats.currentStreak).toBe(2);
    expect(stats.bestStreak).toBe(5);
  });
});
