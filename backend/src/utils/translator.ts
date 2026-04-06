import i18next, { TFunction } from "i18next";
import { SupportedLanguage } from "@/config/i18n";

/**
 * Translation Utility
 *
 * Provides type-safe translation functions for backend services
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles translation logic
 * - Dependency Inversion: Depends on i18next abstraction, not concrete implementation
 */

export class Translator {
  private t: TFunction;

  constructor(language: SupportedLanguage, namespace: string = "common") {
    this.t = i18next.getFixedT(language, namespace as any);
  }

  /**
   * Translate a key with optional interpolation
   */
  translate(key: string, options?: Record<string, unknown>): string {
    return this.t(key, options as any) as string;
  }

  /**
   * Translate with fallback
   */
  translateWithFallback(
    key: string,
    fallback: string,
    options?: Record<string, unknown>
  ): string {
    const result = this.t(key, options as any) as string;
    return result === key ? fallback : result;
  }

  /**
   * Check if translation key exists
   */
  exists(key: string): boolean {
    return i18next.exists(key);
  }
}

/**
 * Factory function to create translator instance
 */
export const createTranslator = (
  language: SupportedLanguage,
  namespace?: string
): Translator => {
  return new Translator(language, namespace);
};

/**
 * Quick translation helper for controllers
 */
export const t = (
  language: string,
  key: string,
  options?: Record<string, unknown>
): string => {
  return i18next.t(key, {
    lng: language as SupportedLanguage,
    ...options,
  } as any) as string;
};
