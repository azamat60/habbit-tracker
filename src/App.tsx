import { useEffect } from 'react';
import { ChartColumn, ListTodo, MoonStar, Settings, Sun } from 'lucide-react';
import { useHabitStore } from './state/store';
import { HabitDetailsView } from './ui/components/HabitDetailsView';
import { SettingsView } from './ui/components/SettingsView';
import { TodayView } from './ui/components/TodayView';

type View = 'today' | 'details' | 'settings';

const SEO_BY_VIEW = {
  today: {
    title: 'Habit Tracker - Today Habits and Daily Check-ins',
    description: 'Mark today habits in one click, stay consistent, and build routines without pressure.',
  },
  details: {
    title: 'Habit Tracker - Habit Analytics, Streaks and Heatmap',
    description: 'Review streak, best streak, completion rates and 30-day heatmap for each habit.',
  },
  settings: {
    title: 'Habit Tracker - Backup, Restore and Preferences',
    description: 'Manage habit tracker settings, export/import JSON backup, and configure your local-first workflow.',
  },
} as const;

const upsertMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const navItems: { key: View; label: string; Icon: typeof ListTodo }[] = [
  { key: 'today', label: 'Today', Icon: ListTodo },
  { key: 'details', label: 'Details', Icon: ChartColumn },
  { key: 'settings', label: 'Settings', Icon: Settings },
];

function App() {
  const view = useHabitStore((state) => state.view);
  const setView = useHabitStore((state) => state.setView);
  const selectHabit = useHabitStore((state) => state.selectHabit);
  const theme = useHabitStore((state) => state.data.settings.theme);
  const setTheme = useHabitStore((state) => state.setTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const seo = SEO_BY_VIEW[view];
    document.title = seo.title;
    upsertMeta('meta[name="description"]', 'name', 'description', seo.description);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.href = window.location.href;
  }, [view]);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.key === '1') setView('today');
      else if (event.key === '2') setView('details');
      else if (event.key === '3') setView('settings');
      else if (event.key.toLowerCase() === 'n' && view === 'today') {
        window.dispatchEvent(new CustomEvent('habit:new'));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setView, view]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-8 pt-6 sm:px-6">
      <header className="mb-7 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Local-first
          </p>
          <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100">Habit Tracker</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Sun size={14} /> : <MoonStar size={14} />}
          </button>

          <nav className="flex items-center gap-0.5 rounded-2xl border border-slate-200 bg-white/70 p-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
            {navItems.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                  view === key
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {view === 'today' && (
          <TodayView
            onOpenHabit={(habitId) => {
              selectHabit(habitId);
              setView('details');
            }}
          />
        )}
        {view === 'details' && <HabitDetailsView />}
        {view === 'settings' && <SettingsView />}
      </main>

      <footer className="mt-8 flex items-center justify-center gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-400 dark:text-slate-500">Made by Azamat Altymyshev</span>
        <span className="text-slate-200 dark:text-slate-700">·</span>
        <span className="text-xs text-slate-300 dark:text-slate-600">⌨ 1 Today · 2 Details · 3 Settings · N New</span>
      </footer>
    </div>
  );
}

export default App;
