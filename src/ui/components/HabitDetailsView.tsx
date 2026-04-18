import { useMemo } from 'react';
import { ArrowLeft, CalendarRange, Flame, RotateCcw, Trophy } from 'lucide-react';
import { todayDateKey } from '../../domain/date';
import { getHabitStats } from '../../domain/stats';
import { useHabitStore } from '../../state/store';
import { Button } from './common/Button';
import { Panel } from './common/Panel';

export const HabitDetailsView = () => {
  const data = useHabitStore((state) => state.data);
  const selectedHabitId = useHabitStore((state) => state.selectedHabitId);
  const setView = useHabitStore((state) => state.setView);
  const restartStreak = useHabitStore((state) => state.restartStreak);

  const habit = data.habits.find((candidate) => candidate.id === selectedHabitId);
  const today = todayDateKey();

  const stats = useMemo(() => {
    if (!habit) return null;
    return getHabitStats(habit, data.completions[habit.id], today);
  }, [data.completions, habit, today]);

  if (!habit || !stats) {
    return (
      <Panel>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Habit details</h2>
          <Button onClick={() => setView('today')}>
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft size={14} />
              Back
            </span>
          </Button>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
          Choose a habit from the Today screen.
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: habit.color }} />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{habit.name}</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Consistency over perfection.</p>
        </div>
        <Button onClick={() => setView('today')}>
          <span className="inline-flex items-center gap-1.5">
            <ArrowLeft size={14} />
            Back
          </span>
        </Button>
      </div>

      <div className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-1.5 rounded-2xl border border-orange-200 bg-orange-50/80 p-3 dark:border-orange-500/20 dark:bg-orange-950/20">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400">
            <Flame size={13} />
            Current streak
          </span>
          <strong className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.currentStreak}</strong>
          <span className="text-xs text-orange-500 dark:text-orange-400/70">days</span>
        </div>

        <div className="grid gap-1.5 rounded-2xl border border-amber-200 bg-amber-50/80 p-3 dark:border-amber-500/20 dark:bg-amber-950/20">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Trophy size={13} />
            Best streak
          </span>
          <strong className="text-3xl font-bold text-amber-900 dark:text-amber-100">{stats.bestStreak}</strong>
          <span className="text-xs text-amber-500 dark:text-amber-400/70">days</span>
        </div>

        <div className="grid gap-1.5 rounded-2xl border border-sky-200 bg-sky-50/80 p-3 dark:border-sky-500/20 dark:bg-sky-950/20">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400">
            <CalendarRange size={13} />
            7-day completion
          </span>
          <div className="flex items-baseline gap-1.5">
            <strong className="text-2xl font-bold text-sky-900 dark:text-sky-100">
              {stats.completed7}/{stats.scheduled7}
            </strong>
          </div>
          <span className="text-xs text-sky-500 dark:text-sky-400/70">{stats.completionRate7}%</span>
        </div>

        <div className="grid gap-1.5 rounded-2xl border border-violet-200 bg-violet-50/80 p-3 dark:border-violet-500/20 dark:bg-violet-950/20">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400">
            <CalendarRange size={13} />
            30-day completion
          </span>
          <div className="flex items-baseline gap-1.5">
            <strong className="text-2xl font-bold text-violet-900 dark:text-violet-100">
              {stats.completed30}/{stats.scheduled30}
            </strong>
          </div>
          <span className="text-xs text-violet-500 dark:text-violet-400/70">{stats.completionRate30}%</span>
        </div>
      </div>

      {stats.isRecoverySuggested && (
        <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 sm:flex-row sm:items-center dark:border-emerald-500/40 dark:bg-emerald-500/10">
          <p className="text-sm text-emerald-900 dark:text-emerald-100">
            Come back gently — start with just one day.
          </p>
          <Button variant="primary" onClick={() => restartStreak(habit.id)}>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw size={14} />
              Restart streak
            </span>
          </Button>
        </div>
      )}

      <section>
        <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">30-day heatmap</h3>
        <div className="grid grid-cols-10 gap-1.5">
          {stats.heatmap30.map((cell) => (
            <div
              key={cell.date}
              className={`aspect-square rounded-lg transition ${
                cell.completed
                  ? 'bg-emerald-500 shadow-sm'
                  : cell.scheduled
                    ? 'bg-slate-200 dark:bg-slate-700'
                    : 'bg-slate-100 dark:bg-slate-800/50'
              }`}
              title={`${cell.date} · ${cell.completed ? 'Done ✓' : cell.scheduled ? 'Missed' : 'Off'}`}
            />
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-emerald-500" />
            Done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700" />
            Missed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-slate-100 dark:bg-slate-800/50" />
            Off
          </span>
        </div>
      </section>
    </Panel>
  );
};
