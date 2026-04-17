import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import type { DashboardFilters } from "@/lib/types/admin.types";

export const adminKeys = {
  all: ["admin"] as const,
  stats: (filters: DashboardFilters) =>
    [...adminKeys.all, "stats", filters] as const,
  topCustomers: (filters: DashboardFilters) =>
    [...adminKeys.all, "topCustomers", filters] as const,
  volumeTrends: (filters: DashboardFilters) =>
    [...adminKeys.all, "volumeTrends", filters] as const,
};

export function useComprehensiveStats(filters: DashboardFilters) {
  return useQuery({
    queryKey: adminKeys.stats(filters),
    queryFn: () => adminService.getComprehensiveStats(filters),
  });
}

export function useTopCustomers(filters: DashboardFilters) {
  return useQuery({
    queryKey: adminKeys.topCustomers(filters),
    queryFn: () => adminService.getTopCustomers(filters),
  });
}

export function useVolumeTrends(filters: DashboardFilters) {
  return useQuery({
    queryKey: adminKeys.volumeTrends(filters),
    queryFn: () => adminService.getVolumeTrends(filters),
  });
}
