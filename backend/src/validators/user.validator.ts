import { z } from "zod";
import { UserRole } from "@/entities/user.entity";

/**
 * User Validators
 *
 * Zod schemas for user management request validation
 */

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(255, "First name must be at most 255 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(255, "Last name must be at most 255 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Invalid role. Must be admin, pm, or customer" }),
  }),
  phone: z
    .string()
    .regex(/^[0-9\s\-+()]*$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(255)
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(255)
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.nativeEnum(UserRole).optional(),
  phone: z
    .string()
    .regex(/^[0-9\s\-+()]*$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({
      message: "Invalid status. Must be 'active' or 'inactive'",
    }),
  }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusDto = z.infer<typeof updateUserStatusSchema>;
