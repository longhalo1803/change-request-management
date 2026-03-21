import { z } from 'zod';

/**
 * Auth Validators
 * 
 * Zod schemas for authentication request validation
 * 
 * SOLID Principles:
 * - Single Responsibility: Only validates auth-related requests
 * - Open/Closed: Easy to add new validation schemas
 */

export const loginSchema = z.object({
  email: z
    .string()
    .email('validation.invalid_email')
    .min(1, 'validation.required'),
  password: z
    .string()
    .min(8, 'validation.min_length')
    .max(100, 'validation.max_length')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'validation.required')
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
