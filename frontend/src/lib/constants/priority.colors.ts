export interface PriorityColorConfig {
  color: "blue" | "orange" | "red" | "purple" | "default";
  hex: string;
}

/**
 * Priority color mappings using Ant Design semantic colors and hex values
 * Ant Design colors for Tag components, hex for direct styling (CrCard, etc.)
 */
export const PRIORITY_COLORS: Record<string, PriorityColorConfig> = {
  low: { color: "blue", hex: "#1890ff" },
  medium: { color: "orange", hex: "#faad14" },
  high: { color: "red", hex: "#f5222d" },
  critical: { color: "purple", hex: "#722ed1" },
};
