import { ChangeRequest, ChangeRequestStatus } from "@/lib/types";
import { CrCard } from "./CrCard";
import { getStatusHex, getStatusHexLight } from "@/lib/constants";

interface CrKanbanColumnProps {
  status: ChangeRequestStatus;
  title: string;
  crs: ChangeRequest[];
  onCardClick?: (cr: ChangeRequest) => void;
}

/**
 * Shared Kanban Column Component
 * Used by Customer, PM, and Admin actors
 */
export const CrKanbanColumn: React.FC<CrKanbanColumnProps> = ({
  status,
  title,
  crs,
  onCardClick,
}) => {
  const statusColor = getStatusHex(status);
  const bgColor = getStatusHexLight(status);

  return (
    <div
      className="flex-shrink-0 w-80 rounded-lg border border-gray-200"
      style={{ backgroundColor: bgColor }}
    >
      {/* Column Header */}
      <div
        className="px-4 py-2 border-b-2 rounded-t-lg"
        style={{
          borderBottomColor: statusColor,
          backgroundColor: bgColor,
        }}
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
              <CrCard
                key={cr.id}
                cr={cr}
                onClick={onCardClick}
              />
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
