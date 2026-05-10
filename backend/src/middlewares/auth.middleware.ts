import { Request, Response, NextFunction } from "express";
import { TokenService } from "@/services/token.service";
import { AuthService } from "@/services/auth.service";
import { AppError } from "@/utils/app-error";
import { asyncHandler } from "@/utils/async-handler";
import { UserRole } from "@/entities/user.entity";

/**
 * Auth Middleware
 *
 * Verifies JWT tokens and protects routes
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles authentication verification
 * - Open/Closed: Easy to extend with new auth strategies
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

const tokenService = new TokenService();
const authService = new AuthService();

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("auth.token_missing", 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify token
      const payload = tokenService.verifyAccessToken(token);

      // Verify user still exists and is active
      const user = await authService.verifyUser(payload.userId);
      if (!user) {
        throw new AppError("auth.user_not_found", 401);
      }

      // Attach user to request
      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("auth.token_invalid", 401);
    }
  }
);

/**
 * Authorize specific roles
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new AppError("auth.unauthorized", 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError("auth.forbidden", 403);
      }

      next();
    }
  );
};

/**
 * Aliases for convenience
 */
export const requireAuth = authenticate;

export const requireRole = (roles: UserRole[]) => {
  return authorize(...roles);
};
