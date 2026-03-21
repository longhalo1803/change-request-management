import 'i18next';

/**
 * Type definitions for i18next
 * Provides type safety for translation keys
 */

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: 'common';
    resources: {
      common: {
        app: {
          name: string;
          description: string;
        };
        auth: {
          login_success: string;
          login_failed: string;
          logout_success: string;
          token_expired: string;
          token_invalid: string;
          unauthorized: string;
        };
        cr: {
          created: string;
          updated: string;
          deleted: string;
          not_found: string;
          status_changed: string;
        };
        errors: {
          internal_server: string;
          bad_request: string;
          not_found: string;
          forbidden: string;
          validation_failed: string;
        };
      };
    };
  }
}
