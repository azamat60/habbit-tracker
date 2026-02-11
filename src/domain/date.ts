import dayjs from 'dayjs';
import type { DateKey } from './types';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const todayDateKey = (): DateKey => dayjs().format(DATE_FORMAT) as DateKey;

export const toDateKey = (value: string | Date | dayjs.Dayjs): DateKey =>
  dayjs(value).format(DATE_FORMAT) as DateKey;

export const addDays = (date: DateKey, days: number): DateKey =>
  dayjs(date).add(days, 'day').format(DATE_FORMAT) as DateKey;

export const diffDays = (left: DateKey, right: DateKey): number =>
  dayjs(left).diff(dayjs(right), 'day');

export const isAfter = (left: DateKey, right: DateKey): boolean => dayjs(left).isAfter(dayjs(right));

export const minDate = (a: DateKey, b: DateKey): DateKey => (isAfter(a, b) ? b : a);
export const maxDate = (a: DateKey, b: DateKey): DateKey => (isAfter(a, b) ? a : b);
