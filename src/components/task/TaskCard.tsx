import { Check, Pencil, Trash2 } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import type { Task } from '@/types/task';
import { cn } from '@/lib/utils';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (m: Task) => void;
  onDelete: (m: Task) => void;
};

export function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const { checked } = task;

  const toggle = () => onToggle(task.id);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={onKeyDown}
      aria-pressed={checked}
      aria-label={checked ? `Desmarcar ${task.name}` : `Marcar ${task.name} como concluída`}
      className={cn(
        'group relative flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300',
        checked
          ? 'border-primary/50 bg-primary/5'
          : 'border-border bg-card hover:border-border-strong',
      )}
      style={task.color && !checked ? { borderColor: task.color + '80' } : undefined}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300',
          checked
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border-strong bg-surface text-transparent group-hover:border-primary/60',
        )}
      >
        <Check
          className={cn(
            'h-4 w-4 transition-all duration-300',
            checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
          )}
          strokeWidth={3}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'truncate font-medium transition-all',
            checked && 'text-muted-foreground line-through',
          )}
        >
          {task.name}
        </div>
        {task.notes && (
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{task.notes}</div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
          aria-label="Editar"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
          aria-label="Excluir"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
