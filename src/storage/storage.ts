import type { AppData, Habit } from "../domain/types";

const STORAGE_KEY = "habit-tracker:data";
const CURRENT_VERSION = 2;

interface PersistedDataV1 {
  version?: 1;
  habits: Habit[];
  completions: Record<string, Record<string, 1>>;
}

interface PersistedDataV2 {
  version: 2;
  habits: Habit[];
  completions: Record<string, Record<string, 1>>;
  settings: AppData["settings"];
}

const defaultData = (): AppData => ({
  version: CURRENT_VERSION,
  habits: [],
  completions: {},
  settings: {
    weekStartsOnMonday: true,
    theme: "dark",
  },
});

const toV2 = (input: PersistedDataV1): PersistedDataV2 => ({
  version: 2,
  habits: (input.habits ?? []).map((habit) => ({
    ...habit,
    archived: habit.archived ?? false,
  })),
  completions: input.completions ?? {},
  settings: {
    weekStartsOnMonday: true,
    theme: "light",
  },
});

const migrate = (raw: unknown): AppData => {
  if (!raw || typeof raw !== "object") {
    return defaultData();
  }

  const data = raw as {
    version?: number;
    habits?: Habit[];
    completions?: Record<string, Record<string, 1>>;
    settings?: AppData["settings"];
  };

  if (!Array.isArray(data.habits) || typeof data.completions !== "object") {
    return defaultData();
  }

  if (data.version === 2 && data.settings) {
    return {
      version: 2,
      habits: data.habits,
      completions: data.completions as Record<string, Record<string, 1>>,
      settings: {
        weekStartsOnMonday: data.settings.weekStartsOnMonday ?? true,
        theme: data.settings.theme ?? "light",
      },
    };
  }

  return toV2({
    version: 1,
    habits: data.habits,
    completions: (data.completions ?? {}) as Record<string, Record<string, 1>>,
  });
};

export const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultData();
    }

    return migrate(JSON.parse(raw));
  } catch {
    return defaultData();
  }
};

export const saveData = (data: AppData): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...data,
      version: CURRENT_VERSION,
    }),
  );
};

export const resetData = (): AppData => {
  const cleared = defaultData();
  saveData(cleared);
  return cleared;
};

export const exportData = (data: AppData): string =>
  JSON.stringify(data, null, 2);

export const importData = (raw: string): AppData => {
  const migrated = migrate(JSON.parse(raw));
  saveData(migrated);
  return migrated;
};
