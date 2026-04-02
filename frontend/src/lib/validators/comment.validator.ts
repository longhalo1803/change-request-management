import { z } from "zod";

export const createCommentSchema = (messages: Record<string, string>) =>
  z.object({
    content: z
      .string()
      .min(1, messages.content_required || "Comment content is required")
      .min(
        2,
        messages.content_min_length || "Content must be at least 2 characters",
      ),
    visibility: z.enum(["public", "internal", "pm_only"]),
  });

// Default schema for backwards compatibility
const defaultCommentMessages = {
  content_required: "Comment content is required",
  content_min_length: "Content must be at least 2 characters",
};

export const commentSchema = createCommentSchema(defaultCommentMessages);

export type CommentFormData = z.infer<typeof commentSchema>;
