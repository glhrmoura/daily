import type { Task } from '@/types/task';

const STORAGE_KEY = 'daily_v1';
const LEGACY_TASKS_KEY = 'tasks_v1';
const LEGACY_RESET_KEY = 'tasks_last_reset';

export type DailyStore = {
  tasks: Task[];
  lastReset: string;
};

export function todayKey() {
  return new Date().toDateString();
}

function emptyStore(): DailyStore {
  return { tasks: [], lastReset: todayKey() };
}

function withDailyReset(tasks: Task[], lastReset: string): DailyStore {
  const today = todayKey();
  if (lastReset === today) {
    return { tasks, lastReset };
  }

  return {
    tasks: tasks.map((task) => ({ ...task, checked: false })),
    lastReset: today,
  };
}

function readLegacyStore(): DailyStore | null {
  try {
    const raw = localStorage.getItem(LEGACY_TASKS_KEY);
    if (!raw) return null;

    const tasks = JSON.parse(raw) as Task[];
    const lastReset = localStorage.getItem(LEGACY_RESET_KEY) ?? '';
    const store = withDailyReset(Array.isArray(tasks) ? tasks : [], lastReset);

    saveDailyStore(store);
    localStorage.removeItem(LEGACY_TASKS_KEY);
    localStorage.removeItem(LEGACY_RESET_KEY);

    return store;
  } catch {
    return null;
  }
}

export function loadDailyStore(): DailyStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return readLegacyStore() ?? emptyStore();
    }

    const parsed = JSON.parse(raw) as Partial<DailyStore>;
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
    const lastReset = typeof parsed.lastReset === 'string' ? parsed.lastReset : '';
    const store = withDailyReset(tasks, lastReset);
    saveDailyStore(store);
    return store;
  } catch {
    return emptyStore();
  }
}

export function saveDailyStore(store: DailyStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function resetChecksIfNewDay(tasks: Task[], lastReset: string) {
  const today = todayKey();
  if (lastReset === today) return null;
  return withDailyReset(tasks, lastReset);
}
