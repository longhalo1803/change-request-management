import { useTranslation } from "@/hooks/useTranslation";
import { useMemo } from "react";
import {
  createLoginSchema,
  createCommentSchema,
  createCrSchema,
  createUpdateCrStatusSchema,
} from "@/lib/validators";

export const useValidationMessages = () => {
  const { t } = useTranslation("validation");

  // Return memoized messages object that updates when language changes
  return useMemo(
    () => ({
      // Auth validation messages
      auth: {
        email_required: t("auth.email_required"),
        email_invalid: t("auth.email_invalid"),
        password_required: t("auth.password_required"),
      },
      // Comment validation messages
      comment: {
        content_required: t("comment.content_required"),
        content_min_length: t("comment.content_min_length"),
      },
      // Change Request validation messages
      changeRequest: {
        title_required: t("cr.title_required"),
        title_min_length: t("cr.title_min_length"),
        description_required: t("cr.description_required"),
        description_min_length: t("cr.description_min_length"),
        status_required: t("cr.status_required"),
      },
    }),
    [t],
  );
};

/**
 * Hook to get dynamic schemas with language-aware validation messages
 * Usage in components:
 *
 * const { getLoginSchema, getCommentSchema, getCrSchema } = useValidationSchemas();
 * const loginSchema = getLoginSchema();
 *
 * This ensures validation messages update when language changes
 */
export const useValidationSchemas = () => {
  const { auth, comment, changeRequest } = useValidationMessages();

  return useMemo(
    () => ({
      getLoginSchema: () => createLoginSchema(auth),
      getCommentSchema: () => createCommentSchema(comment),
      getCrSchema: () => createCrSchema(changeRequest),
      getUpdateCrStatusSchema: () => createUpdateCrStatusSchema(changeRequest),
    }),
    [auth, comment, changeRequest],
  );
};
