/**
 * Rate Limiter Service
 *
 * Provides in-memory rate limiting for development features.
 * Tracks requests per email address with configurable windows and limits.
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles rate limiting logic
 * - Open/Closed: Easy to extend with new rate limit rules
 */

interface RateLimitEntry {
  count: number;
  resetAt: Date;
  lastAttempt: Date;
}

export interface LimitStatus {
  allowed: boolean;
  remainingTime: number; // seconds
}

export class RateLimiterService {
  private static instance: RateLimiterService;
  private limits = new Map<string, RateLimitEntry>();

  private readonly WINDOW_MS = 60_000; // 1 minute
  private readonly MAX_ATTEMPTS = 1;
  private cleanupIntervalId?: NodeJS.Timeout;

  private constructor() {
    this.startCleanupInterval();
  }

  static getInstance(): RateLimiterService {
    if (!RateLimiterService.instance) {
      RateLimiterService.instance = new RateLimiterService();
    }
    return RateLimiterService.instance;
  }

  /**
   * Check if request is allowed under rate limit
   * @param email Email address
   * @param feature Feature name (e.g., "forgot_password")
   * @returns { allowed: boolean, remainingTime: number }
   */
  checkLimit(email: string, feature: string = "forgot_password"): LimitStatus {
    const key = `${email}:${feature}`;
    const now = new Date();

    const entry = this.limits.get(key);

    if (!entry) {
      // First request in window
      this.limits.set(key, {
        count: 1,
        resetAt: new Date(now.getTime() + this.WINDOW_MS),
        lastAttempt: now,
      });
      return { allowed: true, remainingTime: 0 };
    }

    if (now >= entry.resetAt) {
      // Window expired, reset counter
      entry.count = 1;
      entry.resetAt = new Date(now.getTime() + this.WINDOW_MS);
      entry.lastAttempt = now;
      return { allowed: true, remainingTime: 0 };
    }

    // Still within window
    if (entry.count >= this.MAX_ATTEMPTS) {
      const remainingMs = entry.resetAt.getTime() - now.getTime();
      return {
        allowed: false,
        remainingTime: Math.ceil(remainingMs / 1000), // seconds
      };
    }

    // Increment counter
    entry.count++;
    entry.lastAttempt = now;
    return { allowed: true, remainingTime: 0 };
  }

  /**
   * Manually reset rate limit for an email
   * Called after successful password reset
   */
  reset(email: string, feature: string = "forgot_password"): void {
    const key = `${email}:${feature}`;
    this.limits.delete(key);
  }

  /**
   * Get current limit status without incrementing counter
   */
  getStatus(
    email: string,
    feature: string = "forgot_password"
  ): LimitStatus {
    const key = `${email}:${feature}`;
    const now = new Date();
    const entry = this.limits.get(key);

    if (!entry || now >= entry.resetAt) {
      return { allowed: true, remainingTime: 0 };
    }

    if (entry.count >= this.MAX_ATTEMPTS) {
      const remainingMs = entry.resetAt.getTime() - now.getTime();
      return {
        allowed: false,
        remainingTime: Math.ceil(remainingMs / 1000),
      };
    }

    return { allowed: true, remainingTime: 0 };
  }

  /**
   * Cleanup expired entries
   * Run automatically every 5 minutes
   */
  private startCleanupInterval(): void {
    this.cleanupIntervalId = setInterval(() => {
      const now = new Date();
      const keysToDelete: string[] = [];

      for (const [key, entry] of this.limits.entries()) {
        if (now >= entry.resetAt) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach((key) => this.limits.delete(key));

      if (keysToDelete.length > 0) {
        console.debug(
          `[RateLimiter] Cleaned up ${keysToDelete.length} expired entries`
        );
      }
    }, 5 * 60_000); // 5 minutes
  }

  /**
   * Stop cleanup interval (for testing/graceful shutdown)
   */
  stopCleanupInterval(): void {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
    }
  }

  /**
   * Clear all limits (for testing)
   */
  clear(): void {
    this.limits.clear();
  }
}
