import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // In development, you might want refetchOnWindowFocus: true to see updates from other tabs
      refetchOnWindowFocus: import.meta.env.DEV,
      retry: 1,
      // Reduce stale time to 1 minute to ensure fresher data
      staleTime: 60 * 1000,
    },
  },
});
