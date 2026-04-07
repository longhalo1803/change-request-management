import { ChangeRequestStatus } from "@/lib/types";
import { STATUS_COLORS, StatusColorConfig } from "./status.colors";
import { STATUS_LABELS } from "./status.labels";
import { STATUS_ICONS } from "./status.icons";
import { STATUS_HEX_COLORS } from "./status.hex-colors";

export interface StatusConfig extends StatusColorConfig {
  label: string;
  icon: React.FC<any>;
}

/**
 * Complete status configuration combining colors, labels, and icons
 */
export const STATUS_CONFIG: Record<string, StatusConfig> = {
  [ChangeRequestStatus.DRAFT]: {
    color: STATUS_COLORS[ChangeRequestStatus.DRAFT].color,
    label: STATUS_LABELS[ChangeRequestStatus.DRAFT],
    icon: STATUS_ICONS[ChangeRequestStatus.DRAFT],
  },
  [ChangeRequestStatus.SUBMITTED]: {
    color: STATUS_COLORS[ChangeRequestStatus.SUBMITTED].color,
    label: STATUS_LABELS[ChangeRequestStatus.SUBMITTED],
    icon: STATUS_ICONS[ChangeRequestStatus.SUBMITTED],
  },
  [ChangeRequestStatus.IN_DISCUSSION]: {
    color: STATUS_COLORS[ChangeRequestStatus.IN_DISCUSSION].color,
    label: STATUS_LABELS[ChangeRequestStatus.IN_DISCUSSION],
    icon: STATUS_ICONS[ChangeRequestStatus.IN_DISCUSSION],
  },
  [ChangeRequestStatus.APPROVED]: {
    color: STATUS_COLORS[ChangeRequestStatus.APPROVED].color,
    label: STATUS_LABELS[ChangeRequestStatus.APPROVED],
    icon: STATUS_ICONS[ChangeRequestStatus.APPROVED],
  },
  [ChangeRequestStatus.REJECTED]: {
    color: STATUS_COLORS[ChangeRequestStatus.REJECTED].color,
    label: STATUS_LABELS[ChangeRequestStatus.REJECTED],
    icon: STATUS_ICONS[ChangeRequestStatus.REJECTED],
  },
  [ChangeRequestStatus.ON_GOING]: {
    color: STATUS_COLORS[ChangeRequestStatus.ON_GOING].color,
    label: STATUS_LABELS[ChangeRequestStatus.ON_GOING],
    icon: STATUS_ICONS[ChangeRequestStatus.ON_GOING],
  },
  [ChangeRequestStatus.CLOSED]: {
    color: STATUS_COLORS[ChangeRequestStatus.CLOSED].color,
    label: STATUS_LABELS[ChangeRequestStatus.CLOSED],
    icon: STATUS_ICONS[ChangeRequestStatus.CLOSED],
  },
};

/**
 * Get complete status configuration
 */
export const getStatusConfig = (status: string): StatusConfig => {
  return STATUS_CONFIG[status] || STATUS_CONFIG[ChangeRequestStatus.DRAFT];
};

/**
 * Get status color
 */
export const getStatusColor = (status: string): StatusColorConfig["color"] => {
  return STATUS_COLORS[status]?.color || "default";
};

/**
 * Get status label
 */
export const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status] || status;
};

/**
 * Get status icon
 */
export const getStatusIcon = (status: string): React.FC<any> => {
  return STATUS_ICONS[status] || STATUS_ICONS[ChangeRequestStatus.DRAFT];
};

/**
 * Get status hex color
 */
export const getStatusHex = (status: string): string => {
  return STATUS_HEX_COLORS[status]?.hex || "#bfbfbf";
};

/**
 * Get status light background hex color
 */
export const getStatusHexLight = (status: string): string => {
  return STATUS_HEX_COLORS[status]?.hexLight || "#f5f5f5";
};
