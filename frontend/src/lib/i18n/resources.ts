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
import enDashboard from '@/locales/en/dashboard.json';
import jaDashboard from '@/locales/ja/dashboard.json';
import viDashboard from '@/locales/vi/dashboard.json';
import enCrList from '@/locales/en/cr-list.json';
import jaCrList from '@/locales/ja/cr-list.json';
import viCrList from '@/locales/vi/cr-list.json';
import enProfile from '@/locales/en/profile.json';
import jaProfile from '@/locales/ja/profile.json';
import viProfile from '@/locales/vi/profile.json';
import enQuotation from '@/locales/en/quotation.json';
import jaQuotation from '@/locales/ja/quotation.json';
import viQuotation from '@/locales/vi/quotation.json';
import enAdmin from '@/locales/en/admin.json';
import jaAdmin from '@/locales/ja/admin.json';
import viAdmin from '@/locales/vi/admin.json';
import enValidation from '@/locales/en/validation.json';
import jaValidation from '@/locales/ja/validation.json';
import viValidation from '@/locales/vi/validation.json';

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    'cr-list': enCrList,
    profile: enProfile,
    quotation: enQuotation,
    admin: enAdmin,
    validation: enValidation
  },
  ja: {
    common: jaCommon,
    auth: jaAuth,
    dashboard: jaDashboard,
    'cr-list': jaCrList,
    profile: jaProfile,
    quotation: jaQuotation,
    admin: jaAdmin,
    validation: jaValidation
  },
  vi: {
    common: viCommon,
    auth: viAuth,
    dashboard: viDashboard,
    'cr-list': viCrList,
    profile: viProfile,
    quotation: viQuotation,
    admin: viAdmin,
    validation: viValidation
  }
} as const;

export type TranslationResources = typeof resources;
export type SupportedLanguage = keyof typeof resources;
export type TranslationNamespace = keyof typeof resources.en;
