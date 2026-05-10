export enum SubTaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
  BLOCKED = "blocked",
}

export interface CrSubTask {
  id: string;
  changeRequestId: string;
  title: string;
  description?: string;
  status: SubTaskStatus;
  assigneeId?: string;
  assignee?: any;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrStatusHistory {
  id: string;
  changeRequestId: string;
  fromStatus: string;
  toStatus: string;
  changedById: string;
  changedBy?: any;
  notes?: string;
  createdAt: string;
}
