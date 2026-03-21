import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SupportedLanguage, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '@/lib/i18n/config';
import i18n from '@/lib/i18n/config';

/**
 * Language State Management
 * 
 * Manages current language selection and persistence
 * 
 * SOLID Principles:
 * - Single Responsibility: Only manages language state
 * - Interface Segregation: Minimal interface with only necessary methods
 */

interface LanguageState {
  currentLanguage: SupportedLanguage;
}

interface LanguageActions {
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  resetLanguage: () => Promise<void>;
}

type LanguageStore = LanguageState & LanguageActions;

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      // State
      currentLanguage: DEFAULT_LANGUAGE,

      // Actions
      setLanguage: async (language: SupportedLanguage) => {
        await i18n.changeLanguage(language);
        set({ currentLanguage: language });
        
        // Update HTML lang attribute for accessibility
        document.documentElement.lang = language;
        
        // Update Ant Design locale if needed
        // This will be handled in the I18nProvider
      },

      resetLanguage: async () => {
        await i18n.changeLanguage(DEFAULT_LANGUAGE);
        set({ currentLanguage: DEFAULT_LANGUAGE });
        document.documentElement.lang = DEFAULT_LANGUAGE;
      }
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      partialize: (state) => ({ currentLanguage: state.currentLanguage })
    }
  )
);

// Selectors
export const selectCurrentLanguage = (state: LanguageStore) => state.currentLanguage;
