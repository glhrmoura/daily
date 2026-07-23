import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import type { Task, Period } from '@/types/task';

type Props = {
  open: boolean;
  initial?: Task | null;
  onClose: () => void;
  onSave: (data: Omit<Task, 'id' | 'checked'>, id?: string) => void;
};

const COLOR_VALUES = ['', '#9a4fec', '#a874ed', '#90b070', '#d06070', '#6060d0', '#f0c040'] as const;

const COLOR_KEYS = [
  'colorDefault',
  'colorPurple',
  'colorLilac',
  'colorGreen',
  'colorCoral',
  'colorBlue',
  'colorYellow',
] as const;

export function TaskForm({ open, initial, onClose, onSave }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [period, setPeriod] = useState<Period>('morning');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setPeriod(initial?.period ?? 'morning');
      setNotes(initial?.notes ?? '');
      setColor(initial?.color ?? '');
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(
      {
        name: name.trim(),
        period,
        notes: notes.trim() || undefined,
        color: color || undefined,
      },
      initial?.id,
    );
    onClose();
  };

  const periods = [
    { v: 'morning' as const, label: t('periods.morning') },
    { v: 'afternoon' as const, label: t('periods.afternoon') },
    { v: 'night' as const, label: t('periods.night') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 animate-in zoom-in-95 duration-200"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            {initial ? t('taskForm.edit') : t('taskForm.new')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label={t('taskForm.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t('taskForm.name')}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('taskForm.namePlaceholder')}
              autoFocus
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t('taskForm.period')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {periods.map((p) => (
                <button
                  key={p.v}
                  type="button"
                  onClick={() => setPeriod(p.v)}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                    period === p.v
                      ? 'border-primary/60 bg-primary/10 text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-border-strong hover:text-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t('taskForm.color')}{' '}
              <span className="normal-case tracking-normal">{t('taskForm.optional')}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_VALUES.map((value, index) => (
                <button
                  key={value || 'none'}
                  type="button"
                  onClick={() => setColor(value)}
                  aria-label={t(`taskForm.${COLOR_KEYS[index]}`)}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    color === value
                      ? 'border-foreground scale-110'
                      : 'border-border hover:border-border-strong'
                  }`}
                  style={value ? { backgroundColor: value } : undefined}
                >
                  {!value && <span className="text-xs text-muted-foreground">—</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t('taskForm.notes')}{' '}
              <span className="normal-case tracking-normal">{t('taskForm.optional')}</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:border-border-strong"
          >
            {t('taskForm.cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            {t('taskForm.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
