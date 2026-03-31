import { z } from 'zod';

export const createLoginSchema = (messages: Record<string, string>) =>
  z.object({
    email: z
      .string()
      .min(1, messages.email_required || 'Email is required')
      .email(messages.email_invalid || 'Email is invalid'),
    password: z
      .string()
      .min(1, messages.password_required || 'Password is required'),
  });

// Default schema for backwards compatibility
const defaultAuthMessages = {
  email_required: 'Email is required',
  email_invalid: 'Email is invalid',
  password_required: 'Password is required',
};

export const loginSchema = createLoginSchema(defaultAuthMessages);

export type LoginFormData = z.infer<typeof loginSchema>;
