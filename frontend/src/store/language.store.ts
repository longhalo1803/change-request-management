import { create } from "zustand";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/config";
import type { SupportedLanguage } from "@/lib/i18n/resources";
import i18n from "@/lib/i18n/config";

interface LanguageState {
  currentLanguage: SupportedLanguage;
}

interface LanguageActions {
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  resetLanguage: () => Promise<void>;
}

type LanguageStore = LanguageState & LanguageActions;

export const useLanguageStore = create<LanguageStore>()((set) => ({
  currentLanguage: (i18n.resolvedLanguage ||
    i18n.language ||
    DEFAULT_LANGUAGE) as SupportedLanguage,

  setLanguage: async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
    set({ currentLanguage: language });
    document.documentElement.lang = language;
  },

  resetLanguage: async () => {
    await i18n.changeLanguage(DEFAULT_LANGUAGE);
    set({ currentLanguage: DEFAULT_LANGUAGE });
    document.documentElement.lang = DEFAULT_LANGUAGE;
  },
}));

i18n.on("languageChanged", (lng) => {
  useLanguageStore.setState({ currentLanguage: lng as SupportedLanguage });
  document.documentElement.lang = lng;
});

export const selectCurrentLanguage = (state: LanguageStore) =>
  state.currentLanguage;
