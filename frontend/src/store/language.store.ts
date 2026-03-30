import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '@/lib/i18n/config';
import type { SupportedLanguage } from '@/lib/i18n/resources';
import i18n from '@/lib/i18n/config';

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
      currentLanguage: DEFAULT_LANGUAGE,

      setLanguage: async (language: SupportedLanguage) => {
        await i18n.changeLanguage(language);
        set({ currentLanguage: language });
        document.documentElement.lang = language;
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

export const selectCurrentLanguage = (state: LanguageStore) => state.currentLanguage;

