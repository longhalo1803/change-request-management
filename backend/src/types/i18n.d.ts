import "i18next";

/**
 * Type definitions for i18next
 * Provides type safety for translation keys
 */

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: "common";
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
          create_denied: string;
          title_invalid: string;
          title_too_long: string;
          space_not_found: string;
          space_access_denied: string;
          priority_not_found: string;
          worktype_not_found: string;
          sprint_not_found: string;
          status_not_found: string;
          no_files_provided: string;
          upload_denied: string;
          cannot_upload_to_non_draft: string;
          can_only_upload_to_own: string;
          cannot_edit_non_draft: string;
          can_only_edit_own: string;
          update_denied: string;
          delete_denied: string;
          cannot_delete_non_draft: string;
          can_only_delete_own: string;
          submit_denied: string;
          cannot_submit_non_draft: string;
          can_only_submit_own: string;
          comment_denied: string;
          cannot_comment_draft: string;
          comment_empty: string;
          comment_too_long: string;
          comment_not_found: string;
          can_only_delete_own_comment: string;
          comment_content_required: string;
          invalid_transition: string;
          pm_cannot_edit_draft: string;
          forbidden: string;
        };
        errors: {
          internal_server: string;
          bad_request: string;
          not_found: string;
          forbidden: string;
          validation_failed: string;
          unauthorized: string;
          conflict: string;
          unprocessable_entity: string;
          method_not_allowed: string;
          email_already_exists: string;
          invalid_password: string;
          user_not_found: string;
          cr_not_found: string;
          space_not_found: string;
          sprint_not_found: string;
          priority_not_found: string;
          worktype_not_found: string;
          space_access_denied: string;
          no_files_provided: string;
          upload_denied: string;
          cannot_upload_to_non_draft: string;
          can_only_upload_to_own: string;
          invalid_role: string;
          database_error: string;
          file_upload_failed: string;
          invalid_file_type: string;
          file_too_large: string;
        };
      };
    };
  }
}
