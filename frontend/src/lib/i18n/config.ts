import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources, SupportedLanguage } from './resources';

/**
 * i18n Configuration for Frontend
 * Supports: English (en), Japanese (ja), Vietnamese (vi)
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles i18n initialization
 * - Dependency Inversion: Uses i18next abstraction
 */

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['en', 'ja', 'vi'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

export const LANGUAGE_STORAGE_KEY = 'cr_app_language';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    defaultNS: 'common',
    
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false // React already escapes
    },
    
    react: {
      useSuspense: true
    },
    
    debug: import.meta.env.DEV
  });

export default i18n;
