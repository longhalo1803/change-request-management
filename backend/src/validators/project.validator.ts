import { z } from "zod";

/**
 * Project Validators
 *
 * Zod schemas for Project and Space request validation
 *
 * SOLID Principles:
 * - Single Responsibility: Only validates project-related requests
 * - Open/Closed: Easy to add new validation schemas
 */

// ===== PROJECT SCHEMAS =====

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "validation.name_min_length")
    .max(255, "validation.name_max_length"),
  description: z
    .string()
    .max(1000, "validation.description_too_long")
    .optional(),
  projectKey: z
    .string()
    .min(3, "validation.key_min_length")
    .max(50, "validation.key_max_length")
    .regex(/^[A-Z0-9_]+$/, "validation.key_format"),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(3, "validation.name_min_length")
    .max(255, "validation.name_max_length")
    .optional(),
  description: z
    .string()
    .max(1000, "validation.description_too_long")
    .optional(),
  projectKey: z
    .string()
    .min(3, "validation.key_min_length")
    .max(50, "validation.key_max_length")
    .regex(/^[A-Z0-9_]+$/, "validation.key_format")
    .optional(),
  isActive: z.boolean().optional(),
});

// ===== SPACE SCHEMAS =====

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(3, "validation.name_min_length")
    .max(255, "validation.name_max_length"),
  description: z
    .string()
    .max(1000, "validation.description_too_long")
    .optional(),
});

export const updateSpaceSchema = z.object({
  name: z
    .string()
    .min(3, "validation.name_min_length")
    .max(255, "validation.name_max_length")
    .optional(),
  description: z
    .string()
    .max(1000, "validation.description_too_long")
    .optional(),
  isActive: z.boolean().optional(),
});

// ===== EXPORT TYPES =====

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>;
