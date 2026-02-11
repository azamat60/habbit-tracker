import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { downloadJsonFile, readJsonFile } from '../../storage/backup';
import { useHabitStore } from '../../state/store';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Panel } from './common/Panel';

export const SettingsView = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const weekStartsOnMonday = useHabitStore((state) => state.data.settings.weekStartsOnMonday);
  const setWeekStartsOnMonday = useHabitStore((state) => state.setWeekStartsOnMonday);
  const exportJson = useHabitStore((state) => state.exportJson);
  const importJson = useHabitStore((state) => state.importJson);
  const resetAllData = useHabitStore((state) => state.resetAllData);

  const handleExport = () => {
    downloadJsonFile('habit-tracker-backup.json', exportJson());
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const content = await readJsonFile(file);
      importJson(content);
      alert('Import complete.');
    } catch {
      alert('Invalid JSON file.');
    } finally {
      event.target.value = '';
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all habits and completions?')) {
      resetAllData();
    }
  };

  return (
    <Panel>
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Settings</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Local-first data and lightweight controls.</p>
      </div>

      <Card className="mt-3 grid gap-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Calendar</h3>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={weekStartsOnMonday}
            onChange={(event) => setWeekStartsOnMonday(event.target.checked)}
          />
          Week starts on Monday
        </label>
      </Card>

      <Card className="mt-3 grid gap-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Backup</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleExport}>
            <span className="inline-flex items-center gap-1.5">
              <Download size={14} />
              Export JSON
            </span>
          </Button>
          <Button variant="success" onClick={() => inputRef.current?.click()}>
            <span className="inline-flex items-center gap-1.5">
              <Upload size={14} />
              Import JSON
            </span>
          </Button>
        </div>
        <input ref={inputRef} type="file" accept="application/json" hidden onChange={handleImport} />
      </Card>

      <Card tone="danger" className="mt-3 grid gap-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Danger zone</h3>
        <Button variant="danger" onClick={handleReset}>
          <span className="inline-flex items-center gap-1.5">
            <Trash2 size={14} />
            Reset data
          </span>
        </Button>
      </Card>
    </Panel>
  );
};
