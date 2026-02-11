import { useMemo } from 'react';
import { ArrowLeft, CalendarRange, Flame, RotateCcw, Trophy } from 'lucide-react';
import { todayDateKey } from '../../domain/date';
import { getHabitStats } from '../../domain/stats';
import { useHabitStore } from '../../state/store';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Panel } from './common/Panel';

export const HabitDetailsView = () => {
  const data = useHabitStore((state) => state.data);
  const selectedHabitId = useHabitStore((state) => state.selectedHabitId);
  const setView = useHabitStore((state) => state.setView);
  const restartStreak = useHabitStore((state) => state.restartStreak);

  const habit = data.habits.find((candidate) => candidate.id === selectedHabitId);
  const today = todayDateKey();

  const stats = useMemo(() => {
    if (!habit) {
      return null;
    }
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
        <Card className="border-dashed bg-white/70 text-sm text-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          Choose a habit from Today screen.
        </Card>
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{habit.name}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Consistency over perfection.</p>
        </div>
        <Button onClick={() => setView('today')}>
          <span className="inline-flex items-center gap-1.5">
            <ArrowLeft size={14} />
            Back
          </span>
        </Button>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="grid gap-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Flame size={13} />
            Current streak
          </span>
          <strong className="text-2xl text-slate-900 dark:text-slate-100">{stats.currentStreak}</strong>
        </Card>
        <Card className="grid gap-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Trophy size={13} />
            Best streak
          </span>
          <strong className="text-2xl text-slate-900 dark:text-slate-100">{stats.bestStreak}</strong>
        </Card>
        <Card className="grid gap-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <CalendarRange size={13} />
            7-day completion
          </span>
          <strong className="text-lg text-slate-900 dark:text-slate-100">
            {stats.completed7}/{stats.scheduled7} ({stats.completionRate7}%)
          </strong>
        </Card>
        <Card className="grid gap-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <CalendarRange size={13} />
            30-day completion
          </span>
          <strong className="text-lg text-slate-900 dark:text-slate-100">
            {stats.completed30}/{stats.scheduled30} ({stats.completionRate30}%)
          </strong>
        </Card>
      </div>

      {stats.isRecoverySuggested && (
        <Card tone="soft" className="mb-4 flex flex-col items-start justify-between gap-3 border-emerald-300 bg-emerald-50 p-3 sm:flex-row sm:items-center dark:border-emerald-500/40 dark:bg-emerald-500/10">
          <p className="text-sm text-emerald-900 dark:text-emerald-100">Come back gently: start with just one day.</p>
          <Button variant="primary" onClick={() => restartStreak(habit.id)}>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw size={14} />
              Restart streak
            </span>
          </Button>
        </Card>
      )}

      <section>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">30-day heatmap</h3>
        <div className="mt-2 grid grid-cols-10 gap-1">
          {stats.heatmap30.map((cell) => (
            <div
              key={cell.date}
              className={`aspect-square rounded ${
                cell.completed
                  ? 'bg-emerald-500'
                  : cell.scheduled
                    ? 'bg-slate-300 dark:bg-slate-700'
                    : 'bg-slate-100 dark:bg-slate-900'
              }`}
              title={`${cell.date} • ${cell.completed ? 'Done' : cell.scheduled ? 'Planned' : 'Off'}`}
            />
          ))}
        </div>
      </section>
    </Panel>
  );
};
