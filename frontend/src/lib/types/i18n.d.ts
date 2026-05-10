import "i18next";
import { resources } from "@/lib/i18n/resources";

/**
 * Type definitions for i18next
 * Provides type safety for translation keys
 */

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: "common";
    resources: typeof resources.en;
  }
}
