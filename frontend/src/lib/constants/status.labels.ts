import { ChangeRequestStatus } from "@/lib/types";

/**
 * Status labels for UI display
 */
export const STATUS_LABELS: Record<string, string> = {
  [ChangeRequestStatus.DRAFT]: "Draft",
  [ChangeRequestStatus.SUBMITTED]: "Submitted",
  [ChangeRequestStatus.IN_DISCUSSION]: "In Discussion",
  [ChangeRequestStatus.APPROVED]: "Approved",
  [ChangeRequestStatus.REJECTED]: "Rejected",
  [ChangeRequestStatus.ON_GOING]: "On going",
  [ChangeRequestStatus.CLOSED]: "Closed",
};
