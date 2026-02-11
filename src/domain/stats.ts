import { addDays, maxDate } from './date';
import { getLastScheduledDateOnOrBefore, getScheduledDatesInRange } from './schedule';
import type { DateKey, Habit, HabitCompletions, HabitStats } from './types';

const isDone = (completions: HabitCompletions | undefined, date: DateKey): boolean =>
  completions?.[date] === 1;

const getCurrentStreak = (habit: Habit, completions: HabitCompletions | undefined, today: DateKey): number => {
  const boundary = maxDate(habit.startDate, habit.streakRestartDate ?? habit.startDate);
  const anchor = getLastScheduledDateOnOrBefore(habit, today);
  if (!anchor) {
    return 0;
  }

  let cursor = anchor;
  let streak = 0;

  while (cursor >= boundary) {
    if (!isDone(completions, cursor)) {
      break;
    }

    streak += 1;

    const previous = getLastScheduledDateOnOrBefore(habit, addDays(cursor, -1));
    if (!previous || previous < boundary) {
      break;
    }
    cursor = previous;
  }

  return streak;
};

const getBestStreak = (habit: Habit, completions: HabitCompletions | undefined, today: DateKey): number => {
  const scheduledDates = getScheduledDatesInRange(habit, habit.startDate, today);
  let current = 0;
  let best = 0;

  for (const date of scheduledDates) {
    if (isDone(completions, date)) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
};

export const getHabitStats = (habit: Habit, completions: HabitCompletions | undefined, today: DateKey): HabitStats => {
  const from7 = addDays(today, -6);
  const from30 = addDays(today, -29);

  const scheduled7 = getScheduledDatesInRange(habit, from7, today);
  const scheduled30 = getScheduledDatesInRange(habit, from30, today);

  const completed7 = scheduled7.filter((date) => isDone(completions, date)).length;
  const completed30 = scheduled30.filter((date) => isDone(completions, date)).length;

  const completionRate7 = scheduled7.length === 0 ? 0 : Math.round((completed7 / scheduled7.length) * 100);
  const completionRate30 =
    scheduled30.length === 0 ? 0 : Math.round((completed30 / scheduled30.length) * 100);

  const heatmap30 = Array.from({ length: 30 }, (_, index) => {
    const date = addDays(from30, index);
    const scheduled = scheduled30.includes(date);
    return {
      date,
      scheduled,
      completed: scheduled && isDone(completions, date),
    };
  });

  const currentStreak = getCurrentStreak(habit, completions, today);

  return {
    currentStreak,
    bestStreak: getBestStreak(habit, completions, today),
    completed7,
    scheduled7: scheduled7.length,
    completed30,
    scheduled30: scheduled30.length,
    completionRate7,
    completionRate30,
    heatmap30,
    isRecoverySuggested: currentStreak === 0 && completed7 <= 1,
  };
};
