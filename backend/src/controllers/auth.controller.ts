import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { loginSchema, refreshTokenSchema } from '@/validators/auth.validator';
import { asyncHandler } from '@/utils/async-handler';
import { sendSuccess } from '@/utils/response';
import { AppError } from '@/utils/app-error';
import { t } from '@/utils/translator';

/**
 * Auth Controller
 * 
 * Handles authentication HTTP requests
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles HTTP request/response for auth
 * - Dependency Inversion: Depends on AuthService abstraction
 */

const authService = new AuthService();

/**
 * POST /api/auth/login
 * Login with email and password
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validatedData = loginSchema.parse(req.body);

  // Perform login
  const result = await authService.login(validatedData);

  // Send response
  const message = t(req.language, 'auth.login_success');
  sendSuccess(res, result, message, 200);
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const { refreshToken } = refreshTokenSchema.parse(req.body);

  // Refresh token
  const result = await authService.refreshToken(refreshToken);

  // Send response
  const message = t(req.language, 'auth.token_refreshed');
  sendSuccess(res, result, message, 200);
});

/**
 * POST /api/auth/logout
 * Logout user (revoke refresh token)
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const { refreshToken } = refreshTokenSchema.parse(req.body);

  // Logout
  await authService.logout(refreshToken);

  // Send response
  const message = t(req.language, 'auth.logout_success');
  sendSuccess(res, null, message, 200);
});

/**
 * GET /api/auth/me
 * Get current user info
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('auth.unauthorized', 401);
  }

  // Get full user details
  const user = await authService.verifyUser(req.user.id);
  if (!user) {
    throw new AppError('auth.user_not_found', 404);
  }

  // Remove password
  const { password: _, ...userWithoutPassword } = user;

  const message = t(req.language, 'auth.user_retrieved');
  sendSuccess(res, userWithoutPassword, message, 200);
});
