import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { ReportPage } from '@/components/report';
import { useTasks } from '@/hooks/useTasks';

export const Route = createFileRoute('/relatorio')({
  component: Relatorio,
});

function Relatorio() {
  const { missed, hydrated, removeMissedItem, removeMissedDay } = useTasks();

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <ReportPage
        missed={missed}
        hydrated={hydrated}
        onRemoveItem={removeMissedItem}
        onRemoveDay={removeMissedDay}
      />
    </div>
  );
}
