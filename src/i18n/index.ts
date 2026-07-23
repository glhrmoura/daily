import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE, loadSettings } from '@/lib/settings';
import enUS from './locales/en-US.json';
import esES from './locales/es-ES.json';
import ptBR from './locales/pt-BR.json';

const initialLanguage = loadSettings().language || DEFAULT_LANGUAGE;

void i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    'en-US': { translation: enUS },
    'es-ES': { translation: esES },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

document.documentElement.lang = initialLanguage;

export default i18n;
