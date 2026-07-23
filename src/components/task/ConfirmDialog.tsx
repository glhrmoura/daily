import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmTone?: 'primary' | 'destructive';
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmTone = 'primary',
  onCancel,
  onConfirm,
}: Props) {
  const { t } = useTranslation();

  if (!open) return null;

  const confirmClass =
    confirmTone === 'destructive'
      ? 'bg-destructive text-destructive-foreground'
      : 'bg-primary text-primary-foreground';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium transition hover:border-border-strong"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition hover:brightness-110 ${confirmClass}`}
          >
            {confirmLabel ?? t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
