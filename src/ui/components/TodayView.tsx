import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
  Archive,
  ArchiveRestore,
  BedDouble,
  BookOpen,
  Brain,
  CheckCircle2,
  Circle,
  Droplets,
  Dumbbell,
  Footprints,
  Leaf,
  NotebookPen,
  Pencil,
  Plus,
  SquareChartGantt,
} from 'lucide-react';
import { todayDateKey } from '../../domain/date';
import { getHabitStats } from '../../domain/stats';
import { useHabitStore } from '../../state/store';
import type { Habit } from '../../domain/types';
import { HABIT_PRESETS, presetToDraft } from '../presets';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Panel } from './common/Panel';
import { HabitModal } from './HabitModal';

interface TodayViewProps {
  onOpenHabit: (habitId: string) => void;
}

const presetIconById: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  'drink-water': Droplets,
  walk: Footprints,
  read: BookOpen,
  'workout-3x': Dumbbell,
  meditation: Brain,
  sleep: BedDouble,
  journal: NotebookPen,
  'no-sugar-weekdays': Leaf,
};

const HabitCard = ({ habit, today }: { habit: Habit; today: string }) => {
  const completions = useHabitStore((state) => state.data.completions[habit.id]);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
  const stats = useMemo(() => getHabitStats(habit, completions, today), [habit, completions, today]);
  const completed = completions?.[today] === 1;

  return (
    <article
      className="rounded-2xl border bg-white/85 p-4 shadow-sm backdrop-blur dark:bg-slate-900/75"
      style={{ borderColor: habit.color }}
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{habit.name}</h3>
        {habit.note && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{habit.note}</p>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Streak: {stats.currentStreak}
        </span>
        <Button variant={completed ? 'success' : 'ghost'} onClick={() => toggleCompletion(habit.id, today)}>
          <span className="inline-flex items-center gap-1.5">
            {completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            {completed ? 'Done' : 'Not done'}
          </span>
        </Button>
      </div>
    </article>
  );
};

const SkeletonList = () => {
  return (
    <div className="grid gap-3" aria-hidden>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/75"
        >
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-3 w-1/3 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
};

const makeUniqueName = (name: string, habits: Habit[]): string => {
  const names = new Set(habits.map((habit) => habit.name.toLowerCase()));
  if (!names.has(name.toLowerCase())) {
    return name;
  }

  let attempt = 2;
  while (names.has(`${name} (${attempt})`.toLowerCase())) {
    attempt += 1;
  }
  return `${name} (${attempt})`;
};

export const TodayView = ({ onOpenHabit }: TodayViewProps) => {
  const today = todayDateKey();
  const data = useHabitStore((state) => state.data);
  const filter = useHabitStore((state) => state.filter);
  const setFilter = useHabitStore((state) => state.setFilter);
  const archiveHabit = useHabitStore((state) => state.archiveHabit);
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowSkeleton(false), 450);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const onCreateRequest = () => setCreateOpen(true);
    window.addEventListener('habit:new', onCreateRequest);
    return () => window.removeEventListener('habit:new', onCreateRequest);
  }, []);

  const habits = data.habits.filter((habit) => (filter === 'active' ? !habit.archived : habit.archived));

  return (
    <Panel>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Today</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">One click is enough. Track progress without pressure.</p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <span className="inline-flex items-center gap-1.5">
            <Plus size={14} />
            Habit
          </span>
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <Button variant={filter === 'active' ? 'primary' : 'ghost'} onClick={() => setFilter('active')}>
          <span className="inline-flex items-center gap-1.5">
            <SquareChartGantt size={14} />
            Active
          </span>
        </Button>
        <Button variant={filter === 'archived' ? 'primary' : 'ghost'} onClick={() => setFilter('archived')}>
          <span className="inline-flex items-center gap-1.5">
            <Archive size={14} />
            Archived
          </span>
        </Button>
      </div>

      <Card tone="soft" className="mb-4">
        <div className="mb-2 flex items-end justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Popular habits</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Quick start templates</span>
        </div>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {HABIT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className="rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              type="button"
              onClick={() => {
                const draft = presetToDraft(preset);
                addHabit({
                  ...draft,
                  name: makeUniqueName(draft.name, data.habits),
                });
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-full"
                  style={{ backgroundColor: preset.color }}
                />
                {(() => {
                  const Icon = presetIconById[preset.id] ?? SquareChartGantt;
                  return <Icon size={14} className="text-slate-500 dark:text-slate-400" />;
                })()}
              </div>
              <strong className="block text-sm text-slate-900 dark:text-slate-100">{preset.title}</strong>
              <small className="text-xs text-slate-500 dark:text-slate-400">
                {preset.schedule.type === 'daily' ? 'Daily' : 'Weekly'}
              </small>
            </button>
          ))}
        </div>
      </Card>

      {showSkeleton ? (
        <SkeletonList />
      ) : habits.length === 0 ? (
        <Card className="grid gap-3 border-dashed bg-white/70 text-center dark:bg-slate-900/60">
          <p className="text-sm text-slate-700 dark:text-slate-300">No habits here yet.</p>
          <Button onClick={() => setCreateOpen(true)}>Create your first habit</Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {habits.map((habit) => (
            <div key={habit.id}>
              <HabitCard habit={habit} today={today} />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button variant="info" onClick={() => onOpenHabit(habit.id)}>
                  <span className="inline-flex items-center gap-1.5">
                    <SquareChartGantt size={14} />
                    Details
                  </span>
                </Button>
                <Button variant="warning" onClick={() => setEditingHabit(habit)}>
                  <span className="inline-flex items-center gap-1.5">
                    <Pencil size={14} />
                    Edit
                  </span>
                </Button>
                <Button
                  variant={habit.archived ? 'success' : 'danger'}
                  onClick={() => archiveHabit(habit.id, !habit.archived)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {habit.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                    {habit.archived ? 'Unarchive' : 'Archive'}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateOpen && <HabitModal open={isCreateOpen} onClose={() => setCreateOpen(false)} onSave={addHabit} />}

      {editingHabit && (
        <HabitModal
          open={Boolean(editingHabit)}
          initial={editingHabit}
          onClose={() => setEditingHabit(null)}
          onSave={(payload) => {
            updateHabit(editingHabit.id, payload);
          }}
        />
      )}
    </Panel>
  );
};
