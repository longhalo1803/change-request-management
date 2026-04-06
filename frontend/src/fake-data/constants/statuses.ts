/**
 * CR Status Definitions and Color Mappings
 */

import { CrStatus } from "@/lib/types";

type Priority = "low" | "medium" | "high" | "critical";

export const CR_STATUS_LABELS: Record<CrStatus, string> = {
  [CrStatus.DRAFT]: "Draft",
  [CrStatus.SUBMITTED]: "Submitted",
  [CrStatus.IN_DISCUSSION]: "In Discussion",
  [CrStatus.APPROVED]: "Approved",
  [CrStatus.REJECTED]: "Rejected",
  [CrStatus.ONGOING]: "On Going",
  [CrStatus.CLOSED]: "Closed",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "#1890ff",
  medium: "#faad14",
  high: "#f5222d",
  critical: "#722ed1",
};

export const STATUS_COLORS: Record<CrStatus, string> = {
  [CrStatus.DRAFT]: "#bfbfbf",
  [CrStatus.SUBMITTED]: "#1890ff",
  [CrStatus.IN_DISCUSSION]: "#faad14",
  [CrStatus.APPROVED]: "#52c41a",
  [CrStatus.REJECTED]: "#f5222d",
  [CrStatus.ONGOING]: "#722ed1",
  [CrStatus.CLOSED]: "#595959",
};

export const STATUS_BG_COLORS: Record<CrStatus, string> = {
  [CrStatus.DRAFT]: "#f5f5f5",
  [CrStatus.SUBMITTED]: "#f0f5ff",
  [CrStatus.IN_DISCUSSION]: "#fffbe6",
  [CrStatus.APPROVED]: "#f6ffed",
  [CrStatus.REJECTED]: "#fff1f0",
  [CrStatus.ONGOING]: "#f9f0ff",
  [CrStatus.CLOSED]: "#fafafa",
};
