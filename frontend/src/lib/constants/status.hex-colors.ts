import { ChangeRequestStatus } from "@/lib/types";

export interface StatusHexColorConfig {
  hex: string;
  hexLight: string;
}

/**
 * Status hex color mappings
 * Includes both solid hex colors and light background colors for Kanban columns
 */
export const STATUS_HEX_COLORS: Record<string, StatusHexColorConfig> = {
  [ChangeRequestStatus.DRAFT]: {
    hex: "#bfbfbf",
    hexLight: "#f5f5f5",
  },
  [ChangeRequestStatus.SUBMITTED]: {
    hex: "#1890ff",
    hexLight: "#f0f5ff",
  },
  [ChangeRequestStatus.IN_DISCUSSION]: {
    hex: "#faad14",
    hexLight: "#fffbe6",
  },
  [ChangeRequestStatus.APPROVED]: {
    hex: "#52c41a",
    hexLight: "#f6ffed",
  },
  [ChangeRequestStatus.REJECTED]: {
    hex: "#f5222d",
    hexLight: "#fff1f0",
  },
  [ChangeRequestStatus.ON_GOING]: {
    hex: "#faad14",
    hexLight: "#fffbe6",
  },
  [ChangeRequestStatus.CLOSED]: {
    hex: "#595959",
    hexLight: "#fafafa",
  },
};
