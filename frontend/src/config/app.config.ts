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
  useMockServices: import.meta.env.VITE_USE_MOCK === "true", // Default to false - use real API

  // API configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
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
