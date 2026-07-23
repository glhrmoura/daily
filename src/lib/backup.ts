import type { DayMissedReport, MissedItem, Period, Task } from '@/types/task';
import type { DailyStore } from '@/lib/storage';
import { todayKey } from '@/lib/storage';

const PERIODS = new Set<Period>(['morning', 'afternoon', 'night']);

export type DailyBackup = {
  version: number;
  exportedAt: string;
  tasks: Task[];
  lastReset: string;
  missed: DayMissedReport[];
};

export function createBackup(store: DailyStore): DailyBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: store.tasks,
    lastReset: store.lastReset,
    missed: store.missed,
  };
}

export function downloadBackup(backup: DailyBackup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `daily-backup-${date}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function normalizeTask(value: unknown): Task | null {
  if (!value || typeof value !== 'object') return null;

  const record = value as Partial<Task>;
  if (typeof record.id !== 'string' || typeof record.name !== 'string') return null;
  if (!PERIODS.has(record.period as Period)) return null;

  return {
    id: record.id,
    name: record.name,
    period: record.period as Period,
    checked: Boolean(record.checked),
    notes: typeof record.notes === 'string' ? record.notes : undefined,
    color: typeof record.color === 'string' ? record.color : undefined,
  };
}

function normalizeMissedItem(value: unknown): MissedItem | null {
  if (!value || typeof value !== 'object') return null;

  const record = value as Partial<MissedItem>;
  if (typeof record.name !== 'string') return null;
  if (!PERIODS.has(record.period as Period)) return null;

  return {
    taskId: typeof record.taskId === 'string' ? record.taskId : '',
    name: record.name,
    period: record.period as Period,
    notes: typeof record.notes === 'string' ? record.notes : undefined,
    color: typeof record.color === 'string' ? record.color : undefined,
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
        ? record.items.map(normalizeMissedItem).filter((item): item is MissedItem => item !== null)
        : [];
      return { date, items };
    })
    .filter((entry) => entry.date && entry.items.length > 0);
}

export function parseBackup(raw: string): DailyStore {
  const parsed = JSON.parse(raw) as Partial<DailyBackup> & Partial<DailyStore>;

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('invalid');
  }

  if (!Array.isArray(parsed.tasks)) {
    throw new Error('invalid');
  }

  const tasks = parsed.tasks.map(normalizeTask).filter((task): task is Task => task !== null);
  if (tasks.length !== parsed.tasks.length) {
    throw new Error('invalid');
  }

  return {
    tasks,
    lastReset: typeof parsed.lastReset === 'string' && parsed.lastReset ? parsed.lastReset : todayKey(),
    missed: normalizeMissed(parsed.missed),
  };
}

export async function readBackupFile(file: File): Promise<DailyStore> {
  const raw = await file.text();
  return parseBackup(raw);
}
