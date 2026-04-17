import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { queryKeys } from "./queryKeys";

export const useDashboardStats = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(filters),
    queryFn: () => dashboardService.getStats(filters),
  });
};

export const useDashboardStatusOverview = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.dashboard.statusOverview(filters),
    queryFn: () => dashboardService.getStatusOverview(filters),
  });
};

export const useDashboardRecentActivities = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivities(filters),
    queryFn: () => dashboardService.getRecentActivities(filters),
  });
};
