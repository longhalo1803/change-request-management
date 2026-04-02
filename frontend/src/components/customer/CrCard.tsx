import { Avatar } from "antd";
import { ChangeRequest } from "@/lib/types";

interface CrCardProps {
  cr: ChangeRequest;
  onClick?: (cr: ChangeRequest) => void;
}

const getPriorityConfig = (priority: string) => {
  const configMap: Record<string, { color: string; icon: string }> = {
    low: { color: "#1890ff", icon: "↓" },
    medium: { color: "#faad14", icon: "●" },
    high: { color: "#f5222d", icon: "↑" },
    critical: { color: "#722ed1", icon: "⚠" },
  };
  return configMap[priority] || { color: "#d9d9d9", icon: "" };
};

const getAvatarColor = (name: string) => {
  const colors = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#00a2ae",
    "#52c41a",
    "#eb2f96",
  ];
  const hash = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return colors[hash % colors.length];
};

export const CrCard: React.FC<CrCardProps> = ({ cr, onClick }) => {
  const priorityConfig = getPriorityConfig(cr.priority);
  const initials =
    cr.createdBy?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div
      onClick={() => onClick?.(cr)}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
    >
      {/* CR ID and Priority Badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-semibold text-blue-600">{cr.id}</span>
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: priorityConfig.color }}
          title={cr.priority}
        />
      </div>

      {/* CR Title */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-900 line-clamp-2">
          {cr.title}
        </p>
      </div>

      {/* Creator Avatar and Info */}
      <div className="flex items-center gap-2">
        <Avatar
          size="small"
          style={{
            backgroundColor: getAvatarColor(
              cr.createdBy?.fullName || "Unknown",
            ),
          }}
        >
          {initials}
        </Avatar>
        <span className="text-xs text-gray-600">
          {cr.createdBy?.fullName || "Unknown"}
        </span>
      </div>
    </div>
  );
};
