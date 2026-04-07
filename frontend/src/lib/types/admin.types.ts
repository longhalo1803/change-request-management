/**
 * Admin Dashboard Types
 * Defines all types used in the admin dashboard
 */

export interface StatusBreakdownItem {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ProcessEfficiencyMetrics {
  rejectedRate: number;
  overdueOngoing: number;
  customerCancellation: number;
}

export interface UserManagementStats {
  new30Days: number;
  activeRatio: number;
  customers: number;
  pm: number;
  admin: number;
}

export interface CustomerData {
  name: string;
  crCount: number;
}

export interface MonthlyVolumeTrend {
  month: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface GrowthMetrics {
  comparison: string;
  percentage: number;
}

export interface PriorityAlert {
  description: string;
  value: string;
}

export interface HealthIndexMetrics {
  description: string;
  ratio: string;
}

export interface DashboardStats {
  totalCRs: number;
  statusBreakdown: StatusBreakdownItem[];
  processEfficiency: ProcessEfficiencyMetrics;
  userManagement: UserManagementStats;
  top5Customers: CustomerData[];
  crVolumeTrends: MonthlyVolumeTrend[];
  growthMetrics: GrowthMetrics;
  priorityAlert: PriorityAlert;
  healthIndex: HealthIndexMetrics;
}

export type DateRangeOption =
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "all_time"
  | "custom";

export interface DashboardFilters {
  dateRange: DateRangeOption;
  customer: string;
  pm: string;
}
