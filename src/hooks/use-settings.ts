import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  applyPrimaryColor,
  DEFAULT_LANGUAGE,
  DEFAULT_PRIMARY,
  loadSettings,
  saveSettings,
  type AppLanguage,
  type AppSettings,
} from '@/lib/settings';

export function useSettings() {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<AppSettings>({
    primary: DEFAULT_PRIMARY,
    language: DEFAULT_LANGUAGE,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const next = loadSettings();
    setSettings(next);
    applyPrimaryColor(next.primary);
    void i18n.changeLanguage(next.language);
    document.documentElement.lang = next.language;
    setHydrated(true);
  }, [i18n]);

  useEffect(() => {
    if (!hydrated) return;
    saveSettings(settings);
    applyPrimaryColor(settings.primary);
    void i18n.changeLanguage(settings.language);
    document.documentElement.lang = settings.language;
  }, [settings, hydrated, i18n]);

  const setPrimary = useCallback((primary: string) => {
    setSettings((prev) => ({ ...prev, primary }));
  }, []);

  const setLanguage = useCallback((language: AppLanguage) => {
    setSettings((prev) => ({ ...prev, language }));
  }, []);

  return { settings, hydrated, setPrimary, setLanguage };
}
