import { Request, Response, NextFunction } from "express";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  SupportedLanguage,
} from "@/config/i18n";

/**
 * Language Detection Middleware
 *
 * Detects and validates language from:
 * 1. Accept-Language header
 * 2. Query parameter ?lang=
 * 3. Falls back to default language
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles language detection and validation
 * - Interface Segregation: Extends Express Request with language property
 */

declare global {
  namespace Express {
    interface Request {
      language: SupportedLanguage;
    }
  }
}

const parseAcceptLanguage = (header: string): SupportedLanguage => {
  // Parse Accept-Language header (e.g., "ja,en-US;q=0.9,en;q=0.8")
  const languages = header
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";");
      const quality = qValue ? parseFloat(qValue.split("=")[1]) : 1.0;
      return { code: code.split("-")[0].toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of languages) {
    if (SUPPORTED_LANGUAGES.includes(code as SupportedLanguage)) {
      return code as SupportedLanguage;
    }
  }

  return DEFAULT_LANGUAGE;
};

export const languageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Priority 1: Query parameter
  const queryLang = req.query.lang as string;
  if (
    queryLang &&
    SUPPORTED_LANGUAGES.includes(queryLang as SupportedLanguage)
  ) {
    req.language = queryLang as SupportedLanguage;
    return next();
  }

  // Priority 2: Accept-Language header
  const acceptLanguage = req.headers["accept-language"];
  if (acceptLanguage) {
    req.language = parseAcceptLanguage(acceptLanguage);
    return next();
  }

  // Priority 3: Default language
  req.language = DEFAULT_LANGUAGE;
  next();
};
