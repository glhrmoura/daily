import type { DayMissedReport, MissedItem, Period, Task } from '@/types/task';
import type { DailyStore } from '@/lib/storage';
import { decryptText, encryptText } from '@/lib/backupCrypto';

const PERIODS = new Set<Period>(['morning', 'afternoon', 'night']);
const SUPPORTED_VERSION = 1;
const ENCRYPTED_KIND = 'daily-backup-encrypted';

export type DailyBackup = {
  version: number;
  exportedAt: string;
  tasks: Task[];
  lastReset: string;
  missed: DayMissedReport[];
};

export type EncryptedBackupEnvelope = {
  version: number;
  kind: typeof ENCRYPTED_KIND;
  exportedAt: string;
  salt: string;
  iv: string;
  ciphertext: string;
};

export type BackupInspectResult =
  | { type: 'plain'; store: DailyStore }
  | { type: 'encrypted'; envelope: EncryptedBackupEnvelope };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function createBackup(store: DailyStore): DailyBackup {
  return {
    version: SUPPORTED_VERSION,
    exportedAt: new Date().toISOString(),
    tasks: store.tasks,
    lastReset: store.lastReset,
    missed: store.missed,
  };
}

function downloadJson(payload: unknown, suffix = '') {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `daily-backup${suffix}-${date}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadBackup(backup: DailyBackup) {
  downloadJson(backup);
}

export async function downloadEncryptedBackup(backup: DailyBackup, password: string) {
  const encrypted = await encryptText(JSON.stringify(backup), password);
  const envelope: EncryptedBackupEnvelope = {
    version: SUPPORTED_VERSION,
    kind: ENCRYPTED_KIND,
    exportedAt: backup.exportedAt,
    salt: encrypted.salt,
    iv: encrypted.iv,
    ciphertext: encrypted.ciphertext,
  };
  downloadJson(envelope, '-encrypted');
}

function normalizeTask(value: unknown): Task | null {
  if (!isPlainObject(value)) return null;

  const id = value.id;
  const name = value.name;
  const period = value.period;
  const checked = value.checked;

  if (typeof id !== 'string' || id.trim() === '') return null;
  if (typeof name !== 'string' || name.trim() === '') return null;
  if (!PERIODS.has(period as Period)) return null;
  if (typeof checked !== 'boolean') return null;
  if (value.notes !== undefined && typeof value.notes !== 'string') return null;
  if (value.color !== undefined && typeof value.color !== 'string') return null;

  return {
    id,
    name,
    period: period as Period,
    checked,
    notes: typeof value.notes === 'string' ? value.notes : undefined,
    color: typeof value.color === 'string' ? value.color : undefined,
  };
}

function normalizeMissedItem(value: unknown): MissedItem | null {
  if (!isPlainObject(value)) return null;

  const name = value.name;
  const period = value.period;
  const taskId = value.taskId;

  if (typeof name !== 'string' || name.trim() === '') return null;
  if (!PERIODS.has(period as Period)) return null;
  if (taskId !== undefined && typeof taskId !== 'string') return null;
  if (value.notes !== undefined && typeof value.notes !== 'string') return null;
  if (value.color !== undefined && typeof value.color !== 'string') return null;

  return {
    taskId: typeof taskId === 'string' ? taskId : '',
    name,
    period: period as Period,
    notes: typeof value.notes === 'string' ? value.notes : undefined,
    color: typeof value.color === 'string' ? value.color : undefined,
  };
}

function normalizeMissedReport(value: unknown): DayMissedReport | null {
  if (!isPlainObject(value)) return null;
  if (typeof value.date !== 'string' || value.date.trim() === '') return null;
  if (!Array.isArray(value.items)) return null;

  const items: MissedItem[] = [];
  for (const item of value.items) {
    const normalized = normalizeMissedItem(item);
    if (!normalized) return null;
    items.push(normalized);
  }

  if (items.length === 0) return null;

  return {
    date: value.date,
    items,
  };
}

function hasExpectedShape(value: Record<string, unknown>): value is {
  version: number;
  exportedAt: string;
  lastReset: string;
  tasks: unknown[];
  missed: unknown[];
} {
  return (
    typeof value.version === 'number' &&
    typeof value.exportedAt === 'string' &&
    typeof value.lastReset === 'string' &&
    Array.isArray(value.tasks) &&
    Array.isArray(value.missed)
  );
}

function isEncryptedEnvelope(value: unknown): value is EncryptedBackupEnvelope {
  return (
    isPlainObject(value) &&
    value.kind === ENCRYPTED_KIND &&
    typeof value.version === 'number' &&
    typeof value.exportedAt === 'string' &&
    typeof value.salt === 'string' &&
    typeof value.iv === 'string' &&
    typeof value.ciphertext === 'string' &&
    value.salt.trim() !== '' &&
    value.iv.trim() !== '' &&
    value.ciphertext.trim() !== ''
  );
}

export function parseBackup(raw: string): DailyStore {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('invalid');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error('invalid');
  }

  if (!isPlainObject(parsed) || !hasExpectedShape(parsed)) {
    throw new Error('invalid');
  }

  if (parsed.version !== SUPPORTED_VERSION) {
    throw new Error('invalid');
  }

  if (parsed.exportedAt.trim() === '' || parsed.lastReset.trim() === '') {
    throw new Error('invalid');
  }

  if ('kind' in parsed) {
    throw new Error('invalid');
  }

  const tasks: Task[] = [];
  for (const item of parsed.tasks) {
    const task = normalizeTask(item);
    if (!task) {
      throw new Error('invalid');
    }
    tasks.push(task);
  }

  const missed: DayMissedReport[] = [];
  for (const entry of parsed.missed) {
    const report = normalizeMissedReport(entry);
    if (!report) {
      throw new Error('invalid');
    }
    missed.push(report);
  }

  return {
    tasks,
    lastReset: parsed.lastReset,
    missed,
  };
}

export function inspectBackupRaw(raw: string): BackupInspectResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('invalid');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error('invalid');
  }

  if (isEncryptedEnvelope(parsed)) {
    if (parsed.version !== SUPPORTED_VERSION) {
      throw new Error('invalid');
    }
    return { type: 'encrypted', envelope: parsed };
  }

  return { type: 'plain', store: parseBackup(trimmed) };
}

export async function decryptBackupEnvelope(
  envelope: EncryptedBackupEnvelope,
  password: string,
): Promise<DailyStore> {
  const plain = await decryptText(password, envelope.salt, envelope.iv, envelope.ciphertext);
  return parseBackup(plain);
}

export async function readBackupFile(file: File): Promise<BackupInspectResult> {
  const name = file.name.toLowerCase();
  if (!name.endsWith('.json')) {
    throw new Error('invalid');
  }

  const raw = await file.text();
  return inspectBackupRaw(raw);
}
