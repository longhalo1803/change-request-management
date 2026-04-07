import { PRIORITY_COLORS, PriorityColorConfig } from "./priority.colors";
import { PRIORITY_LABELS } from "./priority.labels";
import { PRIORITY_ICONS } from "./priority.icons";

export interface PriorityConfig extends PriorityColorConfig {
  label: string;
  icon: string;
}

/**
 * Complete priority configuration combining colors, labels, and icons
 */
export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  low: {
    color: PRIORITY_COLORS.low.color,
    hex: PRIORITY_COLORS.low.hex,
    label: PRIORITY_LABELS.low,
    icon: PRIORITY_ICONS.low,
  },
  medium: {
    color: PRIORITY_COLORS.medium.color,
    hex: PRIORITY_COLORS.medium.hex,
    label: PRIORITY_LABELS.medium,
    icon: PRIORITY_ICONS.medium,
  },
  high: {
    color: PRIORITY_COLORS.high.color,
    hex: PRIORITY_COLORS.high.hex,
    label: PRIORITY_LABELS.high,
    icon: PRIORITY_ICONS.high,
  },
  critical: {
    color: PRIORITY_COLORS.critical.color,
    hex: PRIORITY_COLORS.critical.hex,
    label: PRIORITY_LABELS.critical,
    icon: PRIORITY_ICONS.critical,
  },
};

/**
 * Get complete priority configuration
 */
export const getPriorityConfig = (priority: string): PriorityConfig => {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
};

/**
 * Get priority color (Ant Design semantic)
 */
export const getPriorityColor = (
  priority: string
): PriorityColorConfig["color"] => {
  return PRIORITY_COLORS[priority]?.color || "default";
};

/**
 * Get priority hex color
 */
export const getPriorityHex = (priority: string): string => {
  return PRIORITY_COLORS[priority]?.hex || "#d9d9d9";
};

/**
 * Get priority label
 */
export const getPriorityLabel = (priority: string): string => {
  return PRIORITY_LABELS[priority] || priority.toUpperCase();
};

/**
 * Get priority icon
 */
export const getPriorityIcon = (priority: string): string => {
  return PRIORITY_ICONS[priority] || "";
};
