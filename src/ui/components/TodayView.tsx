import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import dayjs from 'dayjs';
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
  Flame,
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

interface HabitCardProps {
  habit: Habit;
  today: string;
  onDetails: () => void;
  onEdit: () => void;
  onArchive: () => void;
}

const HabitCard = ({ habit, today, onDetails, onEdit, onArchive }: HabitCardProps) => {
  const completions = useHabitStore((state) => state.data.completions[habit.id]);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
  const stats = useMemo(() => getHabitStats(habit, completions, today), [habit, completions, today]);
  const completed = completions?.[today] === 1;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white/85 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
      <div className="h-1 w-full" style={{ backgroundColor: habit.color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">{habit.name}</h3>
            {habit.note && (
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{habit.note}</p>
            )}
          </div>
          <button
            onClick={() => toggleCompletion(habit.id, today)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 ${
              completed
                ? 'border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:border-emerald-700/70 dark:bg-emerald-900/40 dark:text-emerald-100'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600'
            }`}
          >
            {completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            {completed ? 'Done' : 'Mark done'}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Flame size={11} style={{ color: habit.color }} />
            {stats.currentStreak} day streak
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <button
              onClick={onDetails}
              className="flex items-center gap-1 transition hover:text-sky-600 dark:hover:text-sky-400"
            >
              <SquareChartGantt size={12} />
              Details
            </button>
            <span className="text-slate-200 dark:text-slate-700">·</span>
            <button
              onClick={onEdit}
              className="flex items-center gap-1 transition hover:text-amber-600 dark:hover:text-amber-400"
            >
              <Pencil size={12} />
              Edit
            </button>
            <span className="text-slate-200 dark:text-slate-700">·</span>
            <button
              onClick={onArchive}
              className={`flex items-center gap-1 transition ${
                habit.archived
                  ? 'hover:text-emerald-600 dark:hover:text-emerald-400'
                  : 'hover:text-rose-500 dark:hover:text-rose-400'
              }`}
            >
              {habit.archived ? <ArchiveRestore size={12} /> : <Archive size={12} />}
              {habit.archived ? 'Unarchive' : 'Archive'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const SkeletonList = () => (
  <div className="grid gap-3" aria-hidden>
    {Array.from({ length: 3 }, (_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white/85 shadow-sm dark:border-slate-800 dark:bg-slate-900/75"
      >
        <div className="h-1 animate-pulse bg-slate-200 dark:bg-slate-700" />
        <div className="p-4">
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-3 w-1/3 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    ))}
  </div>
);

const makeUniqueName = (name: string, habits: Habit[]): string => {
  const names = new Set(habits.map((habit) => habit.name.toLowerCase()));
  if (!names.has(name.toLowerCase())) return name;
  let attempt = 2;
  while (names.has(`${name} (${attempt})`.toLowerCase())) attempt += 1;
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
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Today</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{dayjs().format('dddd, MMMM D')}</p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <span className="inline-flex items-center gap-1.5">
            <Plus size={14} />
            New habit
          </span>
        </Button>
      </div>

      <div className="mb-5 flex gap-1.5">
        <Button variant={filter === 'active' ? 'tabActive' : 'tabIdle'} onClick={() => setFilter('active')}>
          <span className="inline-flex items-center gap-1.5">
            <SquareChartGantt size={13} />
            Active
          </span>
        </Button>
        <Button variant={filter === 'archived' ? 'tabActive' : 'tabIdle'} onClick={() => setFilter('archived')}>
          <span className="inline-flex items-center gap-1.5">
            <Archive size={13} />
            Archived
          </span>
        </Button>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mb-2.5 flex items-end justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Popular habits</h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">Quick start</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {HABIT_PRESETS.map((preset) => {
            const Icon = presetIconById[preset.id] ?? SquareChartGantt;
            return (
              <button
                key={preset.id}
                className="group rounded-xl border border-slate-200 bg-white p-2.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-slate-600"
                type="button"
                onClick={() => {
                  const draft = presetToDraft(preset);
                  addHabit({ ...draft, name: makeUniqueName(draft.name, data.habits) });
                }}
              >
                <div className="mb-1.5 flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: preset.color }} />
                  <Icon size={12} className="text-slate-400 dark:text-slate-500" />
                </div>
                <strong className="block text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
                  {preset.title}
                </strong>
                <small className="text-[10px] text-slate-400 dark:text-slate-500">
                  {preset.schedule.type === 'daily' ? 'Daily' : 'Weekly'}
                </small>
              </button>
            );
          })}
        </div>
      </div>

      {showSkeleton ? (
        <SkeletonList />
      ) : habits.length === 0 ? (
        <Card className="border-dashed bg-white/70 text-center dark:bg-slate-900/60">
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">No habits here yet.</p>
          <Button onClick={() => setCreateOpen(true)}>Create your first habit</Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onDetails={() => onOpenHabit(habit.id)}
              onEdit={() => setEditingHabit(habit)}
              onArchive={() => archiveHabit(habit.id, !habit.archived)}
            />
          ))}
        </div>
      )}

      {isCreateOpen && <HabitModal open={isCreateOpen} onClose={() => setCreateOpen(false)} onSave={addHabit} />}

      {editingHabit && (
        <HabitModal
          open={Boolean(editingHabit)}
          initial={editingHabit}
          onClose={() => setEditingHabit(null)}
          onSave={(payload) => updateHabit(editingHabit.id, payload)}
        />
      )}
    </Panel>
  );
};
