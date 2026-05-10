import { ChangeRequestStatus } from "@/lib/types";

export interface StatusColorConfig {
  color:
    | "default"
    | "blue"
    | "orange"
    | "purple"
    | "green"
    | "processing"
    | "cyan"
    | "red"
    | "gray";
}

/**
 * Status color mappings using Ant Design semantic colors
 * Used for Tag components and UI displays
 */
export const STATUS_COLORS: Record<string, StatusColorConfig> = {
  [ChangeRequestStatus.DRAFT]: { color: "default" },
  [ChangeRequestStatus.SUBMITTED]: { color: "blue" },
  [ChangeRequestStatus.IN_DISCUSSION]: { color: "orange" },
  [ChangeRequestStatus.APPROVED]: { color: "green" },
  [ChangeRequestStatus.REJECTED]: { color: "red" },
  [ChangeRequestStatus.ON_GOING]: { color: "orange" },
  [ChangeRequestStatus.CLOSED]: { color: "default" },
};
