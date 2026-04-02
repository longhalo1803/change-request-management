/**
 * Mock data for Admin Dashboard
 * Contains fake data matching the design specifications
 */

import { DashboardStats } from "@/lib/types/admin.types";

export const ADMIN_DASHBOARD_MOCK_DATA: DashboardStats = {
  totalCRs: 20,
  statusBreakdown: [
    {
      status: "In Discussion",
      count: 5,
      percentage: 25,
      color: "#1890FF",
    },
    {
      status: "Approved",
      count: 4,
      percentage: 20,
      color: "#52C41A",
    },
    {
      status: "Ongoing",
      count: 5,
      percentage: 25,
      color: "#13C2C2",
    },
    {
      status: "Rejected",
      count: 2,
      percentage: 10,
      color: "#FF7A45",
    },
    {
      status: "Closed",
      count: 2,
      percentage: 10,
      color: "#9254DE",
    },
  ],
  processEfficiency: {
    rejectedRate: 8,
    overdueOngoing: 2,
    customerCancellation: 5,
  },
  userManagement: {
    new30Days: 3,
    activeRatio: 100,
    customers: 15,
    pm: 5,
    admin: 2,
  },
  top5Customers: [
    { name: "Customer A", crCount: 42 },
    { name: "Customer B", crCount: 36 },
    { name: "Customer C", crCount: 29 },
    { name: "Customer D", crCount: 21 },
    { name: "Customer E", crCount: 14 },
  ],
  crVolumeTrends: [
    {
      month: "JAN",
      critical: 2,
      high: 3,
      medium: 4,
      low: 4,
      total: 13,
    },
    {
      month: "FEB",
      critical: 3,
      high: 4,
      medium: 6,
      low: 8,
      total: 21,
    },
    {
      month: "MAR",
      critical: 3,
      high: 5,
      medium: 6,
      low: 9,
      total: 23,
    },
    {
      month: "APR",
      critical: 4,
      high: 4,
      medium: 8,
      low: 7,
      total: 23,
    },
    {
      month: "MAY",
      critical: 4,
      high: 6,
      medium: 6,
      low: 8,
      total: 24,
    },
    {
      month: "JUN",
      critical: 5,
      high: 7,
      medium: 10,
      low: 10,
      total: 32,
    },
    {
      month: "JUL",
      critical: 7,
      high: 7,
      medium: 9,
      low: 8,
      total: 31,
    },
    {
      month: "AUG",
      critical: 3,
      high: 5,
      medium: 6,
      low: 9,
      total: 23,
    },
    {
      month: "SEP",
      critical: 4,
      high: 6,
      medium: 7,
      low: 8,
      total: 25,
    },
    {
      month: "OCT",
      critical: 4,
      high: 4,
      medium: 8,
      low: 8,
      total: 24,
    },
    {
      month: "NOV",
      critical: 3,
      high: 3,
      medium: 7,
      low: 8,
      total: 21,
    },
    {
      month: "DEC",
      critical: 4,
      high: 4,
      medium: 6,
      low: 7,
      total: 21,
    },
  ],
  growthMetrics: {
    comparison: "Comparison with previous year",
    percentage: 14,
  },
  priorityAlert: {
    description: "Annual Critical volume",
    value: "+12%",
  },
  healthIndex: {
    description: "Overall Critical Ratio",
    ratio: "18%",
  },
};

export const DATE_RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Last 90 Days", value: "last_90_days" },
  { label: "Custom", value: "custom" },
];

export const CUSTOMER_OPTIONS = [
  { label: "All Customers", value: "all" },
  { label: "Customer A", value: "customer_a" },
  { label: "Customer B", value: "customer_b" },
  { label: "Customer C", value: "customer_c" },
  { label: "Customer D", value: "customer_d" },
  { label: "Customer E", value: "customer_e" },
];

export const PM_OPTIONS = [
  { label: "All PMs", value: "all" },
  { label: "PM 1", value: "pm_1" },
  { label: "PM 2", value: "pm_2" },
  { label: "PM 3", value: "pm_3" },
  { label: "PM 4", value: "pm_4" },
  { label: "PM 5", value: "pm_5" },
];
