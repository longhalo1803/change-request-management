/**
 * i18n Translation Resources
 * 
 * Centralized import of all translation files
 * 
 * SOLID Principles:
 * - Single Responsibility: Only manages translation resource imports
 * - Open/Closed: Easy to add new namespaces without modifying structure
 */

import enCommon from '@/locales/en/common.json';
import jaCommon from '@/locales/ja/common.json';
import viCommon from '@/locales/vi/common.json';
import enAuth from '@/locales/en/auth.json';
import jaAuth from '@/locales/ja/auth.json';
import viAuth from '@/locales/vi/auth.json';

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth
  },
  ja: {
    common: jaCommon,
    auth: jaAuth
  },
  vi: {
    common: viCommon,
    auth: viAuth
  }
} as const;

export type TranslationResources = typeof resources;
export type SupportedLanguage = keyof typeof resources;
export type TranslationNamespace = keyof typeof resources.en;
