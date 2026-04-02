import { ChangeRequest, CrStatus } from "@/lib/types";
import { CrKanbanColumn } from "./CrKanbanColumn";

interface CrKanbanBoardProps {
  data: ChangeRequest[];
  onCardClick?: (cr: ChangeRequest) => void;
}

const KANBAN_COLUMNS: Array<{ status: CrStatus; title: string }> = [
  { status: CrStatus.DRAFT, title: "Draft" },
  { status: CrStatus.SUBMITTED, title: "Submitted" },
  { status: CrStatus.IN_DISCUSSION, title: "In Discussion" },
  { status: CrStatus.APPROVED, title: "Approved" },
  { status: CrStatus.REJECTED, title: "Rejected" },
  { status: CrStatus.ONGOING, title: "On Going" },
  { status: CrStatus.CLOSED, title: "Closed" },
];

export const CrKanbanBoard: React.FC<CrKanbanBoardProps> = ({
  data,
  onCardClick,
}) => {
  // Group CRs by status
  const groupedByStatus = KANBAN_COLUMNS.map((column) => ({
    ...column,
    crs: data.filter((cr) => cr.status === column.status),
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
          />
        ))}
      </div>
    </div>
  );
};
