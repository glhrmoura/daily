import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DayMissedReport } from '@/types/task';
import { formatReportDate } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { MissedItemRow } from './MissedItemRow';

type Props = {
  report: DayMissedReport;
  defaultOpen?: boolean;
  onRemoveItem: (date: string, index: number) => void;
  onRemoveDay: (date: string) => void;
};

export function MissedDaySection({
  report,
  defaultOpen = false,
  onRemoveItem,
  onRemoveDay,
}: Props) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);
  const formattedDate = formatReportDate(report.date, i18n.language);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center gap-1 pr-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-4 text-left"
        >
          <div className="min-w-0">
            <div className="text-base font-bold capitalize">{formattedDate}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {report.items.length}{' '}
              {report.items.length === 1 ? t('report.itemSingular') : t('report.itemPlural')}
            </div>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
              open && 'rotate-180',
            )}
          />
        </button>
        <button
          type="button"
          onClick={() => onRemoveDay(report.date)}
          aria-label={t('report.removeDay', { date: formattedDate })}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2.5 border-t border-border px-4 py-4">
          {report.items.map((item, index) => (
            <MissedItemRow
              key={`${item.taskId}-${index}`}
              item={item}
              onRemove={() => onRemoveItem(report.date, index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
