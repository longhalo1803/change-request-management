/**
 * useRateLimit Hook
 *
 * Manages client-side rate limit countdown state.
 * Persists to localStorage to survive page refreshes.
 */

import { useState, useEffect, useCallback } from "react";

export interface RateLimitState {
  remainingSeconds: number;
  isLimited: boolean;
  resetAt: Date | null;
}

/**
 * Custom hook for managing rate limit state
 * @param key Unique key for rate limit (e.g., "email:forgot_password")
 * @param windowMs Rate limit window in milliseconds
 */
export const useRateLimit = (key: string, windowMs: number = 60_000) => {
  const [state, setState] = useState<RateLimitState>({
    remainingSeconds: 0,
    isLimited: false,
    resetAt: null,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const storageKey = `rateLimit:${key}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const { resetAt } = JSON.parse(stored);
        const now = Date.now();
        const remaining = new Date(resetAt).getTime() - now;

        if (remaining > 0) {
          const remainingSeconds = Math.ceil(remaining / 1000);

          setState({
            isLimited: true,
            remainingSeconds,
            resetAt: new Date(resetAt),
          });
        } else {
          // Expired, clean up
          localStorage.removeItem(storageKey);
          setState({
            isLimited: false,
            remainingSeconds: 0,
            resetAt: null,
          });
        }
      } catch (error) {
        console.error("Failed to parse rate limit state from localStorage", error);
        localStorage.removeItem(storageKey);
      }
    }
  }, [key]);

  // Countdown timer
  useEffect(() => {
    if (!state.isLimited) {
      return;
    }

    const timer = setInterval(() => {
      setState((prev) => {
        if (!prev.isLimited) {
          return prev;
        }

        const newRemaining = prev.remainingSeconds - 1;

        if (newRemaining <= 0) {
          const storageKey = `rateLimit:${key}`;
          localStorage.removeItem(storageKey);

          return {
            isLimited: false,
            remainingSeconds: 0,
            resetAt: null,
          };
        }

        return {
          ...prev,
          remainingSeconds: newRemaining,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isLimited, key]);

  /**
   * Set rate limit from server error response
   * @param remainingSeconds Time in seconds before reset
   */
  const setLimit = useCallback(
    (remainingSeconds: number) => {
      const resetAt = new Date(Date.now() + remainingSeconds * 1000);
      const storageKey = `rateLimit:${key}`;

      localStorage.setItem(
        storageKey,
        JSON.stringify({ resetAt: resetAt.toISOString() })
      );

      setState({
        isLimited: true,
        remainingSeconds,
        resetAt,
      });
    },
    [key]
  );

  /**
   * Manually clear the rate limit
   */
  const clear = useCallback(() => {
    const storageKey = `rateLimit:${key}`;
    localStorage.removeItem(storageKey);

    setState({
      isLimited: false,
      remainingSeconds: 0,
      resetAt: null,
    });
  }, [key]);

  return {
    ...state,
    setLimit,
    clear,
  };
};
