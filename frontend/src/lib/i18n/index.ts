/**
 * i18n Module Exports
 * 
 * Central export point for i18n functionality
 */

export { default as i18n } from './config';
export { resources } from './resources';
export { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE, 
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY 
} from './config';
export type { SupportedLanguage, TranslationNamespace } from './resources';
