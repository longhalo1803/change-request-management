/**
 * Admin Service Mock
 * Provides mock implementations of admin dashboard data
 */

import {
  DashboardStats,
  DateRangeOption,
  DashboardFilters,
} from "@/lib/types/admin.types";
import { ADMIN_DASHBOARD_MOCK_DATA } from "@/fake-data";

/**
 * Simulates fetching dashboard statistics
 * In a real app, this would call an API endpoint
 */
export const fetchDashboardStats = async (
  _filters?: DashboardFilters
): Promise<DashboardStats> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production, filters would be sent to the backend
      // and different data would be returned based on the filters
      resolve(ADMIN_DASHBOARD_MOCK_DATA);
    }, 500);
  });
};

/**
 * Get dashboard stats with date range filter
 */
export const getDashboardStatsByDateRange = async (
  dateRange: DateRangeOption
): Promise<DashboardStats> => {
  return fetchDashboardStats({ dateRange, customer: "all", pm: "all" });
};

/**
 * Get dashboard stats with all filters applied
 */
export const getDashboardStatsFiltered = async (
  dateRange: DateRangeOption,
  customer: string,
  pm: string
): Promise<DashboardStats> => {
  return fetchDashboardStats({ dateRange, customer, pm });
};

/**
 * Export dashboard data as CSV (mock implementation)
 */
export const exportDashboardAsPDF = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production, this would generate a real PDF
      console.log("Dashboard exported as PDF");
      resolve();
    }, 1000);
  });
};
