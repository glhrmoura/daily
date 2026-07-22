import type { MissedItem } from '@/types/task';
import { PERIOD_LABELS } from '../utils/period';

type Props = {
  item: MissedItem;
};

export function MissedItemRow({ item }: Props) {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-4"
      style={item.color ? { borderColor: `${item.color}80` } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-medium">{item.name}</div>
          {item.notes && (
            <div className="mt-0.5 text-xs text-muted-foreground">{item.notes}</div>
          )}
        </div>
        <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {PERIOD_LABELS[item.period]}
        </span>
      </div>
    </div>
  );
}
