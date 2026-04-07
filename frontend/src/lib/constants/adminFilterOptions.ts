/**
 * UI Constants for Admin Dashboard
 *
 * Contains static configuration for filter options and display options
 */

import type { DateRangeOption } from "@/lib/types/admin.types";

export const DATE_RANGE_OPTIONS: Array<{
  label: string;
  value: DateRangeOption;
}> = [
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Last 90 Days", value: "last_90_days" },
  { label: "All Time", value: "all_time" },
];

export const CUSTOMER_OPTIONS = [
  { label: "All Customers", value: "all" },
  { label: "Customer 1", value: "customer-1" },
  { label: "Customer 2", value: "customer-2" },
  { label: "Customer 3", value: "customer-3" },
  { label: "Customer 4", value: "customer-4" },
  { label: "Customer 5", value: "customer-5" },
  { label: "Customer 6", value: "customer-6" },
  { label: "Customer 7", value: "customer-7" },
];

export const PM_OPTIONS = [
  { label: "All PMs", value: "all" },
  { label: "PM 1", value: "pm-1" },
  { label: "PM 2", value: "pm-2" },
  { label: "PM 3", value: "pm-3" },
  { label: "PM 4", value: "pm-4" },
];
