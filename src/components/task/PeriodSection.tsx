import type { ReactNode } from 'react';
import type { Task } from '@/types/task';
import { TaskCard } from './TaskCard';

type Props = {
  title: string;
  icon: ReactNode;
  accent: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (m: Task) => void;
  onDelete: (m: Task) => void;
};

export function PeriodSection({ title, icon, accent, tasks, onToggle, onEdit, onDelete }: Props) {
  if (tasks.length === 0) return null;
  const done = tasks.filter((m) => m.checked).length;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-border ${accent}`}
          >
            {icon}
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h2>
        </div>
        <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {done}/{tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {tasks.map((m) => (
          <TaskCard key={m.id} task={m} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}
