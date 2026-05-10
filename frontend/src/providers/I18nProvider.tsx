import { ReactNode, useEffect } from "react";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import jaJP from "antd/locale/ja_JP";
import viVN from "antd/locale/vi_VN";
import {
  useLanguageStore,
  selectCurrentLanguage,
} from "@/store/language.store";
import type { SupportedLanguage } from "@/lib/i18n/resources";

/**
 * i18n Provider Component
 *
 * Synchronizes language state with Ant Design locale
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles i18n provider logic
 * - Dependency Inversion: Depends on language store abstraction
 */

interface I18nProviderProps {
  children: ReactNode;
}

const antdLocaleMap = {
  en: enUS,
  ja: jaJP,
  vi: viVN,
} as const;

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const currentLanguage = useLanguageStore(selectCurrentLanguage);

  useEffect(() => {
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const antdLocale =
    antdLocaleMap[currentLanguage as SupportedLanguage] || enUS;

  return <ConfigProvider locale={antdLocale}>{children}</ConfigProvider>;
};

export default I18nProvider;
