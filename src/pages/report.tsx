import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { ReportPage as ReportContent } from '@/components/report';
import { useTasks } from '@/hooks/use-tasks';

export const Route = createFileRoute('/report')({
  component: ReportPage,
});

function ReportPage() {
  const { missed, hydrated, removeMissedItem, removeMissedDay } = useTasks();

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <ReportContent
        missed={missed}
        hydrated={hydrated}
        onRemoveItem={removeMissedItem}
        onRemoveDay={removeMissedDay}
      />
    </div>
  );
}
