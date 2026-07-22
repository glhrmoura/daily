const SETTINGS_KEY = 'daily_settings_v1';

export const DEFAULT_PRIMARY = '#9a4fec';

export type AppSettings = {
  primary: string;
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { primary: DEFAULT_PRIMARY };

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const primary =
      typeof parsed.primary === 'string' && /^#[0-9a-fA-F]{6}$/.test(parsed.primary)
        ? parsed.primary
        : DEFAULT_PRIMARY;

    return { primary };
  } catch {
    return { primary: DEFAULT_PRIMARY };
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
