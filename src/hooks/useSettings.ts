import { useCallback, useEffect, useState } from 'react';
import {
  applyPrimaryColor,
  DEFAULT_PRIMARY,
  loadSettings,
  saveSettings,
  type AppSettings,
} from '@/lib/settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({ primary: DEFAULT_PRIMARY });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const next = loadSettings();
    setSettings(next);
    applyPrimaryColor(next.primary);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveSettings(settings);
    applyPrimaryColor(settings.primary);
  }, [settings, hydrated]);

  const setPrimary = useCallback((primary: string) => {
    setSettings((prev) => ({ ...prev, primary }));
  }, []);

  return { settings, hydrated, setPrimary };
}
