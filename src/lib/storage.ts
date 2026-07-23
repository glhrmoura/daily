import type { DayMissedReport, MissedItem, Task } from '@/types/task';

const STORAGE_KEY = 'daily_v1';
const LEGACY_TASKS_KEY = 'tasks_v1';
const LEGACY_RESET_KEY = 'tasks_last_reset';
const MAX_MISSED_DAYS = 90;

export type DailyStore = {
  tasks: Task[];
  lastReset: string;
  missed: DayMissedReport[];
};

export function todayKey() {
  return new Date().toDateString();
}

export function dateKeyFromReset(lastReset: string) {
  const date = new Date(lastReset);
  if (Number.isNaN(date.getTime())) return lastReset;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatReportDate(dateKey: string, locale = 'pt-BR') {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(dateKey);

  if (Number.isNaN(date.getTime())) return dateKey;

  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function emptyStore(): DailyStore {
  return { tasks: [], lastReset: todayKey(), missed: [] };
}

function toMissedItem(task: Task): MissedItem {
  return {
    taskId: task.id,
    name: task.name,
    period: task.period,
    notes: task.notes,
    color: task.color,
  };
}

function appendMissedReport(
  missed: DayMissedReport[],
  lastReset: string,
  tasks: Task[],
): DayMissedReport[] {
  if (!lastReset) return missed;

  const incomplete = tasks.filter((task) => !task.checked);
  if (incomplete.length === 0) return missed;

  const date = dateKeyFromReset(lastReset);
  const report: DayMissedReport = {
    date,
    items: incomplete.map(toMissedItem),
  };

  return [report, ...missed.filter((entry) => entry.date !== date)].slice(0, MAX_MISSED_DAYS);
}

function withDailyReset(
  tasks: Task[],
  lastReset: string,
  missed: DayMissedReport[] = [],
): DailyStore {
  const today = todayKey();
  if (lastReset === today) {
    return { tasks, lastReset, missed };
  }

  return {
    tasks: tasks.map((task) => ({ ...task, checked: false })),
    lastReset: today,
    missed: appendMissedReport(missed, lastReset, tasks),
  };
}

function normalizeMissed(value: unknown): DayMissedReport[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => {
      const record = entry as Partial<DayMissedReport>;
      const date = typeof record.date === 'string' ? record.date : '';
      const items = Array.isArray(record.items)
        ? record.items.filter(
            (item) => item && typeof item === 'object' && typeof item.name === 'string',
          )
        : [];
      return { date, items: items as MissedItem[] };
    })
    .filter((entry) => entry.date && entry.items.length > 0);
}

function readLegacyStore(): DailyStore | null {
  try {
    const raw = localStorage.getItem(LEGACY_TASKS_KEY);
    if (!raw) return null;

    const tasks = JSON.parse(raw) as Task[];
    const lastReset = localStorage.getItem(LEGACY_RESET_KEY) ?? '';
    const store = withDailyReset(Array.isArray(tasks) ? tasks : [], lastReset, []);

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
    const missed = normalizeMissed(parsed.missed);
    const store = withDailyReset(tasks, lastReset, missed);
    saveDailyStore(store);
    return store;
  } catch {
    return emptyStore();
  }
}

export function saveDailyStore(store: DailyStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function resetChecksIfNewDay(
  tasks: Task[],
  lastReset: string,
  missed: DayMissedReport[] = [],
) {
  const today = todayKey();
  if (lastReset === today) return null;
  return withDailyReset(tasks, lastReset, missed);
}
