const SETTINGS_KEY = 'daily_settings_v1';

export const DEFAULT_PRIMARY = '#9a4fec';
export const DEFAULT_LANGUAGE = 'pt-BR';

export type AppLanguage = 'pt-BR' | 'en-US' | 'es-ES';

export type AppSettings = {
  primary: string;
  language: AppLanguage;
};

const LANGUAGES: AppLanguage[] = ['pt-BR', 'en-US', 'es-ES'];

function isLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && LANGUAGES.includes(value as AppLanguage);
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { primary: DEFAULT_PRIMARY, language: DEFAULT_LANGUAGE };

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const primary =
      typeof parsed.primary === 'string' && /^#[0-9a-fA-F]{6}$/.test(parsed.primary)
        ? parsed.primary
        : DEFAULT_PRIMARY;
    const language = isLanguage(parsed.language) ? parsed.language : DEFAULT_LANGUAGE;

    return { primary, language };
  } catch {
    return { primary: DEFAULT_PRIMARY, language: DEFAULT_LANGUAGE };
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function applyPrimaryColor(primary: string) {
  const root = document.documentElement;
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--ring', `${primary}66`);
}
