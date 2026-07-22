import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Task, Period } from '@/types/task';

type Props = {
  open: boolean;
  initial?: Task | null;
  onClose: () => void;
  onSave: (data: Omit<Task, 'id' | 'checked'>, id?: string) => void;
};

const COLORS = [
  { v: '', label: 'Padrão' },
  { v: '#9a4fec', label: 'Roxo' },
  { v: '#a874ed', label: 'Lilás' },
  { v: '#90b070', label: 'Verde' },
  { v: '#d06070', label: 'Coral' },
  { v: '#6060d0', label: 'Azul' },
  { v: '#f0c040', label: 'Amarelo' },
];

export function TaskForm({ open, initial, onClose, onSave }: Props) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-t-3xl border border-border bg-surface p-6 sm:rounded-3xl animate-in slide-in-from-bottom-4 duration-300"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            {initial ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Nome
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Meditar 10 minutos"
              autoFocus
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Período
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { v: 'morning', label: 'Manhã' },
                  { v: 'afternoon', label: 'Tarde' },
                  { v: 'night', label: 'Noite' },
                ] as const
              ).map((p) => (
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
              Cor <span className="normal-case tracking-normal">(opcional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.v || 'none'}
                  type="button"
                  onClick={() => setColor(c.v)}
                  aria-label={c.label}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    color === c.v
                      ? 'border-foreground scale-110'
                      : 'border-border hover:border-border-strong'
                  }`}
                  style={c.v ? { backgroundColor: c.v } : undefined}
                >
                  {!c.v && <span className="text-xs text-muted-foreground">—</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Observações <span className="normal-case tracking-normal">(opcional)</span>
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
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
