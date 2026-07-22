import { Trash2 } from 'lucide-react';
import type { MissedItem } from '@/types/task';
import { PERIOD_LABELS } from '../utils/period';

type Props = {
  item: MissedItem;
  onRemove: () => void;
};

export function MissedItemRow({ item, onRemove }: Props) {
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
        <div className="flex shrink-0 items-center gap-1">
          <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {PERIOD_LABELS[item.period]}
          </span>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${item.name}`}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
