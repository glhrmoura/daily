import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { ConfigPage } from '@/components/config';
import { useSettings } from '@/hooks/useSettings';

export const Route = createFileRoute('/config')({
  component: Config,
});

function Config() {
  const { settings, setPrimary } = useSettings();

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <ConfigPage primary={settings.primary} onPrimaryChange={setPrimary} />
    </div>
  );
}
