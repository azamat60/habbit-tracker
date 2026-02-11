import { useEffect } from 'react';
import { ChartColumn, ListTodo, MoonStar, Settings, Sun } from 'lucide-react';
import { useHabitStore } from './state/store';
import { HabitDetailsView } from './ui/components/HabitDetailsView';
import { SettingsView } from './ui/components/SettingsView';
import { TodayView } from './ui/components/TodayView';
import { Button } from './ui/components/common/Button';

const SEO_BY_VIEW = {
  today: {
    title: 'Habit Tracker - Today Habits and Daily Check-ins',
    description:
      'Mark today habits in one click, stay consistent, and build routines without pressure.',
  },
  details: {
    title: 'Habit Tracker - Habit Analytics, Streaks and Heatmap',
    description:
      'Review streak, best streak, completion rates and 30-day heatmap for each habit.',
  },
  settings: {
    title: 'Habit Tracker - Backup, Restore and Preferences',
    description:
      'Manage habit tracker settings, export/import JSON backup, and configure your local-first workflow.',
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
    if (canonical) {
      canonical.href = window.location.href;
    }
  }, [view]);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) {
        return false;
      }
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key === '1') {
        setView('today');
      } else if (event.key === '2') {
        setView('details');
      } else if (event.key === '3') {
        setView('settings');
      } else if (event.key.toLowerCase() === 'n' && view === 'today') {
        window.dispatchEvent(new CustomEvent('habit:new'));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setView, view]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-7 pt-8 sm:px-6">
      <header className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.09em] text-slate-500 dark:text-slate-400">LocalStorage-first</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Habit Tracker</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Shortcuts: 1 Today, 2 Details, 3 Settings, N New habit, Esc Close modal
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:items-end">
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Sun size={14} /> : <MoonStar size={14} />}
            <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
          </Button>

          <nav className="grid w-full grid-cols-3 gap-2 md:w-auto md:grid-cols-none md:grid-flow-col">
            <Button variant={view === 'today' ? 'tabActive' : 'tabIdle'} onClick={() => setView('today')}>
              <span className="inline-flex items-center gap-1.5">
                <ListTodo size={14} />
                Today
              </span>
            </Button>
            <Button variant={view === 'details' ? 'tabActive' : 'tabIdle'} onClick={() => setView('details')}>
              <span className="inline-flex items-center gap-1.5">
                <ChartColumn size={14} />
                Habit details
              </span>
            </Button>
            <Button variant={view === 'settings' ? 'tabActive' : 'tabIdle'} onClick={() => setView('settings')}>
              <span className="inline-flex items-center gap-1.5">
                <Settings size={14} />
                Settings
              </span>
            </Button>
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

      <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Made by Azamat Altymyshev
      </footer>
    </div>
  );
}

export default App;
