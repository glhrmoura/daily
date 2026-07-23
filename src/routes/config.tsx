import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { ConfigPage } from '@/components/config';
import { useSettings } from '@/hooks/useSettings';
import { useTasks } from '@/hooks/useTasks';

export const Route = createFileRoute('/config')({
  component: Config,
});

function Config() {
  const { settings, setPrimary, setLanguage } = useSettings();
  const { getStore, replaceStore } = useTasks();

  return (
    <div className="bg-background">
      <Header />
      <ConfigPage
        primary={settings.primary}
        language={settings.language}
        onPrimaryChange={setPrimary}
        onLanguageChange={setLanguage}
        getStore={getStore}
        onImportStore={replaceStore}
      />
    </div>
  );
}
