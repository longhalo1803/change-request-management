import { ChangeRequest, ChangeRequestStatus } from "@/lib/types";
import { CrKanbanColumn } from "./CrKanbanColumn";

type ActorType = "customer" | "pm" | "admin";

interface CrKanbanBoardProps {
  data: ChangeRequest[];
  onCardClick?: (cr: ChangeRequest) => void;
  actorType?: ActorType;
}

const KANBAN_COLUMNS: Array<{ status: ChangeRequestStatus; title: string }> = [
  { status: ChangeRequestStatus.DRAFT, title: "Draft" },
  { status: ChangeRequestStatus.SUBMITTED, title: "Submitted" },
  { status: ChangeRequestStatus.IN_DISCUSSION, title: "In Discussion" },
  { status: ChangeRequestStatus.APPROVED, title: "Approved" },
  { status: ChangeRequestStatus.REJECTED, title: "Rejected" },
  { status: ChangeRequestStatus.ON_GOING, title: "On Going" },
  { status: ChangeRequestStatus.CLOSED, title: "Closed" },
];

/**
 * Shared Kanban Board Component
 * Used by Customer, PM, and Admin actors with role-specific column filtering
 */
export const CrKanbanBoard: React.FC<CrKanbanBoardProps> = ({
  data,
  onCardClick,
  actorType = "customer",
}) => {
  // Filter columns based on actor type
  // PM actors don't see Draft columns (they can't see customer's draft CRs)
  const visibleColumns =
    actorType === "pm"
      ? KANBAN_COLUMNS.filter((col) => col.status !== ChangeRequestStatus.DRAFT)
      : KANBAN_COLUMNS;

  // Group CRs by status - compare statusId with the status value
  const groupedByStatus = visibleColumns.map((column) => ({
    ...column,
    crs: data.filter((cr) => cr.statusId === column.status),
  }));

  return (
    <div className="overflow-x-auto">
      {/* Horizontal scroll container */}
      <div className="flex gap-6 pb-4">
        {groupedByStatus.map((column) => (
          <CrKanbanColumn
            key={column.status}
            status={column.status}
            title={column.title}
            crs={column.crs}
            onCardClick={onCardClick}
            actorType={actorType}
          />
        ))}
      </div>
    </div>
  );
};
