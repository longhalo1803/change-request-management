/**
 * Admin-Specific View and Dashboard Data
 * Refactored from mock-data/admin-dashboard.ts
 */

import { DashboardStats } from "@/lib/types/admin.types";
import { FIXED_CHANGE_REQUESTS } from "./change-requests.seed";
import { CrStatus } from "@/lib/types";

/**
 * Calculate dashboard statistics from fixed CRs
 */
const calculateDashboardStats = (): DashboardStats => {
  const allCRs = FIXED_CHANGE_REQUESTS;

  const totalCRs = allCRs.length;
  const totalCRsNonDraft = allCRs.filter(
    (cr) => cr.status !== CrStatus.DRAFT
  ).length;

  // Count by status (with percentages)
  const statusBreakdown = [
    {
      status: "In Discussion",
      count: allCRs.filter((cr) => cr.status === CrStatus.IN_DISCUSSION).length,
      percentage: Math.round(
        (allCRs.filter((cr) => cr.status === CrStatus.IN_DISCUSSION).length /
          totalCRsNonDraft) *
          100
      ),
      color: "#1890FF",
    },
    {
      status: "Approved",
      count: allCRs.filter((cr) => cr.status === CrStatus.APPROVED).length,
      percentage: Math.round(
        (allCRs.filter((cr) => cr.status === CrStatus.APPROVED).length /
          totalCRsNonDraft) *
          100
      ),
      color: "#52C41A",
    },
    {
      status: "Ongoing",
      count: allCRs.filter((cr) => cr.status === CrStatus.ONGOING).length,
      percentage: Math.round(
        (allCRs.filter((cr) => cr.status === CrStatus.ONGOING).length /
          totalCRsNonDraft) *
          100
      ),
      color: "#13C2C2",
    },
    {
      status: "Rejected",
      count: allCRs.filter((cr) => cr.status === CrStatus.REJECTED).length,
      percentage: Math.round(
        (allCRs.filter((cr) => cr.status === CrStatus.REJECTED).length /
          totalCRsNonDraft) *
          100
      ),
      color: "#FF7A45",
    },
    {
      status: "Closed",
      count: allCRs.filter((cr) => cr.status === CrStatus.CLOSED).length,
      percentage: Math.round(
        (allCRs.filter((cr) => cr.status === CrStatus.CLOSED).length /
          totalCRsNonDraft) *
          100
      ),
      color: "#9254DE",
    },
  ];

  return {
    totalCRs,
    statusBreakdown,
    processEfficiency: {
      rejectedRate: Math.round(
        (allCRs.filter((cr) => cr.status === CrStatus.REJECTED).length /
          totalCRsNonDraft) *
          100
      ),
      overdueOngoing: allCRs.filter((cr) => cr.status === CrStatus.ONGOING)
        .length,
      customerCancellation: 0,
    },
    userManagement: {
      new30Days: 0,
      activeRatio: 100,
      customers: 7,
      pm: 4,
      admin: 2,
    },
    top5Customers: [
      { name: "Bùi Khách Hàng 1", crCount: 5 },
      { name: "Đỗ Khách Hàng 2", crCount: 4 },
      { name: "Hồ Khách Hàng 3", crCount: 4 },
      { name: "Tạ Khách Hàng 4", crCount: 3 },
      { name: "Tô Khách Hàng 5", crCount: 2 },
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
};

/**
 * Admin dashboard data
 */
export const ADMIN_DASHBOARD_MOCK_DATA = calculateDashboardStats();

/**
 * Admin can see ALL CRs including Drafts
 */
export const ADMIN_VIEW_CRS = FIXED_CHANGE_REQUESTS;

/**
 * Filter options for admin dashboard
 */
export const DATE_RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Last 90 Days", value: "last_90_days" },
  { label: "Custom", value: "custom" },
];

export const CUSTOMER_OPTIONS = [
  { label: "All Customers", value: "all" },
  { label: "Bùi Khách Hàng 1", value: "customer-1" },
  { label: "Đỗ Khách Hàng 2", value: "customer-2" },
  { label: "Hồ Khách Hàng 3", value: "customer-3" },
  { label: "Tạ Khách Hàng 4", value: "customer-4" },
  { label: "Tô Khách Hàng 5", value: "customer-5" },
  { label: "Dương Khách Hàng 6", value: "customer-6" },
  { label: "Lê Khách Hàng 7", value: "customer-7" },
];

export const PM_OPTIONS = [
  { label: "All PMs", value: "all" },
  { label: "Phạm Dự Án A", value: "pm-1" },
  { label: "Hoàng Dự Án B", value: "pm-2" },
  { label: "Vũ Dự Án C", value: "pm-3" },
  { label: "Đặng Dự Án D", value: "pm-4" },
];
