import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
import { config } from "./env";

/**
 * i18n Configuration for Backend API
 * Supports: English (en), Japanese (ja), Vietnamese (vi)
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles i18n initialization
 * - Open/Closed: Easy to add new languages without modifying core logic
 */

export const SUPPORTED_LANGUAGES = ["en", "ja", "vi"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
export const FALLBACK_LANGUAGE: SupportedLanguage = "en";

export const initializeI18n = async (): Promise<void> => {
  await i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      fallbackLng: FALLBACK_LANGUAGE,
      supportedLngs: [...SUPPORTED_LANGUAGES],
      defaultNS: "common",
      ns: ["common", "errors", "validation"],

      backend: {
        loadPath: path.join(__dirname, "../locales/{{lng}}/{{ns}}.json"),
      },

      detection: {
        order: ["header", "querystring"],
        lookupHeader: "accept-language",
        lookupQuerystring: "lang",
        caches: false,
      },

      interpolation: {
        escapeValue: false, // Not needed for backend
      },

      debug: config.nodeEnv === "development",
    });
};

export const i18nMiddleware = middleware.handle(i18next);

export default i18next;
