/**
 * useDevTools Hook
 *
 * Manages mock email inbox state and auto-refresh polling.
 * Frontend counterpart to dev tools backend service.
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { devToolsService } from "@/services/dev-tools.service";
import { useRef, useEffect, useState, useCallback } from "react";

export interface DevEmailInboxEntry {
  id: string;
  to: string;
  subject: string;
  token: string;
  tokenHash: string;
  expiresAt: string;
  sentAt: string;
}

interface UseDevToolsOptions {
  pollInterval?: number; // milliseconds
  enabled?: boolean;
}

export const useDevTools = (
  email: string | null,
  options: UseDevToolsOptions = {}
) => {
  const { pollInterval: initialPollInterval = 5000, enabled = true } = options;
  const [pollInterval, setPollInterval] = useState<number>(initialPollInterval);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch mock emails
  const {
    data: devEmails = [],
    refetch: refetchEmails,
    isLoading: emailsLoading,
    isError: emailsError,
    error: emailError,
  } = useQuery<DevEmailInboxEntry[]>({
    queryKey: ["devEmails", email],
    queryFn: async () => {
      if (!email || !enabled) return [];
      return devToolsService.getEmails(email);
    },
    enabled: !!email && enabled,
    staleTime: 1000,
    retry: false,
  });

  // Auto-refresh emails with configurable interval
  useEffect(() => {
    if (!email || !enabled || emailsError) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    const poll = () => {
      refetchEmails();
    };

    // Initial refetch
    poll();

    // Set up polling interval
    intervalRef.current = setInterval(poll, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [email, enabled, refetchEmails, pollInterval, emailsError]);

  // Clear inbox mutation
  const clearInbox = useMutation({
    mutationFn: () => devToolsService.clearEmails(email || undefined),
    onSuccess: () => {
      refetchEmails();
    },
  });

  // Get time remaining for email expiration
  const getTimeRemaining = useCallback(
    (expiresAt: string): { minutes: number; seconds: number; isExpired: boolean } => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diffMs = expiry.getTime() - now.getTime();
      const diffSecs = Math.floor(diffMs / 1000);

      if (diffSecs <= 0) {
        return { minutes: 0, seconds: 0, isExpired: true };
      }

      const mins = Math.floor(diffSecs / 60);
      const secs = diffSecs % 60;

      return { minutes: mins, seconds: secs, isExpired: false };
    },
    []
  );

  return {
    devEmails,
    emailsLoading,
    emailsError,
    emailError,
    refetchEmails,
    clearInbox: clearInbox.mutate,
    isClearing: clearInbox.isPending,
    setPollInterval,
    getTimeRemaining,
  };
};
