/**
 * Application Configuration
 *
 * Centralized app configuration - Single Source of Truth
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages app config
 * - Open/Closed: Easy to add new config options
 * - DRY: All services import from here instead of hardcoding URLs
 */

// Determine API base URL based on environment
const getApiBaseUrl = (): string => {
  // 1. Check environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 2. Development: Call backend on localhost:8080
  if (import.meta.env.DEV) {
    return "http://localhost:8080/api";
  }

  // 3. Production: Use relative path (handled by reverse proxy)
  return "/api";
};

export const appConfig = {
  // API configuration - Single source of truth for all API calls
  apiBaseUrl: getApiBaseUrl(),
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

// Export for debugging
if (import.meta.env.DEV) {
  console.log("🔧 API Configuration:", {
    apiBaseUrl: appConfig.apiBaseUrl,
    environment: import.meta.env.MODE,
  });
}
