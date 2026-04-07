import { z } from "zod";

/**
 * Change Request Validators
 *
 * Zod schemas for CR request validation
 *
 * SOLID Principles:
 * - Single Responsibility: Only validates CR-related requests
 * - Open/Closed: Easy to add new validation schemas
 */

// Create CR Schema - For Customer creating new CR
export const createChangeRequestSchema = z.object({
  title: z
    .string()
    .min(3, "validation.title_min_length")
    .max(255, "validation.title_max_length"),
  description: z
    .string()
    .max(5000, "validation.description_too_long")
    .optional(),
  spaceId: z.string().uuid("validation.invalid_uuid"),
  priorityId: z.string().uuid("validation.invalid_uuid"),
  worktypeId: z.string().uuid("validation.invalid_uuid"),
  sprintId: z.string().uuid("validation.invalid_uuid").optional(),
  estimatedHours: z.number().positive("validation.must_be_positive").optional(),
  dueDate: z.string().datetime("validation.invalid_date").optional(),
});

// Update CR Schema - For Customer updating DRAFT CR
export const updateChangeRequestSchema = z.object({
  title: z
    .string()
    .min(3, "validation.title_min_length")
    .max(255, "validation.title_max_length")
    .optional(),
  description: z
    .string()
    .max(5000, "validation.description_too_long")
    .optional(),
  priorityId: z.string().uuid("validation.invalid_uuid").optional(),
  worktypeId: z.string().uuid("validation.invalid_uuid").optional(),
  sprintId: z.string().uuid("validation.invalid_uuid").optional(),
  estimatedHours: z.number().positive("validation.must_be_positive").optional(),
  dueDate: z.string().datetime("validation.invalid_date").optional(),
});

// Status Transition Schema - For PM/Customer transitioning status
export const statusTransitionSchema = z.object({
  toStatusId: z.string().uuid("validation.invalid_uuid"),
  notes: z.string().max(1000, "validation.notes_too_long").optional(),
});

// Comment Schema - For adding comments
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "validation.comment_required")
    .max(5000, "validation.comment_too_long"),
});

// Search/Filter Schema - For searching CRs
export const searchChangeRequestSchema = z.object({
  search: z.string().max(255, "validation.search_too_long").optional(), // Search by title, description, crKey
  id: z.string().uuid("validation.invalid_uuid").optional(), // Search by exact ID
  name: z.string().max(255, "validation.search_too_long").optional(), // Search by title/name
  statusId: z.string().uuid("validation.invalid_uuid").optional(),
  priorityId: z.string().uuid("validation.invalid_uuid").optional(),
  spaceId: z.string().uuid("validation.invalid_uuid").optional(),
  assignedTo: z.string().uuid("validation.invalid_uuid").optional(),
  parentId: z.string().uuid("validation.invalid_uuid").optional(), // Filter by parent task
  sortBy: z.enum(["createdAt", "priority", "dueDate", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Types (exported for use in services/controllers)
export type CreateChangeRequestDto = z.infer<typeof createChangeRequestSchema>;
export type UpdateChangeRequestDto = z.infer<typeof updateChangeRequestSchema>;
export type StatusTransitionDto = z.infer<typeof statusTransitionSchema>;
export type CreateCommentDto = z.infer<typeof createCommentSchema>;
export type SearchChangeRequestDto = z.infer<typeof searchChangeRequestSchema>;
