import { z } from "zod";

export const createCrSchema = (messages: Record<string, string>) =>
  z.object({
    title: z
      .string()
      .min(1, messages.title_required || "Title is required")
      .min(
        5,
        messages.title_min_length || "Title must be at least 5 characters",
      ),
    description: z
      .string()
      .min(1, messages.description_required || "Description is required")
      .min(
        10,
        messages.description_min_length ||
          "Description must be at least 10 characters",
      ),
    priority: z.enum(["low", "medium", "high", "critical"]),
    dueDate: z.string().optional(),
    estimatedHours: z.number().positive().optional(),
  });

// Default schema for backwards compatibility
const defaultCrMessages = {
  title_required: "Title is required",
  title_min_length: "Title must be at least 5 characters",
  description_required: "Description is required",
  description_min_length: "Description must be at least 10 characters",
};

export const changeRequestSchema = createCrSchema(defaultCrMessages);

export type CreateCrFormData = z.infer<ReturnType<typeof createCrSchema>>;

export const createUpdateCrStatusSchema = (messages: Record<string, string>) =>
  z.object({
    status: z.string().min(1, messages.status_required || "Status is required"),
  });

// Default schema for backwards compatibility
export const updateCrStatusSchema = createUpdateCrStatusSchema({
  status_required: "Status is required",
});

export type UpdateCrStatusData = z.infer<typeof updateCrStatusSchema>;
