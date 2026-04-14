import { ChangeRequest, ChangeRequestStatus } from "@/lib/types";
import { CrKanbanColumn } from "./CrKanbanColumn";
import { useTranslation } from "react-i18next";

type ActorType = "customer" | "pm" | "admin";

interface CrKanbanBoardProps {
  data: ChangeRequest[];
  onCardClick?: (cr: ChangeRequest) => void;
  actorType?: ActorType;
}

const KANBAN_COLUMNS: Array<{ status: ChangeRequestStatus; labelKey: string }> =
  [
    { status: ChangeRequestStatus.DRAFT, labelKey: "status.draft" },
    { status: ChangeRequestStatus.SUBMITTED, labelKey: "status.submitted" },
    {
      status: ChangeRequestStatus.IN_DISCUSSION,
      labelKey: "status.in_discussion",
    },
    { status: ChangeRequestStatus.APPROVED, labelKey: "status.approved" },
    { status: ChangeRequestStatus.REJECTED, labelKey: "status.rejected" },
    { status: ChangeRequestStatus.ON_GOING, labelKey: "status.ongoing" },
    { status: ChangeRequestStatus.CLOSED, labelKey: "status.closed" },
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
  const { t } = useTranslation("common");

  // Filter columns based on actor type
  // PM and Admin actors don't see Draft columns
  const visibleColumns =
    actorType === "pm" || actorType === "admin"
      ? KANBAN_COLUMNS.filter((col) => col.status !== ChangeRequestStatus.DRAFT)
      : KANBAN_COLUMNS;

  // Group CRs by status - compare statusId with the status value
  const groupedByStatus = visibleColumns.map((column) => ({
    ...column,
    title: t(column.labelKey as any) as string,
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
