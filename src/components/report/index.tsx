import { ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DayMissedReport } from '@/types/task';
import { MissedDaySection } from './components/MissedDaySection';

type Props = {
  missed: DayMissedReport[];
  hydrated: boolean;
  onRemoveItem: (date: string, index: number) => void;
  onRemoveDay: (date: string) => void;
};

export function ReportPage({ missed, hydrated, onRemoveItem, onRemoveDay }: Props) {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-24">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">{t('report.title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('report.description')}</p>
      </header>

      {!hydrated ? null : missed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface/40 p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <h3 className="font-semibold">{t('report.emptyTitle')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t('report.emptyDescription')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missed.map((report, index) => (
            <MissedDaySection
              key={report.date}
              report={report}
              defaultOpen={index === 0}
              onRemoveItem={onRemoveItem}
              onRemoveDay={onRemoveDay}
            />
          ))}
        </div>
      )}
    </div>
  );
}
