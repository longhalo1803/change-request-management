/**
 * Query Key Factory
 * Centralized query key management for React Query cache invalidation
 * Reference: https://tanstack.com/query/latest/docs/react/important-defaults#query-keys
 */

export const queryKeys = {
  // Change Request Keys
  changeRequests: {
    all: ["changeRequests"] as const,
    lists: () => [...queryKeys.changeRequests.all, "list"] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.changeRequests.lists(), filters] as const,
    details: () => [...queryKeys.changeRequests.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.changeRequests.details(), id] as const,
    bySpace: (spaceId: string) =>
      [...queryKeys.changeRequests.all, "by-space", spaceId] as const,
    assignedToMe: () =>
      [...queryKeys.changeRequests.all, "assigned-to-me"] as const,
    statusHistory: (id: string) =>
      [...queryKeys.changeRequests.all, "status-history", id] as const,
  },

  // Comment Keys
  comments: {
    all: ["comments"] as const,
    lists: () => [...queryKeys.comments.all, "list"] as const,
    list: (crId: string) => [...queryKeys.comments.lists(), crId] as const,
    attachments: () => [...queryKeys.comments.all, "attachments"] as const,
    attachmentsByRequest: (crId: string) =>
      [...queryKeys.comments.attachments(), crId] as const,
  },

  // Project Keys
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    list: () => [...queryKeys.projects.lists()] as const,
    details: () => [...queryKeys.projects.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    spaces: () => [...queryKeys.projects.all, "spaces"] as const,
    spacesForProject: (projectId: string) =>
      [...queryKeys.projects.spaces(), projectId] as const,
    spaceDetail: (id: string) =>
      [...queryKeys.projects.spaces(), "detail", id] as const,
  },

  // Dashboard Keys
  dashboard: {
    all: ["dashboard"] as const,
    stats: (filters?: any) =>
      [...queryKeys.dashboard.all, "stats", filters] as const,
    statusOverview: (filters?: any) =>
      [...queryKeys.dashboard.all, "status-overview", filters] as const,
    recentActivities: (filters?: any) =>
      [...queryKeys.dashboard.all, "recent-activities", filters] as const,
  },
};
