/**
 * Constants barrel file - exports all UI configuration constants and helper functions
 * Centralized configuration for Status and Priority colors, labels, and icons
 */

// Status Exports
export { STATUS_COLORS, type StatusColorConfig } from "./status.colors";

export { STATUS_LABELS } from "./status.labels";

export { STATUS_ICONS } from "./status.icons";

export {
  STATUS_HEX_COLORS,
  type StatusHexColorConfig,
} from "./status.hex-colors";

export {
  STATUS_CONFIG,
  getStatusConfig,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
  getStatusHex,
  getStatusHexLight,
  type StatusConfig,
} from "./status.config";

// Priority Exports
export { PRIORITY_COLORS, type PriorityColorConfig } from "./priority.colors";

export { PRIORITY_LABELS } from "./priority.labels";

export { PRIORITY_ICONS } from "./priority.icons";

export {
  PRIORITY_CONFIG,
  getPriorityConfig,
  getPriorityColor,
  getPriorityHex,
  getPriorityLabel,
  getPriorityIcon,
  type PriorityConfig,
} from "./priority.config";

// Admin Filter Options
export {
  DATE_RANGE_OPTIONS,
  CUSTOMER_OPTIONS,
  PM_OPTIONS,
} from "./adminFilterOptions";

// Issue Type Exports
export { ISSUE_TYPE_LABELS } from "./issue-type.labels";
