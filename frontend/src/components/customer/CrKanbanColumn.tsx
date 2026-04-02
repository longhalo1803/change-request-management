import { ChangeRequest, CrStatus } from "@/lib/types";
import { CrCard } from "./CrCard";

interface CrKanbanColumnProps {
  status: CrStatus;
  title: string;
  crs: ChangeRequest[];
  onCardClick?: (cr: ChangeRequest) => void;
}

const getStatusColor = (status: CrStatus): string => {
  const colorMap: Record<CrStatus, string> = {
    [CrStatus.DRAFT]: "#bfbfbf",
    [CrStatus.SUBMITTED]: "#1890ff",
    [CrStatus.IN_DISCUSSION]: "#faad14",
    [CrStatus.APPROVED]: "#52c41a",
    [CrStatus.REJECTED]: "#f5222d",
    [CrStatus.ONGOING]: "#722ed1",
    [CrStatus.CLOSED]: "#595959",
  };
  return colorMap[status] || "#d9d9d9";
};

export const CrKanbanColumn: React.FC<CrKanbanColumnProps> = ({
  status,
  title,
  crs,
  onCardClick,
}) => {
  const statusColor = getStatusColor(status);

  return (
    <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg border border-gray-200">
      {/* Column Header */}
      <div
        className="px-4 py-2 border-b-2 bg-white rounded-t-lg"
        style={{ borderBottomColor: statusColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{title}</span>
            <span className="text-sm font-semibold text-gray-600">
              {crs.length}
            </span>
          </div>
        </div>
      </div>

      {/* Column Content */}
      <div className="p-4">
        {crs.length > 0 ? (
          <div className="space-y-3">
            {crs.map((cr) => (
              <CrCard key={cr.id} cr={cr} onClick={onCardClick} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm text-center">No CRs found</p>
          </div>
        )}
      </div>
    </div>
  );
};
