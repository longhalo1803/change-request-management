import { Avatar } from "antd";
import { ChangeRequest } from "@/lib/types";
import {
  getCrPriority,
  getCreatorInfo,
  getUserDisplayName,
  getUserInitials,
  getAvatarColor,
} from "@/lib/helpers/cr.helpers";
import { getPriorityHex } from "@/lib/constants";

type ActorType = "customer" | "pm" | "admin";

interface CrCardProps {
  cr: ChangeRequest;
  onClick?: (cr: ChangeRequest) => void;
  actorType?: ActorType;
}

export const CrCard: React.FC<CrCardProps> = ({
  cr,
  onClick,
  actorType = "customer",
}) => {
  const priorityName = getCrPriority(cr);
  const creatorInfo = getCreatorInfo(cr);
  const creatorName = getUserDisplayName(creatorInfo);
  const priorityHex = getPriorityHex(priorityName);
  const initials = getUserInitials(creatorName);

  return (
    <div
      onClick={() => onClick?.(cr)}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all"
    >
      {/* CR ID and Priority Badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-semibold text-blue-600">{cr.crKey}</span>
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: priorityHex }}
          title={priorityName}
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
            backgroundColor: getAvatarColor(creatorName),
          }}
        >
          {initials}
        </Avatar>
        <span className="text-xs text-gray-600">{creatorName}</span>
      </div>

      {/* Role-Specific Indicators */}
      {actorType === "pm" && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          Status: {cr.status?.name || cr.statusId}
        </div>
      )}
    </div>
  );
};
