/**
 * Rate Limit Middleware
 *
 * Enforces rate limiting on specific endpoints.
 * Returns 429 (Too Many Requests) with Retry-After header when limit exceeded.
 *
 * Usage:
 * router.post("/forgot-password", rateLimitMiddleware("forgot_password"), handler)
 */

import { Request, Response, NextFunction } from "express";
import { RateLimiterService } from "@/services/rate-limiter.service";
import { asyncHandler } from "@/utils/async-handler";
import { AppError } from "@/utils/app-error";

export const rateLimitMiddleware = (feature: string) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Extract email from request
    const email = req.body.email || req.query.email;

    if (!email || typeof email !== "string") {
      return next();
    }

    const rateLimiter = RateLimiterService.getInstance();
    const { allowed, remainingTime } = rateLimiter.checkLimit(email, feature);

    if (!allowed) {
      // Set Retry-After header for client
      res.set("Retry-After", String(remainingTime));

      // Return 429
      throw new AppError(
        `rate_limit.${feature}_exceeded`,
        429
      );
    }

    next();
  });
};

/**
 * Variant that only checks without throwing
 * Useful for logging or conditional logic
 */
export const checkRateLimit = (feature: string) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email || req.query.email;

    if (!email || typeof email !== "string") {
      return next();
    }

    const rateLimiter = RateLimiterService.getInstance();
    const status = rateLimiter.getStatus(email, feature);

    // Attach to request for use in handler
    (req as any).rateLimit = status;

    next();
  });
};
