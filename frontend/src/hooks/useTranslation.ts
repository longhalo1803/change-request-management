import { useTranslation as useI18nextTranslation } from 'react-i18next';
import type { TranslationNamespace } from '@/lib/i18n/resources';

/**
 * Typed Translation Hook
 * 
 * Wrapper around react-i18next's useTranslation with type safety
 * 
 * SOLID Principles:
 * - Single Responsibility: Only provides translation functionality
 * - Liskov Substitution: Can replace useTranslation from react-i18next
 */

export const useTranslation = (namespace: TranslationNamespace = 'common') => {
  const { t, i18n } = useI18nextTranslation(namespace);

  return {
    t,
    i18n,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage
  };
};

export default useTranslation;
