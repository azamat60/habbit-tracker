import dayjs from 'dayjs';
import { addDays, isAfter, maxDate, toDateKey } from './date';
import type { DateKey, Habit } from './types';

export const isDateScheduled = (habit: Habit, date: DateKey): boolean => {
  if (isAfter(habit.startDate, date)) {
    return false;
  }

  if (habit.schedule.type === 'daily') {
    return true;
  }

  return habit.schedule.daysOfWeek.includes(dayjs(date).day());
};

export const getScheduledDatesInRange = (
  habit: Habit,
  start: DateKey,
  end: DateKey,
): DateKey[] => {
  if (isAfter(start, end)) {
    return [];
  }

  const actualStart = maxDate(start, habit.startDate);
  const actualEnd = end;

  if (isAfter(actualStart, actualEnd)) {
    return [];
  }

  const result: DateKey[] = [];
  let cursor = actualStart;

  while (!isAfter(cursor, actualEnd)) {
    if (isDateScheduled(habit, cursor)) {
      result.push(cursor);
    }
    cursor = addDays(cursor, 1);
  }

  return result;
};

export const getLastScheduledDateOnOrBefore = (habit: Habit, date: DateKey): DateKey | null => {
  const fromDate = toDateKey(date);
  if (isAfter(habit.startDate, fromDate)) {
    return null;
  }

  let cursor = fromDate;
  while (!isAfter(habit.startDate, cursor)) {
    if (isDateScheduled(habit, cursor)) {
      return cursor;
    }
    cursor = addDays(cursor, -1);
  }

  return null;
};
