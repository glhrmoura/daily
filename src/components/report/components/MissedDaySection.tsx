import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { DayMissedReport } from '@/types/task';
import { formatReportDate } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { MissedItemRow } from './MissedItemRow';

type Props = {
  report: DayMissedReport;
  defaultOpen?: boolean;
};

export function MissedDaySection({ report, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-accent/40"
      >
        <div>
          <div className="text-sm font-semibold capitalize">{formatReportDate(report.date)}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {report.items.length}{' '}
            {report.items.length === 1 ? 'item não concluído' : 'itens não concluídos'}
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="space-y-2.5 border-t border-border px-4 py-4">
          {report.items.map((item, index) => (
            <MissedItemRow key={`${item.taskId}-${index}`} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
