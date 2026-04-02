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
  title: string;
  description: string;
  status: CrStatus;
  priority: "low" | "medium" | "high" | "critical";
  customerId: string;
  customer?: any;
  assigneeId?: string;
  assignee?: any;
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
  quotation?: any;
  statusHistory?: any[];
}
