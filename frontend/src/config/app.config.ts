/**
 * Application Configuration
 *
 * Centralized app configuration
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages app config
 * - Open/Closed: Easy to add new config options
 */

export const appConfig = {
  // Use mock services when backend is not available
  useMockServices: import.meta.env.VITE_USE_MOCK === "true" || true, // Default to true for demo

  // API configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  apiTimeout: 30000,

  // Auth configuration
  tokenStorageKey: "cr_app_tokens",

  // Feature flags
  features: {
    enableNotifications: false,
    enableFileUpload: false,
    enableComments: false,
  },
} as const;
