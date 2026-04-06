export enum CrStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  IN_DISCUSSION = "in_discussion",
  APPROVED = "approved",
  REJECTED = "rejected",
  ONGOING = "ongoing",
  CLOSED = "closed",
}

export interface ChangeRequest {
  id: string;
  crKey: string;
  title: string;
  description: string;
  spaceId: string;
  space?: any;
  status: CrStatus;
  statusId?: string;
  priority: "low" | "medium" | "high" | "critical";
  priorityId?: string;
  worktypeId?: string;
  worktype?: any;
  assigneeId?: string;
  assignee?: any;
  assignedTo?: string;
  createdById?: string;
  createdBy?: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  sprintId?: string;
  sprint?: any;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  comments?: any[];
  attachments?: any[];
  statusHistory?: any[];
}
