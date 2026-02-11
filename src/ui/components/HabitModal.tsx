import { useEffect, useState } from 'react';
import { CalendarDays, Check, Save, X } from 'lucide-react';
import { todayDateKey } from '../../domain/date';
import type { Habit } from '../../domain/types';
import { HABIT_COLORS, WEEK_DAYS } from '../constants';
import { Button } from './common/Button';
import { Card } from './common/Card';

interface HabitModalProps {
  open: boolean;
  initial?: Habit | null;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    color: string;
    note?: string;
    schedule: Habit['schedule'];
    startDate: string;
  }) => void;
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400';

export const HabitModal = ({ open, initial, onClose, onSave }: HabitModalProps) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? HABIT_COLORS[0]);
  const [note, setNote] = useState(initial?.note ?? '');
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>(initial?.schedule.type ?? 'daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    initial?.schedule.type === 'weekly' ? initial.schedule.daysOfWeek : [1, 2, 3, 4, 5],
  );
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayDateKey());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!open) {
    return null;
  }

  const toggleDay = (day: number) => {
    setDaysOfWeek((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day],
    );
  };

  const handleSave = () => {
    const finalDays = daysOfWeek.length > 0 ? daysOfWeek : [1];
    onSave({
      name,
      color,
      note,
      startDate,
      schedule:
        scheduleType === 'daily'
          ? { type: 'daily' }
          : { type: 'weekly', daysOfWeek: finalDays },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-slate-900/35 p-3 backdrop-blur-sm dark:bg-slate-950/70" role="dialog" aria-modal="true">
      <Card className="grid w-full max-w-xl gap-4 rounded-3xl border-slate-200 p-4 shadow-xl dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{initial ? 'Edit habit' : 'Create habit'}</h3>
          <Button onClick={onClose}>
            <span className="inline-flex items-center gap-1.5">
              <X size={14} />
              Close
            </span>
          </Button>
        </div>

        <label className="grid gap-2 text-sm text-slate-700 dark:text-slate-300">
          Name
          <input
            className={inputCls}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Read 10 pages"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700 dark:text-slate-300">
          Note (optional)
          <input
            className={inputCls}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Tiny step is enough"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-700 dark:text-slate-300">
          Start date
          <input
            className={inputCls}
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>

        <fieldset className="grid gap-2 border-0 p-0">
          <legend className="mb-1 text-sm text-slate-700 dark:text-slate-300">Schedule</legend>
          <div className="flex gap-2">
            <Button variant={scheduleType === 'daily' ? 'primary' : 'ghost'} onClick={() => setScheduleType('daily')}>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} />
                Daily
              </span>
            </Button>
            <Button variant={scheduleType === 'weekly' ? 'primary' : 'ghost'} onClick={() => setScheduleType('weekly')}>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                Weekly
              </span>
            </Button>
          </div>

          {scheduleType === 'weekly' && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {WEEK_DAYS.map((day) => (
                <Button
                  key={day.value}
                  variant={daysOfWeek.includes(day.value) ? 'primary' : 'ghost'}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset className="grid gap-2 border-0 p-0">
          <legend className="mb-1 text-sm text-slate-700 dark:text-slate-300">Color</legend>
          <div className="flex flex-wrap gap-2">
            {HABIT_COLORS.map((token) => (
              <button
                key={token}
                type="button"
                className={`h-7 w-7 rounded-full border-2 ${token === color ? 'border-slate-900 dark:border-white' : 'border-transparent'}`}
                style={{ backgroundColor: token }}
                onClick={() => setColor(token)}
                aria-label={`Select color ${token}`}
              />
            ))}
          </div>
        </fieldset>

        <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
          <span className="inline-flex items-center gap-1.5">
            <Save size={14} />
            Save
          </span>
        </Button>
      </Card>
    </div>
  );
};
