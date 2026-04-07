/**
 * Change Request Types
 * All types related to change requests
 */

export interface ChangeRequest {
  id: string;
  crKey: string;
  title: string;
  description?: string;
  spaceId: string;
  statusId: string;
  priorityId?: string;
  worktypeId?: string;
  createdBy: string;
  assignedTo?: string;
  sprintId?: string;
  estimatedHours?: number;
  dueDate?: string;
  parentId?: string; // For parent tasks
  createdAt: string;
  updatedAt: string;
}

export interface CreateChangeRequestInput {
  title: string;
  description?: string;
  spaceId: string;
  priorityId?: string;
  worktypeId?: string;
  sprintId?: string;
  estimatedHours?: number;
  dueDate?: string;
  parentId?: string;
}

export interface UpdateChangeRequestInput {
  title?: string;
  description?: string;
  priorityId?: string;
  worktypeId?: string;
  sprintId?: string;
  estimatedHours?: number;
  dueDate?: string;
  parentId?: string;
}

export interface StatusTransitionInput {
  toStatusId: string;
  notes?: string;
}

export interface SearchChangeRequestInput {
  spaceId?: string;
  statusId?: string;
  assignedTo?: string;
  search?: string; // Search by title, description, crKey
  id?: string; // Search by exact ID
  name?: string; // Search by title/name
  priorityId?: string; // Filter by priority
  parentId?: string; // Filter by parent task
  sortBy?: "createdAt" | "priority" | "dueDate" | "title"; // Sort field
  sortOrder?: "asc" | "desc"; // Sort order
}

export interface SearchChangeRequestResponse {
  items: ChangeRequest[];
  total: number;
}

export enum ChangeRequestStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  IN_DISCUSSION = "IN_DISCUSSION",
  APPROVED = "APPROVED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CLOSED = "CLOSED",
}

export enum ChangeRequestPriority {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}
