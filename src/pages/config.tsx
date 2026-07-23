import { createFileRoute } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { ConfigPage as ConfigSettings } from '@/components/config';
import { useSettings } from '@/hooks/use-settings';
import { useTasks } from '@/hooks/use-tasks';

export const Route = createFileRoute('/config')({
  component: ConfigPage,
});

function ConfigPage() {
  const { settings, setPrimary, setLanguage } = useSettings();
  const { getStore, replaceStore } = useTasks();

  return (
    <div className="bg-background">
      <Header />
      <ConfigSettings
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
